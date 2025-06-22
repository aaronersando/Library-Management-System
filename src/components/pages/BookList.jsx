import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Search,
  Info,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SortAsc,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const booksPerPage = 8;
  const pagesVisited = pageNumber * booksPerPage;

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
        ...doc.data(),
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

  // Reset to page 1 when search, category, or sort changes
  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm, sortField, sortDirection, categoryFilter]);

  // Filter books based on search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || book.genre === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort the filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    // Handle null values
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";

    // Special case for numeric fields
    if (sortField === "publishedYear") {
      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;
      return sortDirection === "asc" ? numA - numB : numB - numA;
    }

    // Default string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Action handlers
  const actions = {
    view: (id) => navigate(`/book-details?id=${id}`),
    edit: (id) => navigate(`/edit-book?id=${id}`),
    delete: (id) => navigate(`/delete-book?id=${id}`),
  };

  const currentBooks = sortedBooks.slice(
    pagesVisited,
    pagesVisited + booksPerPage
  );

  const pageCount = Math.ceil(sortedBooks.length / booksPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortField(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getUniqueCategories = () => {
    const categories = books
      .map((book) => book.genre || "Uncategorized")
      .filter(Boolean);
    return ["All", ...new Set(categories)].sort();
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-8 text-center">
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-8 text-center">
        <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-lg max-w-2xl mx-auto">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-30 pt-4 sm:pt-6 pb-4 sm:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4 sm:mb-6">
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
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
          />
        </div>
      </div>

      {/* Books Table */}
      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 py-8 sm:py-12 bg-white rounded-lg border">
          <p className="text-sm sm:text-base px-4">
            {searchTerm
              ? `No books found matching "${searchTerm}"`
              : "No books found. Add some books to get started!"}
          </p>
        </div>
      ) : (
        <>
          {/* Sorting controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end mb-4 space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Category Filter */}
            <div className="flex items-center space-x-2 mr-auto">
              <label
                htmlFor="category-filter"
                className="text-sm text-gray-600"
              >
                Category:
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getUniqueCategories().map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortField}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publishedYear">Published Year</option>
                <option value="genre">Genre</option>
                <option value="isbn">ISBN</option>
              </select>
            </div>

            <button
              onClick={toggleSortDirection}
              className="flex items-center space-x-1 text-sm border border-gray-300 rounded-md px-2 py-1.5 hover:bg-gray-50"
              title={sortDirection === "asc" ? "Ascending" : "Descending"}
            >
              <SortAsc
                size={16}
                className={
                  sortDirection === "desc" ? "transform rotate-180" : ""
                }
              />
              <span>{sortDirection === "asc" ? "A to Z" : "Z to A"}</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-xs sm:text-sm">
              {["TITLE", "AUTHOR", "ISBN", "CATEGORY", "ACTIONS"].map(
                (header, index) => (
                  <div
                    key={header}
                    className={`${
                      index === 4 ? "col-span-3 text-center" : "col-span-2"
                    } ${index === 0 ? "col-span-3" : ""}`}
                  >
                    {header}
                  </div>
                )
              )}
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {currentBooks.map((book) => (
                <div
                  key={book.id}
                  className="sm:grid sm:grid-cols-12 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile View */}
                  <div className="flex flex-col space-y-2 sm:hidden">
                    {/* Title with Image */}
                    <div className="flex items-start space-x-3">
                      <img
                        src={book.imageUrl || "https://placehold.co/40x50"}
                        alt={book.title}
                        className="w-10 h-12 object-cover rounded flex-shrink-0"
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/40x50")
                        }
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-gray-700 text-xs mt-1">
                          by {book.author}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          ISBN: {book.isbn}
                        </p>
                      </div>
                    </div>

                    {/* Category and Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {book.genre || "Fiction"}
                      </span>

                      <div className="flex items-center space-x-1">
                        {[
                          {
                            icon: Info,
                            action: () => actions.view(book.id),
                            color: "blue",
                            title: "View Details",
                          },
                          {
                            icon: Edit,
                            action: () => actions.edit(book.id),
                            color: "green",
                            title: "Edit Book",
                          },
                          {
                            icon: Trash2,
                            action: () => actions.delete(book.id),
                            color: "red",
                            title: "Delete Book",
                          },
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
                      onError={(e) =>
                        (e.target.src = "https://placehold.co/40x50")
                      }
                    />
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                      {book.title}
                    </h3>
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
                      {
                        icon: Info,
                        action: () => actions.view(book.id),
                        color: "blue",
                        title: "View Details",
                      },
                      {
                        icon: Edit,
                        action: () => actions.edit(book.id),
                        color: "green",
                        title: "Edit Book",
                      },
                      {
                        icon: Trash2,
                        action: () => actions.delete(book.id),
                        color: "red",
                        title: "Delete Book",
                      },
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
};

export default BookList;
