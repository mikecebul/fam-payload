import { CollectionConfig } from "payload/types";
import { geocodeAddress } from "../utils/geocoding";

const Locations: CollectionConfig = {
  slug: "locations",
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (
          data.address &&
          (!data.position || Object.keys(data.position).length === 0)
        ) {
          const position = await geocodeAddress(data.address);
          if (position) {
            data.position = {
              type: "Point",
              coordinates: [parseFloat(position.lng), parseFloat(position.lat)],
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
    },
    {
      name: "location",
      type: "group",
      label: "Location",
      fields: [
        {
          name: "address",
          type: "text",
          label: "Address",
        },
        {
          name: "position",
          type: "point",
          label: "Geo",
        },
      ],
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
              name: "group",
              type: "text",
              label: "Group",
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
                  label: "Recurring Weekly?",
                  type: "checkbox",
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
                    // condition: (data) => data?.meetings?.meeting?.dayAndTime?.isRecurring,
                  },
                },
                {
                  name: "timeOnly",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "timeOnly",
                    },
                    condition: (data) => true,
                  },
                },
                {
                  name: "singleDate",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayAndTime",
                    },
                    //   condition: (data) =>
                    //     !data?.meetings?.meeting?.dayAndTime?.isRecurring,
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
