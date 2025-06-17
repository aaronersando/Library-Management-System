import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Search, Info, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const bookSnapshot = await getDocs(collection(db, "books"));
      const bookList = bookSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(bookList);
      console.log("Books fetched successfully: ", bookList);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Action handlers
  const actions = {
    view: (id) => navigate(`/book-details?id=${id}`),
    edit: (id) => navigate(`/edit-book?id=${id}`),
    delete: (id) => navigate(`/delete-book?id=${id}`)
  };

  // Loading and error states
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
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-30 pt-4 sm:pt-6 pb-4 sm:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Book Collection</h1>
        
        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
          />
        </div>
      </div>

      {/* Books Table */}
      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 py-8 sm:py-12 bg-white rounded-lg border">
          <p className="text-sm sm:text-base px-4">
            {searchTerm ? `No books found matching "${searchTerm}"` : "No books found. Add some books to get started!"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-xs sm:text-sm">
            {['TITLE', 'AUTHOR', 'ISBN', 'CATEGORY', 'ACTIONS'].map((header, index) => (
              <div key={header} className={`${index === 4 ? 'col-span-3 text-center' : 'col-span-2'} ${index === 0 ? 'col-span-3' : ''}`}>
                {header}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <div key={book.id} className="sm:grid sm:grid-cols-12 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Mobile View */}
                <div className="flex flex-col space-y-2 sm:hidden">
                  {/* Title with Image */}
                  <div className="flex items-start space-x-3">
                    <img 
                      src={book.imageUrl || "https://placehold.co/40x50"} 
                      alt={book.title}
                      className="w-10 h-12 object-cover rounded flex-shrink-0"
                      onError={(e) => e.target.src = "https://placehold.co/40x50"}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">{book.title}</h3>
                      <p className="text-gray-700 text-xs mt-1">by {book.author}</p>
                      <p className="text-gray-600 text-xs mt-0.5">ISBN: {book.isbn}</p>
                    </div>
                  </div>
                  
                  {/* Category and Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {book.genre || "Fiction"}
                    </span>

                    <div className="flex items-center space-x-1">
                      {[
                        { icon: Info, action: () => actions.view(book.id), color: "blue", title: "View Details" },
                        { icon: Edit, action: () => actions.edit(book.id), color: "green", title: "Edit Book" },
                        { icon: Trash2, action: () => actions.delete(book.id), color: "red", title: "Delete Book" }
                      ].map(({ icon: Icon, action, color, title }, index) => (
                        <button
                          key={index}
                          onClick={action}
                          className={`p-1.5 text-${color}-600 hover:bg-${color}-50 rounded-lg transition-colors`}
                          title={title}
                        >
                          <Icon size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:flex sm:col-span-3 items-center space-x-3">
                  <img 
                    src={book.imageUrl || "https://placehold.co/40x50"} 
                    alt={book.title}
                    className="w-10 h-12 object-cover rounded"
                    onError={(e) => e.target.src = "https://placehold.co/40x50"}
                  />
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">{book.title}</h3>
                </div>

                <div className="hidden sm:flex sm:col-span-2 items-center">
                  <span className="text-gray-700 text-sm">{book.author}</span>
                </div>
                
                <div className="hidden sm:flex sm:col-span-2 items-center">
                  <span className="text-gray-600 text-sm">{book.isbn}</span>
                </div>
                
                <div className="hidden sm:flex sm:col-span-2 items-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {book.genre || "Fiction"}
                  </span>
                </div>

                <div className="hidden sm:flex sm:col-span-3 items-center justify-center space-x-2">
                  {[
                    { icon: Info, action: () => actions.view(book.id), color: "blue", title: "View Details" },
                    { icon: Edit, action: () => actions.edit(book.id), color: "green", title: "Edit Book" },
                    { icon: Trash2, action: () => actions.delete(book.id), color: "red", title: "Delete Book" }
                  ].map(({ icon: Icon, action, color, title }, index) => (
                    <button
                      key={index}
                      onClick={action}
                      className={`p-2 text-${color}-600 hover:bg-${color}-50 rounded-lg transition-colors`}
                      title={title}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;