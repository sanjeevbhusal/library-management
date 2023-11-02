import Image from "next/image"

interface Props {
    params: { id: number }
}


function fetchBook(bookdId: number) {
    return { id: 1, name: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic" }
}

function fetchReviews(bookId: number) {
    return [
        {
            reviewerId: 1,
            star: 4,
            title: "A Classic Masterpiece",
            description: "To Kill a Mockingbird is a timeless classic that tackles important issues with great storytelling."
        },
        {
            reviewerId: 2,
            star: 5,
            title: "Must-Read for Everyone",
            description: "This book should be on everyone's reading list. It's a brilliant piece of literature."
        },
        {
            reviewerId: 3,
            star: 3,
            title: "Good but Overrated",
            description: "While it's a good book, I think it's somewhat overhyped. There are better classics out there."
        },
        {
            reviewerId: 4,
            star: 5,
            title: "Deeply Moving",
            description: "Harper Lee's storytelling and character development are exceptional. A book that will stay with you."
        },
        {
            reviewerId: 5,
            star: 4,
            title: "Important Themes",
            description: "To Kill a Mockingbird deals with important themes of racism and justice. It's a thought-provoking read."
        },
        {
            reviewerId: 6,
            star: 5,
            title: "Heartfelt Story",
            description: "I was deeply touched by this book. The characters and their struggles are portrayed beautifully."
        },
        {
            reviewerId: 7,
            star: 2,
            title: "Not My Cup of Tea",
            description: "I couldn't connect with the characters or the story. It's just not for me."
        },
        {
            reviewerId: 8,
            star: 4,
            title: "Classic Literature Lover",
            description: "As a fan of classic literature, I thoroughly enjoyed this book. It's a must-read for any enthusiast."
        },
        {
            reviewerId: 9,
            star: 5,
            title: "An Eye-Opener",
            description: "Reading this book made me reflect on society and the need for empathy and understanding. Highly recommended."
        },
        {
            reviewerId: 10,
            star: 4,
            title: "Worth the Hype",
            description: "To Kill a Mockingbird lives up to its reputation. The characters are well-crafted, and the narrative is engaging."
        },
    ];

    // These are 10 reviews for the book with ID 1.

}

export default async function Page({ params }: Props) {
    const book = await fetchBook(params.id)
    const reviews = await fetchReviews(params.id)

    return <main className="flex min-h-screen items-center flex-col py-8 px-4 md:px-16">
        <h1 className='font-semibold text-lg text-center'>Library Management System</h1>
        <h3 className="mt-4 font-semibold text-2xl">{book.name}</h3>
        <div className="text-neutral-500 text-sm flex gap-4 mt-2 underline">
            <p>{book.author}</p>
            <p>{book.category}</p>
        </div>
        <Image src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="book picture" height={100} width={200} className='rounded-lg w-96 h-96 mt-8' />
        <button className="border px-6 py-2 bg-blue-500 rounded-md mt-6">Book Now</button>
        <div className="mt-8">
            <h1 className="font-bold text-lg">Reviews</h1>
            <div className="flex flex-col lg:flex-row gap-4 flex-wrap mt-4">
                {
                    reviews.map(review => {
                        return <div className="grow border border-black rounded-lg p-2 basis-80">
                            <div className="flex justify-between">
                                <div className="flex gap-2 ">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full border border-black">SB</div>
                                    <div className="text-sm text-neutral-600">
                                        <p className="font-semibold">Sanjeev Bhusal</p>
                                        <p>Software Engineer</p>
                                    </div>
                                </div>
                                <p className="text-yellow-500 text-sm">{review.star} *</p>

                            </div>
                            <p className="mt-2 text-sm">{review.description}</p>
                        </div>
                    })
                }
            </div>
        </div>
    </main>
}