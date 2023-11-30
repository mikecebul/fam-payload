import { CollectionConfig } from "payload/types";
import { geocodeAddress } from "../utils/geocoding";

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
      type: "text",
      label: "State",
      required: false,
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
          name: "meeting",
          type: "group",
          label: "Meeting",
          fields: [
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
                  label: "Talking Circle",
                  value: "talking-circle",
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
                  label: "Celbrate Recovery",
                  value: "celebrate-recovery",
                },
                {
                  label: "None",
                  value: "none",
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
            },
            {
              name: "dayAndTime",
              type: "group",
              label: "Day and Time",
              fields: [
                // {
                //   name: "isRecurring",
                //   type: "checkbox",
                //   label: "Recurring Weekly?",
                //   defaultValue: true,
                // },
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
                  admin: {
                    // condition: (_, { isRecurring }) => isRecurring,
                  },
                },
                {
                  name: "timeOnly",
                  type: "date",
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: "timeOnly",
                    },
                    // condition: (_, { isRecurring }) => isRecurring,
                  },
                },
                // {
                //   name: "singleDate",
                //   type: "date",
                //   admin: {
                //     date: {
                //       pickerAppearance: "dayAndTime",
                //     },
                //     condition: (_, { isRecurring }) => !isRecurring,
                //   },
                // },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default Locations;
