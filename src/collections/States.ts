import { CollectionConfig } from "payload/types";
import { stateOptions } from "../utils/state-options";

const States: CollectionConfig = {
  slug: "states",
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
      type: "select",
      label: "Name",
      required: true,
      unique: true,
      options: stateOptions,
    },
  ],
};

export default States;
