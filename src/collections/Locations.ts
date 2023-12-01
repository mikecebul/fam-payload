import { CollectionConfig } from "payload/types";
import { geocodeAddress } from "../utils/geocoding";
import { format } from "date-fns";

const Locations: CollectionConfig = {
  slug: "locations",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        const secret = process.env.REVALIDATION_SECRET;
        const path = "/";

        const revalidatePath = `${
          process.env.NEXTJS_API
        }/api/revalidate?secret=${encodeURIComponent(
          secret
        )}&path=${encodeURIComponent(path)}`;

        try {
          const response = await fetch(revalidatePath, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(
              `Revalidation failed with status: ${response.status}`
            );
          }
          const responseData = await response.json();
          console.log(responseData);
        } catch (error) {
          console.error("Revalidation failed:", error);
        }
      },
    ],
    beforeChange: [
      async ({ data }) => {
        const street = data.street;
        const city = data.city;
        const state = data.state;
        const points = await geocodeAddress(`${street}, ${city}, ${state}`);
        if (points) {
          data.position = {
            type: "Point",
            coordinates: [parseFloat(points.lng), parseFloat(points.lat)],
          };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      name: "street",
      type: "text",
      label: "Street Address",
      required: true,
    },
    {
      name: "city",
      type: "text",
      label: "City",
      required: true,
    },
    {
      name: "state",
      type: "relationship",
      relationTo: "states",
      label: "State",
      required: true,
    },
    {
      name: "county",
      type: "relationship",
      relationTo: "counties",
      label: "County",
      required: true,
    },
    {
      name: "position",
      type: "point",
      label: "Geo Location",
      access: {
        update: () => false,
      },
      admin: {
        description: ({ value }) => {
          if (value[0] === null || value[1] === null) {
            return "This will fill in automatically from the address entered above.";
          } else {
            return;
          }
        },
      },
    },
    {
      name: "meetings",
      type: "array",
      label: "List of Meetings",
      fields: [
        {
          name: "dayOfWeek",
          label: "Day of the Week",
          type: "select",
          required: true,
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
          ],
        },
        {
          name: "timeOnly",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
          },
        },
        {
          name: "pathway",
          type: "select",
          label: "Pathway",
          required: true,
          hasMany: false,
          options: [
            {
              label: "AA",
              value: "aa",
            },
            {
              label: "NA",
              value: "na",
            },
            {
              label: "OA",
              value: "oa",
            },
            {
              label: "Al-Anon",
              value: "al-anon",
            },
            {
              label: "Nar-Anon",
              value: "nar-anon",
            },
            {
              label: "Talking Circle",
              value: "talking-circle",
            },
            {
              label: "All Recovery",
              value: "all-recovery",
            },
            {
              label: "Celbrate Recovery",
              value: "celebrate-recovery",
            },
            {
              label: "Dharma Recovery",
              value: "dharma-recovery",
            },
            {
              label: "SMART Recovery",
              value: "smart-recovery",
            },
            {
              label: "Other",
              value: "other",
            },
          ],
        },
        {
          name: "gender",
          type: "select",
          label: "Gender",
          required: true,
          hasMany: false,
          defaultValue: "coed",
          options: [
            {
              label: "Coed",
              value: "coed",
            },
            {
              label: "Women",
              value: "women",
            },
            {
              label: "Men",
              value: "men",
            },
          ],
        },
        {
          name: "type",
          type: "select",
          label: "Type",
          required: true,
          hasMany: false,
          options: [
            {
              label: "In Person",
              value: "in-person",
            },
            {
              label: "Hybrid",
              value: "hybrid",
            },
            {
              label: "Zoom",
              value: "zoom",
            },
          ],
        },
        {
          name: "zoomLink",
          type: "text",
          label: "Zoom Link",
          required: true,
          validate: (value, { siblingData }) => {
            if (siblingData.type === "in-person") {
              return true;
            }
            if (typeof value !== "string" || value.trim() === "") {
              return "Zoom Link is required.";
            }

            const zoomLinkPattern = new RegExp(
              "^https:\\/\\/(\\w+\\.)?zoom\\.us\\/j\\/\\d+((\\?pwd=)?[\\w\\d]+)?$",
              "i"
            );

            if (!zoomLinkPattern.test(value)) {
              return "Please enter a valid Zoom link.";
            }
            return true;
          },
          admin: {
            condition: (_, { type }) => type !== "in-person",
          },
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data, index }: { data: any; index?: any }) => {
            if (data.dayOfWeek && data.timeOnly && !!index) {
              const formattedIndex = String(index).padStart(2, "0");
              const time = format(new Date(data.timeOnly), "h:mm a");
              const capitalize = (s: string) =>
                s && s[0].toUpperCase() + s.slice(1);
              const day = capitalize(data.dayOfWeek);
              return `${day} at ${time} - ${formattedIndex}`;
            }
            if (!!index) {
              const formattedIndex = String(index).padStart(2, "0");
              return "Meeting " + formattedIndex;
            }
            return "Meeting";
          },
        },
      },
    },
  ],
};

export default Locations;
