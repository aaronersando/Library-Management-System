import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Book from "../main/Book";

function BookList({ searchTerm = "", refreshTrigger = 0, onDeleteClick, onBookClick, onEditClick }){
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
            }));

            setBooks(bookList);
            console.log("Books fetched successfully: ", bookList);
            
        } catch(err){
            console.error("Error fetching books:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        listBooks();
    }, [refreshTrigger]); // Refresh when refreshTrigger changes

    // Filter books based on search term passed from Home
    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading){
        return(
            <div className="px-5 sm:px-20 md:px-30 lg:px-45 py-8 text-center">
                <p>Loading books...</p>
            </div>
        );
    }

    if(error){
        return(
            <div className="px-5 sm:px-20 md:px-30 lg:px-45 py-8 text-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
            </div>
        );
    }
    
    return(
        <div className="px-5 sm:px-20 md:px-30 lg:px-45 pb-8">
            {filteredBooks.length === 0 ? (
                <div className="text-center text-gray-500 py-12"> 
                    <p>
                        {searchTerm ? 
                            `No books found matching "${searchTerm}"` : 
                            "No books found. Add some books to get started!"
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredBooks.map((book) => (
                        <Book 
                            key={book.id} 
                            book={book} 
                            onDelete={onDeleteClick}
                            onBookClick={onBookClick}
                            onEditClick={onEditClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookList;