import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const user = pgTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    image: text("image"),
    jobTitle: text("jobTitle"),
  },
  (user) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(user.email),
    };
  }
);

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const RatingEnum = pgEnum("Rating", ["1", "2", "3", "4", "5"]);

export const book = pgTable(
  "book",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    author: text("author").notNull(),
    category: text("category").notNull(),
    imageUrl: text("imageUrl")
      .notNull()
      .default(
        "https://loremflickr.com/cache/resized/65535_52226317881_a072bb1153_200_200_nofilter.jpg"
      ),
    uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  },
  (book) => {
    return {
      bookIdx: uniqueIndex("book_idx").on(book.name),
    };
  }
);

export const review = pgTable("review", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  rating: RatingEnum("rating"),
  userId: text("userId").references(() => user.id),
});

export const booking = pgTable("booking", {
  id: text("id").primaryKey().$defaultFn(crypto.randomUUID),
  bookId: serial("bookId")
    .notNull()
    .references(() => book.id),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
