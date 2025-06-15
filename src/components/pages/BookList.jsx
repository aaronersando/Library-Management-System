import { collection, getDocs} from "firebase/firestore"
import { db } from "../../config/firebase"
import { useEffect, useState } from "react";



function BookList(){
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const listBooks = async () => {
        try{
            setLoading(true);
            const bookSnapshot = await getDocs(collection(db, "books"));
            const bookList = bookSnapshot.docs.map((doc) => ({
                id: doc.id, 
                ...doc.data()
            }))

            setBooks(bookList)
            console.log("Books fetched successfully: ", bookList);
            
        } catch(err){
            console.error("Error adding book:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        listBooks()
    }, [])


    if (loading){
        return(
            <div className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Book List</h1>
                <p>Loading books...</p>
            </div>
        );
    }

    if(error){
        return(
            <div className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Book List</h1>
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
            </div>
        )
    }
    

    return(
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Book List</h1>
            
            {books.length === 0 ? (
                <div className="text-center text-gray-500"> 
                    <p>No books found. Add some books to get started!</p>
                </div>
            ): (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => {
                        return (<div key={book.id} className="border-2 rounded-xl p-6 shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Title: {book.title}</h2>
                            <p className="text-gray-700 mb-2">
                                <span className="font-bold">Author: </span>{book.author}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-bold">ISBN: </span>{book.isbn}
                            </p>
                            {book.description &&(
                                <p className="text-gray-700 mb-2">
                                    <span className="font-bold">Description: </span>{book.description}
                                </p>
                            )}
                        </div>)
                    })}
                </div>
            )};
        </div>
    )
}

export default BookList;