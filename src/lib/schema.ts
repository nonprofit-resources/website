import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/**
 * Catalog services — filter columns are first-class so Turso queries can index them
 * (absolutely_free, resource_kind, intermediary_required, offer_type, category).
 */
export const services = sqliteTable(
  "services",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    offerType: text("offer_type").notNull(),
    resourceKind: text("resource_kind").notNull(),
    summary: text("summary").notNull(),
    absolutelyFree: integer("absolutely_free", { mode: "boolean" }).notNull().default(false),
    intermediaryRequired: integer("intermediary_required", { mode: "boolean" })
      .notNull()
      .default(false),
    monetaryCapUsd: integer("monetary_cap_usd"),
    userSeatLimit: integer("user_seat_limit"),
    verificationJson: text("verification_json").notNull(),
    tagsJson: text("tags_json").notNull().default("[]"),
    searchBlob: text("search_blob").notNull().default(""),
    directPortalUrl: text("direct_portal_url").notNull(),
    alternativeToUrl: text("alternative_to_url"),
    metaResource: integer("meta_resource", { mode: "boolean" }).notNull().default(false),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    iconHint: text("icon_hint"),
    screenshotPath: text("screenshot_path"),
    lastVerifiedAt: text("last_verified_at").notNull(),
    stalenessStatus: text("staleness_status").notNull().default("active"),
  },
  (t) => [
    index("services_absolutely_free_idx").on(t.absolutelyFree),
    index("services_category_idx").on(t.category),
    index("services_offer_type_idx").on(t.offerType),
    index("services_resource_kind_idx").on(t.resourceKind),
    index("services_intermediary_idx").on(t.intermediaryRequired),
    index("services_featured_idx").on(t.featured),
  ],
);

export const serviceMedia = sqliteTable("service_media", {
  id: text("id").primaryKey(),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
  kind: text("kind").notNull(),
  path: text("path").notNull(),
  alt: text("alt"),
});

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  name: text("name").notNull(),
  portalUrl: text("portal_url").notNull(),
  category: text("category").notNull(),
  offerKind: text("offer_kind").notNull(),
  summary: text("summary").notNull(),
  absolutelyFree: integer("absolutely_free", { mode: "boolean" }),
  submitterEmail: text("submitter_email"),
  status: text("status").notNull().default("pending"),
});

export const subscribers = sqliteTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull(),
  source: text("source").notNull().default("news"),
  cioSynced: integer("cio_synced", { mode: "boolean" }).notNull().default(false),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  publishedAt: text("published_at").notNull(),
  summary: text("summary"),
});
