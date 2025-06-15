import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState } from "react";

function Add(){
    const [bookId, setBookId] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const addBook = async () => {
        // Validation
        if (!title.trim() || !author.trim() || !isbn.trim()) {
            setMessage("Please fill in all required fields (Title, Author, ISBN)");
            return;
        }

        setLoading(true);
        setMessage("");

        try{
            const bookRef = await addDoc(collection(db, "books"), {
                bookId: bookId.trim() || Date.now().toString(), // Auto generate if empty
                title: title.trim(),
                author: author.trim(),
                isbn: isbn.trim(),
                description: description.trim(),
            });
            
            console.log("Document written with ID: ", bookRef.id);
            setMessage("Book added successfully!");
            
            // Clear form
            setBookId("");
            setTitle("");
            setAuthor("");
            setIsbn("");
            setDescription("");
            
        } catch(err){
            console.error("Error adding book:", err);
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 space-y-6 flex flex-col align-middle max-w-2xl mx-auto">
            <h1 className="text-center text-4xl font-bold">Add Book</h1>

            {message && (
                <div className={`p-4 rounded-lg text-center ${
                    message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {message}
                </div>
            )}

            <div className="flex flex-col space-y-4 text-lg border-2 rounded-2xl p-6">
                <input 
                    type="text" 
                    placeholder="Title *" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input 
                    type="text" 
                    placeholder="Author *" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input 
                    type="text" 
                    placeholder="ISBN *" 
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <textarea 
                    placeholder="Description..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded h-24 resize-none"
                    rows="3"
                />
            </div>
            
            <button 
                className={`border-2 rounded-2xl py-3 px-6 font-semibold ${
                    loading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
                onClick={addBook}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Book"}
            </button>
        </div>
    )
}

export default Add;