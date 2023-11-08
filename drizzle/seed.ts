import "dotenv/config";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { account, book, booking, review, user } from "./schema";
import { Book, Booking, NewBook, NewUser, User } from "./types";
import { Faker, faker } from "@faker-js/faker";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { eq } from "drizzle-orm";
import ms from "ms";

export const db = drizzle(sql);

function generateRandomImageUrl() {
  return faker.image.url({
    height: 250,
    width: 250,
  });
}

const booksData = [
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

async function deleteTables() {
  await db.delete(booking);
  await db.delete(review);
  await db.delete(book);
  await db.delete(account);
  await db.delete(user);
}

async function createTables() {
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
}

async function seedUsers() {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const u = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        image: faker.internet.avatar(),
        jobTitle: faker.person.jobTitle(),
        isAdmin: Math.random() < 0.2 ? true : false,
      })
      .returning();
    users.push(u[0]);
  }
  return users;
}

async function seedBooks(users: User[], books: any[]) {
  const bookList = [];
  for (let i = 0; i < books.length; i++) {
    const bookInfo = books[i];
    const b = await db
      .insert(book)
      .values({
        id: crypto.randomUUID(),
        name: bookInfo.name,
        author: bookInfo.author,
        category: bookInfo.category,
        imageUrl: bookInfo.imageUrl,
        uploadedBy: users[Math.floor(Math.random() * users.length)].id,
      })
      .returning();
    bookList.push(b[0]);
  }
  return bookList;
}

function getRandomFutureDate() {
  // a millisecond value within 1 and 30 days.
  const futureDateMilliseconds =
    Date.now() + ms(Math.floor(Math.random() * 30) + 1 + "d");
  return new Date(futureDateMilliseconds);
}

async function seedBookings(users: User[], books: Book[]) {
  // select 5 random users and create bookings for them.
  // those 5 random users should have 1 - 3 bookings each.
  const bookings = [];

  for (let i = 0; i < 5; i++) {
    const user = users[Math.floor(Math.random() * 10)];

    const numBookings = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < numBookings; j++) {
      const book = books[Math.floor(Math.random() * 20)];
      const b = await db
        .insert(booking)
        .values({
          id: crypto.randomUUID(),
          bookId: book.id,
          userId: user.id,
          dueDate: getRandomFutureDate(),
        })
        .returning();
      bookings.push(b[0]);
    }
  }
  return bookings;
}

async function seedReviews(bookings: Booking[]) {
  for (let i = 0; i < bookings.length; i++) {
    const shouldCreateReview = Math.random() < 0.5 ? true : false;

    if (!shouldCreateReview) {
      continue;
    }

    const bookingItem = bookings[i];

    await db.insert(review).values({
      id: crypto.randomUUID(),
      bookId: bookingItem.bookId,
      userId: bookingItem.userId,
      content: faker.lorem.paragraph(Math.floor(Math.random() * 5) + 1),
    });
  }
}

async function seedData() {
  const users = await seedUsers();
  const adminUsers = users.filter((user) => user.isAdmin === true);
  const books = await seedBooks(adminUsers, booksData);
  const bookings = await seedBookings(users, books);
  await seedReviews(bookings);

  // await db.insert(review).values({
  //   content: "This is a good review",
  //   rating: "5",
  //   userId: "945db30d-1b96-42b2-ae04-8d0baeb17083",
  // });
}

async function main() {
  console.log("Deleting all the tables...");
  await deleteTables();

  console.log("Running Migrations to create tables...");
  await createTables();

  console.log("Seeding data ...");
  await seedData();
}

async function makeTestUserAdmin() {
  // only run this when you have created the user via app login.
  await db
    .update(user)
    .set({ isAdmin: true })
    .where(eq(user.email, "sanjeev.bhusal@securitypalhq.com"));
}

async function createBookingForTestUser() {
  // only run this when you have created the user via app login.
  const books = await db.select().from(book);
  const u = await db
    .select()
    .from(user)
    .where(eq(user.email, "sanjeev.bhusal@securitypalhq.com"));
  for (let i = 0; i < 5; i++) {
    const book = books[i];
    await db.insert(booking).values({
      id: crypto.randomUUID(),
      bookId: book.id,
      userId: u[0].id,
      dueDate: getRandomFutureDate(),
    });
  }
}
const testUserUploadedBooks = [
  {
    name: "Whispers of the Celestial Serpent",
    author: "Evelyn Sterling",
    category: "Fantasy",
  },

  {
    name: "Chronicles of the Clockwork Kingdom",
    author: "Victor Thorne",
    category: "Steampunk",
  },

  {
    name: "The Quantum Paradox",
    author: "Lila Everett",
    category: "Science Fiction",
  },

  {
    name: "Midnight Roses and Secret Passages",
    author: "Lucia Blackwood",
    category: "Mystery",
  },

  {
    name: "Eternal Echoes of Elysium",
    author: "Serenity Wells",
    category: "Romance",
  },

  {
    name: "The Enchanted Atlas",
    author: "Orion Skylar",
    category: "Adventure",
  },

  {
    name: "Serpents of the Lost Realm",
    author: "Xander Drake",
    category: "Fantasy",
  },

  {
    name: "The Luminous Labyrinth",
    author: "Aria Nightshade",
    category: "Mystery",
  },

  {
    name: "Infinite Realms of Imagination",
    author: "Quincy Rivers",
    category: "Science Fiction",
  },

  {
    name: "The Obsidian Amulet",
    author: "Mara Blackthorn",
    category: "Historical Fiction",
  },
];

async function uploadBooksByTestUser() {
  const u = await db
    .select()
    .from(user)
    .where(eq(user.email, "sanjeev.bhusal@securitypalhq.com"));
  await seedBooks([u[0]], testUserUploadedBooks);
}

async function main2() {
  // await makeTestUserAdmin();
  // await createBookingForTestUser();
  await uploadBooksByTestUser();
}

main2()
  .then(() => console.log("Seed successful..."))
  .catch(console.log)
  .finally(() => process.exit(0));
