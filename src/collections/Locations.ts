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

        // const revalidatePath = `${process.env.NEXTJS_API}/api/revalidate`;

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
        if (
          data.address &&
          (typeof data.position === "undefined" ||
            Object.keys(data.position).length === 0)
        ) {
          const points = await geocodeAddress(data.address);
          if (points) {
            data.position = {
              type: "Point",
              coordinates: [parseFloat(points.lng), parseFloat(points.lat)],
            };
          }
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
      name: "address",
      type: "text",
      label: "Address",
      required: true,
    },
    {
      name: "position",
      type: "point",
      label: "Geo Location",
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
              name: "groupName",
              type: "text",
              label: "Group Name",
            },
            {
              name: "details",
              type: "text",
              label: "Details",
            },
            {
              name: "type",
              type: "select",
              label: "Type",
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
              name: "dayAndTime",
              type: "group",
              label: "Day and Time",
              fields: [
                {
                  name: "isRecurring",
                  type: "checkbox",
                  label: "Recurring Weekly?",
                  defaultValue: true,
                },
                {
                  name: "dayOfWeek",
                  label: "Day of the Week",
                  type: "select",
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
                    condition: (_, { isRecurring }) => isRecurring,
                  },
                },
                {
                  name: "timeOnly",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "timeOnly",
                    },
                    condition: (_, { isRecurring }) => isRecurring,
                  },
                },
                {
                  name: "singleDate",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayAndTime",
                    },
                    condition: (_, { isRecurring }) => !isRecurring,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default Locations;
