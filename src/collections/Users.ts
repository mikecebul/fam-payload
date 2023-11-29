import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    create: ({ req: { user } }) => user.role === "admin",
    read: ({ req: { user }, id }) => user.id === id || user.role === "admin",
    update: ({ req: { user }, id }) => user.id === id || user.role === "admin",
    delete: ({ req: { user } }) => user.role === "admin",
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      hasMany: false,
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Contributor",
          value: "contributor",
        },
        {
          label: "User",
          value: "user",
        },
      ],
      defaultValue: "user",
      access: {
        create: () => false,
        read: ({ req: { user }, id }) =>
          user.id === id || user.role === "admin",
        update: ({ req: { user } }) => user.role === "admin",
      },
    },
  ],
};

export default Users;
