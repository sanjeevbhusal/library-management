import Image from 'next/image'
import BookList from './components/Booklist'
import NavBar from './components/NavBar'
import { Input } from '@/components/ui/input'


// You can continue this list with more real books and details.


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16">
      <NavBar />
      <div className='flex flex-col lg:flex-row gap-2 justify-between mt-16'>
        <h1 className='font-medium text-base lg:text-2xl'>Available Books</h1>
        <Input className=" w-full lg:w-96" placeholder='Search Books...' />
      </div>
      <BookList />
    </main>
  )
}
