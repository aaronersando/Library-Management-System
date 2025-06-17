import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Delete from "../modal/Delete";

const DeleteBook = () => {
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

  const handleBookDeleted = () => {
    // Navigate back to book list after deletion
    navigate('/books');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading book details...</p>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error || "Book not found"}
            </div>
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
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
        <div className="px-5 sm:px-20 md:px-30 lg:px-45 pt-6 pb-8">
          {/* Header with Back Button */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Book List"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Delete Book</h1>
          </div>

          {/* Delete Confirmation */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl mx-auto">
            <div className="p-8">
              <Delete 
                book={book}
                onClose={handleCancel}
                onBookDeleted={handleBookDeleted}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteBook;