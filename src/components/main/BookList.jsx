import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Book from "../main/Book";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

function BookList({ searchTerm = "", refreshTrigger = 0, onDeleteClick, onBookClick, onEditClick }){
    const [books, setBooks] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);

    const booksPerPage = 8;
    const pagesVisited = pageNumber * booksPerPage;

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

    const displayBooks = filteredBooks
        .slice(pagesVisited, pagesVisited + booksPerPage)
        .map((book) => (
                        <Book 
                            key={book.id} 
                            book={book} 
                            onDelete={onDeleteClick}
                            onBookClick={onBookClick}
                            onEditClick={onEditClick}
                        />
                    ));


    const pageCount = Math.ceil(filteredBooks.length / booksPerPage);

    const changePage = ({selected}) => {
        setPageNumber(selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    

    if (loading){
        return(
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-8 text-center">
                <p>Loading books...</p>
            </div>
        );
    }

    if(error){
        return(
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-8 text-center">
                <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-lg max-w-2xl mx-auto">{error}</div>
            </div>
        );
    }
    
    return(
        <div className="px-4 sm:px-10 md:px-20 lg:px-30 xl:px-45 pb-8">
            {filteredBooks.length === 0 ? (
                <div className="text-center text-gray-500 py-8 sm:py-12 max-w-md mx-auto"> 
                    <p className="text-sm sm:text-base">
                        {searchTerm ? 
                            `No books found matching "${searchTerm}"` : 
                            "No books found. Add some books to get started!"
                        }
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {displayBooks}
                    </div>
                    
                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="flex justify-center mt-8">
                            <ReactPaginate
                                previousLabel={<ChevronLeft size={18} />}
                                nextLabel={<ChevronRight size={18} />}
                                breakLabel="..."
                                pageCount={pageCount}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                onPageChange={changePage}
                                forcePage={pageNumber}
                                
                                // Container styling
                                containerClassName="flex items-center space-x-1"
                                
                                // Page number styling
                                pageClassName="hidden sm:block"
                                pageLinkClassName="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                
                                // Active page styling
                                activeClassName="!border-blue-600"
                                activeLinkClassName="!bg-blue-600 !text-white hover:!bg-blue-700"
                                
                                // Previous/Next buttons
                                previousClassName="flex items-center"
                                nextClassName="flex items-center"
                                previousLinkClassName="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                nextLinkClassName="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                
                                // Disabled state
                                disabledClassName="opacity-50 cursor-not-allowed"
                                disabledLinkClassName="hover:!bg-transparent"
                                
                                // Break (ellipsis)
                                breakClassName="hidden sm:flex items-center"
                                breakLinkClassName="flex items-center justify-center w-8 h-8 text-gray-500"
                            />
                        </div>
                    )}
                    
                    {/* Mobile page indicator */}
                    {pageCount > 1 && (
                        <div className="sm:hidden flex justify-center mt-3 text-sm text-gray-600">
                            Page {pageNumber + 1} of {pageCount}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default BookList;