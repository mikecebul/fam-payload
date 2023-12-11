import { CollectionConfig } from "payload/types";
import { PrimaryActionEmailHtml } from "../emails/primary-action-email";

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`,
        });
      },
    },
  },
  access: {
    create: () => true,
    read: ({ req: { user }, id }) => user.id === id || user.role === "admin",
    update: ({ req: { user }, id }) => user.id === id || user.role === "admin",
    delete: ({ req: { user } }) => user.role === "admin",
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
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
          user?.id === id || user?.role === "admin",
        update: ({ req: { user } }) => user.role === "admin",
      },
    },
  ],
};

export default Users;
