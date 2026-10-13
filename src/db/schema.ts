import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";


// Core Better Auth tables. Application tables (products, orders, ...) go here too.
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  /**
   * The indexes on the three tables below are the ones Better Auth declares on
   * its own core schema (`index: true` in @better-auth/core's `get-tables`).
   * They are not optional niceties: every session read joins back to `user`, and
   * revoking or listing a user's sessions scans by `user_id`.
   */
  export const session = pgTable(
    "session",
    {
      id: text("id").primaryKey(),
      userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
      token: text("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [index("session_user_id_idx").on(table.userId)],
  );
  
  export const account = pgTable(
    "account",
    {
      id: text("id").primaryKey(),
      userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
      accountId: text("account_id").notNull(),
      providerId: text("provider_id").notNull(),
      accessToken: text("access_token"),
      refreshToken: text("refresh_token"),
      accessTokenExpiresAt: timestamp("access_token_expires_at"),
      refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
      scope: text("scope"),
      idToken: text("id_token"),
      /** Bcrypt-style hash for email/password sign-ins; null for social accounts. */
      password: text("password"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [index("account_user_id_idx").on(table.userId)],
  );
  
  export const verification = pgTable(
    "verification",
    {
      id: text("id").primaryKey(),
      identifier: text("identifier").notNull(),
      value: text("value").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
  );
  