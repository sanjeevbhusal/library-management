import Image from 'next/image'
import BookList from './components/Booklist'


// You can continue this list with more real books and details.


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col py-8 px-16">
      <h1 className='font-semibold text-lg text-center'>Library Management System</h1>
      <h1 className='mt-8 text-lg'>Available Books</h1>
      <BookList />
    </main>
  )
}
