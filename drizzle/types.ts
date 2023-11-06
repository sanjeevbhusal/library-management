import { book, booking, review, user } from "./schema";

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Book = typeof book.$inferSelect;
export type NewBook = typeof book.$inferInsert;
export type Review = typeof review.$inferSelect;
export type Booking = typeof booking.$inferSelect;
