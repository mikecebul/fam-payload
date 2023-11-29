import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
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
        read: () => true,
        create: () => false,
        // update: ({req: {user}}) => user.roles && user.roles.some((role) => role === 'admin')
      },
    },
  ],
};

export default Users;
