import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    imageUrl: text("imageUrl"),
    jobTitle: text("jobTitle"),
  },
  (user) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(user.email),
    };
  }
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
  userId: serial("userId").references(() => user.id),
});
