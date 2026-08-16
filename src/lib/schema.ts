import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/** Better Auth core tables — email/password + optional GitHub. Do not swap this adapter. */
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("account_userId_idx").on(t.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

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
    listingKind: text("listing_kind").notNull().default("standalone"),
    parentId: text("parent_id"),
    compareJson: text("compare_json").notNull().default("{}"),
    details: text("details"),
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

export const orgProfiles = sqliteTable("org_profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  orgName: text("org_name"),
  ein: text("ein"),
  orgWebsite: text("org_website"),
  evidenceNote: text("evidence_note"),
  status: text("status").notNull().default("unverified"),
  submittedAt: text("submitted_at"),
  reviewedAt: text("reviewed_at"),
  reviewedBy: text("reviewed_by"),
  reviewerNote: text("reviewer_note"),
});

export const webhookEndpoints = sqliteTable("webhook_endpoints", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  secret: text("secret").notNull(),
  eventsJson: text("events_json").notNull().default('["catalog.updated"]'),
  createdAt: text("created_at").notNull(),
  lastDeliveryAt: text("last_delivery_at"),
  lastStatus: integer("last_status"),
  disabled: integer("disabled", { mode: "boolean" }).notNull().default(false),
  note: text("note"),
});

export const offeringReviews = sqliteTable(
  "offering_reviews",
  {
    id: text("id").primaryKey(),
    serviceId: text("service_id").notNull(),
    userId: text("user_id").notNull(),
    body: text("body").notNull(),
    rating: integer("rating"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("reviews_service_idx").on(t.serviceId)],
);
