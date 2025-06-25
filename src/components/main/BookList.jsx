import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Book from "../main/Book";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, SortAsc } from "lucide-react";

function BookList({
  searchTerm = "",
  refreshTrigger = 0,
  onDeleteClick,
  onBookClick,
  onEditClick,
}) {
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const booksPerPage = 8;
  const pagesVisited = pageNumber * booksPerPage;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const listBooks = async () => {
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
    listBooks();
  }, [refreshTrigger]); // Refresh when refreshTrigger changes

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPageNumber(0);
  }, [sortField, sortDirection, searchTerm, categoryFilter]);

  // Get unique categories from books
  const getUniqueCategories = () => {
    const categories = books
      .map((book) => book.genre || "Uncategorized")
      .filter(Boolean);
    return ["All", ...new Set(categories)].sort();
  };

  const arrayRange = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );

  // Filter books based on search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || book.genre === categoryFilter;

    let start = parseInt(startYear) || 2015;
    let end = parseInt(endYear) || 2016;
    let yearRange = arrayRange(start, end, 1);

    const matchesYearRange = yearRange.includes(book.publishedYear);

    return matchesSearch && matchesCategory && matchesYearRange;
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

  const displayBooks = sortedBooks
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

  //   const handleStartYearChange = (e) => {
  //     setStartYear((e) => e.target.value);
  //   };

  //   const handleEndYearChange = (e) => {
  //     setEndYear((e) => e.target.value);
  //   };

  //   const handleYearChange = () => {
  //     let start = Number(startYear);
  //     let end = Number(endYear);

  //   };

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
    <div className="px-4 sm:px-10 md:px-20 lg:px-30 xl:px-45 pb-8">
      {/* Filtering and Sorting controls */}
      {books.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="category-filter" className="text-sm text-gray-600">
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

          <div className="space-x-2">
            <label htmlFor="year-filter" className="text-sm text-gray-600">
              Year-Range:
            </label>

            <input
              type="number"
              min={1000}
              max={2025}
              placeholder="Starting..."
              onChange={(e) => setStartYear(e.target.value)}
              value={startYear}
              className="border border-gray-300 rounded-lg px-2 py-1"
            />

            <input
              type="number"
              min={1000}
              max={2025}
              placeholder="End..."
              onChange={(e) => setEndYear(e.target.value)}
              value={endYear}
              className="border border-gray-300 rounded-lg px-2 py-1"
            />
          </div>

          {/* Sorting controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
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
        </div>
      )}

      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 py-8 sm:py-12 max-w-md mx-auto">
          <p className="text-sm sm:text-base">
            {searchTerm || categoryFilter !== "All"
              ? `No books found matching your filters`
              : "No books found. Add some books to get started!"}
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
