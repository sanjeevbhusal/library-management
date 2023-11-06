import "dotenv/config";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { account, book, review, user } from "./schema";
import { NewBook, NewUser } from "./types";
import { Faker, faker } from "@faker-js/faker";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

export const db = drizzle(sql);

function generateRandomImageUrl() {
  return faker.image.url({
    height: 250,
    width: 250,
  });
}

const books: NewBook[] = [
  {
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "1984",
    author: "George Orwell",
    category: "Dystopian",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Coming of Age",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "To the Lighthouse",
    author: "Virginia Woolf",
    category: "Modernist",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "War and Peace",
    author: "Leo Tolstoy",
    category: "Historical Fiction",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Hunger Games",
    author: "Suzanne Collins",
    category: "Young Adult",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Road",
    author: "Cormac McCarthy",
    category: "Post-Apocalyptic",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Alchemist",
    author: "Paulo Coelho",
    category: "Adventure",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Shining",
    author: "Stephen King",
    category: "Horror",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Da Vinci Code",
    author: "Dan Brown",
    category: "Mystery",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "Non-Fiction",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    category: "Mystery",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Road Not Taken",
    author: "Robert Frost",
    category: "Poetry",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    category: "Fantasy",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Sun Also Rises",
    author: "Ernest Hemingway",
    category: "Modernist",
    imageUrl: generateRandomImageUrl(),
  },
  {
    name: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Children's",
    imageUrl: generateRandomImageUrl(),
  },
];

async function main() {
  // first delete all the existing data.
  console.log("Deleting all the tables...");
  await db.delete(review);
  await db.delete(book);
  await db.delete(account);
  await db.delete(user);

  // then create fresh tables
  console.log("Running Migrations to create tables...");
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });

  // now seed the data.
  // console.log("Seeding data to database...");
  for (let i = 0; i < 10; i++) {
    const u = await db.insert(user).values({
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: faker.internet.avatar(),
      jobTitle: faker.person.jobTitle(),
    });
  }
  for (let i = 0; i < books.length; i++) {
    const bookInfo = books[i];
    await db.insert(book).values({
      name: bookInfo.name,
      author: bookInfo.author,
      category: bookInfo.category,
      imageUrl: bookInfo.imageUrl,
    });
  }

  // await db.insert(review).values({
  //   content: "This is a good review",
  //   rating: "5",
  //   userId: "945db30d-1b96-42b2-ae04-8d0baeb17083",
  // });
}

main()
  .then(() => console.log("Seed successful..."))
  .catch(console.log)
  .finally(() => process.exit(0));
