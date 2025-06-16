import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

function BookDetails({ book, onClose, onEdit, onBookDeleted, onDeleteClick }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEdit = () => {
        if (onEdit && book) {
            onEdit(book);
        }
    };

    const handleDelete = () => {
        if (!book?.id) return;
        
        // Use the delete modal instead of window.confirm
        if (onDeleteClick) {
            onDeleteClick(book);
        }
    };

    if (!book) return null;

    return (
        <div className="space-y-6">
            {/* Book Details Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Book Cover */}
                <div className="md:col-span-1">
                    <img 
                        src={book.imageUrl || "https://placehold.co/200x300"} 
                        alt={book.title}
                        className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                        onError={(e) => {
                            e.target.src = "https://placehold.co/200x300";
                        }}
                    />
                </div>

                {/* Book Information */}
                <div className="md:col-span-2 space-y-4">
                    {/* Title */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {book.title}
                        </h2>
                        <p className="text-lg text-gray-600">
                            by {book.author}
                        </p>
                    </div>

                    {/* Book Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                ISBN
                            </label>
                            <p className="text-gray-900">{book.isbn}</p>
                        </div>

                        {book.publishedYear && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Published
                                </label>
                                <p className="text-gray-900">{book.publishedYear}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Category
                            </label>
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {book.genre || "Fiction"}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {book.description && (
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">
                                Description
                            </label>
                            <p className="text-gray-700 leading-relaxed">
                                {book.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    disabled={loading}
                >
                    <Edit size={16} />
                    <span>Edit</span>
                </button>
                <button
                    onClick={handleDelete}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                        loading
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    disabled={loading}
                >
                    <Trash2 size={16} />
                    <span>{loading ? "Deleting..." : "Delete"}</span>
                </button>
            </div>
        </div>
    );
}

export default BookDetails;