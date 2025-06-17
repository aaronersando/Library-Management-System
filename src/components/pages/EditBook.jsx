import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Edit from "../modal/Edit";

const EditBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookId = searchParams.get('id');

  const fetchBook = async () => {
    if (!bookId) {
      setError("No book ID provided");
      return;
    }

    try {
      setLoading(true);
      const bookRef = doc(db, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      
      if (bookSnap.exists()) {
        setBook({ id: bookSnap.id, ...bookSnap.data() });
      } else {
        setError("Book not found");
      }
    } catch (err) {
      console.error("Error fetching book:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const handleBack = () => {
    navigate('/books');
  };

  const handleCancel = () => {
    // Navigate back to book list when cancelled
    navigate('/books');
  };

  const handleBookUpdated = () => {
    // Navigate back to book list after update
    setTimeout(() => {
      navigate('/books');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <p className="text-base sm:text-lg text-gray-600 text-center">Loading book details...</p>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-sm sm:max-w-md">
            <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base">
              {error || "Book not found"}
            </div>
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 sm:space-x-2 mx-auto justify-center"
            >
              <ArrowLeft size={16} />
              <span>Back to Book List</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-30 pt-4 sm:pt-6 pb-6 sm:pb-8">
          {/* Header with Back Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <button
              onClick={handleBack}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Book List"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Book</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <Edit 
                book={book}
                onClose={handleCancel}
                onBookUpdated={handleBookUpdated}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditBook;