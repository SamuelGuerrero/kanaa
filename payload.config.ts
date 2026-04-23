import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { FAQItems } from "./src/payload/collections/FAQItems";
import { GuideCards } from "./src/payload/collections/GuideCards";
import { Media } from "./src/payload/collections/Media";
import { Testimonials } from "./src/payload/collections/Testimonials";
import { Users } from "./src/payload/collections/Users";
import { HomePageContent } from "./src/payload/globals/HomePageContent";
import { seed } from "./src/payload/seed";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "— Kanaa CMS",
    },
  },

  localization: {
    locales: [
      { label: "Español", code: "es" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "es",
    fallback: true,
  },

  collections: [Users, Media, Testimonials, GuideCards, FAQItems],

  globals: [HomePageContent],

  db: sqliteAdapter({
    client: {
      url: process.env.PAYLOAD_DATABASE_URL ?? "file:./prisma/payload.db",
      // Required for Turso — distinct from TURSO_AUTH_TOKEN used by Prisma
      authToken: process.env.PAYLOAD_TURSO_AUTH_TOKEN,
    },
  }),

  editor: lexicalEditor(),

  sharp,

  secret:
    process.env.PAYLOAD_SECRET ?? "dev-secret-change-me-in-production-please",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  onInit: async (payload) => {
    await seed(payload);
  },
});
