import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
  integer,
  primaryKey,
  boolean,
  PgEnumColumn,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const Category = pgEnum("Category", [
  "Fiction",
  "Romantic",
  "Children",
  "Science Fiction",
  "Mystery",
  "Biography",
  "Historical",
  "Fantasy",
]);

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
    isAdmin: boolean("isAdmin").notNull().default(false),
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
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    author: text("author").notNull(),
    category: Category("category").notNull(),
    imageUrl: text("imageUrl")
      .notNull()
      .default(
        "https://loremflickr.com/cache/resized/65535_52226317881_a072bb1153_200_200_nofilter.jpg"
      ),
    uploadedBy: text("uploadedBy").references(() => user.id),
    uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  },
  (book) => {
    return {
      bookIdx: uniqueIndex("book_idx").on(book.name),
    };
  }
);

export const review = pgTable("review", {
  id: text("id").notNull().primaryKey(),
  content: text("content").notNull(),
  rating: RatingEnum("rating"),
  userId: text("userId").references(() => user.id),
  bookId: text("bookId").references(() => book.id),
});

export const booking = pgTable("booking", {
  id: text("id").primaryKey().$defaultFn(crypto.randomUUID),
  bookId: text("bookId")
    .notNull()
    .references(() => book.id),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").defaultNow(),
  dueDate: timestamp("dueDate"),
  returnedAt: timestamp("returnedAt"),
});
