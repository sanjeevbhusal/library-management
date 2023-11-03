import { db } from "@/drizzle";
import BookItem from "./BookItem";
import { user } from "@/drizzle/schema";

async function fetchBooks(searchTerm: string) {
  const response = await db.select().from(user);
  console.log("==>", response);
  return [
    {
      id: 1,
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Classic",
    },
    { id: 2, name: "1984", author: "George Orwell", category: "Dystopian" },
    {
      id: 3,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Classic",
    },
    {
      id: 4,
      name: "Pride and Prejudice",
      author: "Jane Austen",
      category: "Romance",
    },
    {
      id: 5,
      name: "The Catcher in the Rye",
      author: "J.D. Salinger",
      category: "Coming of Age",
    },
    {
      id: 6,
      name: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
    },
    {
      id: 7,
      name: "To the Lighthouse",
      author: "Virginia Woolf",
      category: "Modernist",
    },
    {
      id: 8,
      name: "War and Peace",
      author: "Leo Tolstoy",
      category: "Historical Fiction",
    },
    {
      id: 9,
      name: "The Hunger Games",
      author: "Suzanne Collins",
      category: "Young Adult",
    },
    {
      id: 10,
      name: "The Road",
      author: "Cormac McCarthy",
      category: "Post-Apocalyptic",
    },
    {
      id: 11,
      name: "The Alchemist",
      author: "Paulo Coelho",
      category: "Adventure",
    },
    { id: 12, name: "The Shining", author: "Stephen King", category: "Horror" },
    {
      id: 13,
      name: "The Da Vinci Code",
      author: "Dan Brown",
      category: "Mystery",
    },
    {
      id: 14,
      name: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      category: "Non-Fiction",
    },
    {
      id: 15,
      name: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      category: "Mystery",
    },
    {
      id: 16,
      name: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      category: "Fantasy",
    },
    {
      id: 17,
      name: "The Road Not Taken",
      author: "Robert Frost",
      category: "Poetry",
    },
    {
      id: 18,
      name: "The Chronicles of Narnia",
      author: "C.S. Lewis",
      category: "Fantasy",
    },
    {
      id: 19,
      name: "The Sun Also Rises",
      author: "Ernest Hemingway",
      category: "Modernist",
    },
    {
      id: 20,
      name: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      category: "Children's",
    },
  ].filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

interface Props {
  searchTerm: string;
}

async function BookList({ searchTerm }: Props) {
  const books = await fetchBooks(searchTerm);

  return (
    <div className="flex flex-wrap gap-8 mt-8">
      {books.map((book) => {
        return <BookItem book={book} key={book.id} />;
      })}
    </div>
  );
}

export default BookList;
