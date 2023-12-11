import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Locations from "./collections/Locations";
import States from "./collections/States";
import Counties from "./collections/Counties";

export default buildConfig({
  serverURL: process.env.PUBLIC_PAYLOAD_BASE_URL,
  rateLimit: {
    trustProxy: true,
  },
  cors:
    process.env.NODE_ENV === "production"
      ? [process.env.NEXTJS_BASE_URL]
      : ["http://localhost:3000"],
  csrf:
    process.env.NODE_ENV === "production"
      ? [process.env.NEXTJS_BASE_URL]
      : ["http://localhost:3000"],
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, States, Counties, Locations],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
