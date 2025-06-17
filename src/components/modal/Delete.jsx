import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

function Delete({ book, onClose, onBookDeleted }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const deleteBook = async () => {
        if (!book?.id) return;

        setLoading(true);
        setError("");

        try {
            await deleteDoc(doc(db, "books", book.id));
            console.log("Book deleted with Id: ", book.id);
            
            // Call callback to refresh the book list
            if (onBookDeleted) {
                onBookDeleted();
            }
            
            // Close modal
            onClose();
        } catch (err) {
            console.error("Error deleting book:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Warning Icon and Message */}
            <div className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="text-orange-600 flex-shrink-0" size={20} />
                <p className="text-sm font-medium text-orange-600">
                    This action cannot be undone
                </p>
            </div>

            {/* Confirmation Message */}
            <div className="text-gray-700">
                <p>
                    Are you sure you want to delete "{book?.title}" by {book?.author}?
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={deleteBook}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        loading
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

export default Delete;