import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import BookListComponent from "../main/BookList";

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  // Handlers
  const handleViewBook = (book) => {
    navigate(`/book-details?id=${book.id}`);
  };

  const handleEditBook = (book) => {
    navigate(`/edit-book?id=${book.id}`);
  };

  const handleDeleteBook = (book) => {
    navigate(`/delete-book?id=${book.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="px-4 sm:px-10 md:px-20 lg:px-30 xl:px-45 pt-4 sm:pt-6 pb-3 sm:pb-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Book Collection
            </h1>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Reused BookList Component */}
        <BookListComponent
          searchTerm={searchTerm}
          refreshTrigger={refreshTrigger}
          onBookClick={handleViewBook}
          onEditClick={handleEditBook}
          onDeleteClick={handleDeleteBook}
        />
      </main>
    </div>
  );
};

export default BookList;
