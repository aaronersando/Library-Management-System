import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";

function Edit({ book, onClose, onBookUpdated }){
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [publishedYear, setPublishedYear] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const categories = [
        "Select a category",
        "Fiction",
        "Non-Fiction", 
        "Science Fiction",
        "Fantasy",
        "Mystery",
        "Romance",
        "Biography",
        "History",
        "Self-Help",
        "Other"
    ];

    // Put all exisiting data from the book if it exists
    useEffect(() => {
        if (book) {
            setTitle(book.title || "");
            setAuthor(book.author || "");
            setIsbn(book.isbn || "");
            setPublishedYear(book.publishedYear ? book.publishedYear.toString() : "");
            setCategory(book.genre || "");
            setImageUrl(book.imageUrl || "");
            setDescription(book.description || "");
        }
    }, [book]);

    const updateBook = async () => {
        // Validation
        if (!title.trim() || !author.trim() || !isbn.trim() || !description.trim()) {
            setMessage("Please fill in all required fields (Title, Author, ISBN, Description)");
            return;
        }

        if (!book?.id) {
            setMessage("Error: Book ID not found");
            return;
        }

        setLoading(true);
        setMessage("");

        try{
            const bookRef = doc(db, "books", book.id);
            await updateDoc(bookRef, {
                title: title.trim(),
                author: author.trim(),
                isbn: isbn.trim(),
                publishedYear: publishedYear ? parseInt(publishedYear) : null,
                genre: category !== "Select a category" ? category : "Fiction",
                imageUrl: imageUrl.trim() || "https://placehold.co/200x160",
                description: description.trim()
            });
            
            console.log("Book updated with ID: ", book.id);
            setMessage("Book updated successfully!");
            
            if (onBookUpdated) {
                onBookUpdated();
            }
            
            // Close modal after a brief delay
            setTimeout(() => {
                onClose();
            }, 1500);
            
        } catch(err){
            console.error("Error updating book:", err);
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        // Reset form to original values
        if (book) {
            setTitle(book.title || "");
            setAuthor(book.author || "");
            setIsbn(book.isbn || "");
            setPublishedYear(book.publishedYear ? book.publishedYear.toString() : "");
            setCategory(book.genre || "");
            setImageUrl(book.imageUrl || "");
            setDescription(book.description || "");
        }
        setMessage("");
        onClose();
    };

    if (!book) return null;

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg text-sm text-center ${
                    message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter book title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Published Year (optional)
                    </label>
                    <input 
                        type="number" 
                        value={publishedYear}
                        onChange={(e) => setPublishedYear(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g. 2023"
                        min="1000"
                        max="2025"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter author name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category (optional)
                    </label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors appearance-none"
                    >
                        {categories.map((cat, index) => (
                            <option key={index} value={cat} disabled={index === 0}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ISBN <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter ISBN number"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image URL (optional)
                    </label>
                    <input 
                        type="url" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://example.com/book-cover.jpg"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                        rows="4"
                        placeholder="Enter book description..."
                    />
                </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                    onClick={handleCancel}
                    className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button 
                    onClick={updateBook}
                    className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                        loading 
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                    disabled={loading}
                >
                    {loading ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

export default Edit;