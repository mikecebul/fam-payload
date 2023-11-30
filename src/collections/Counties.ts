import { CollectionConfig } from "payload/types";

const Counties: CollectionConfig = {
  slug: "counties",
  access: {
    create: ({ req: { user } }) => user.role === "admin",
    read: () => true,
    update: ({ req: { user } }) => user.role === "admin",
    delete: ({ req: { user } }) => user.role === "admin",
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => user.role !== "admin",
    group: "Areas",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      name: "state",
      type: "relationship",
      relationTo: "states",
      required: true,
    },
  ],
};

export default Counties;
