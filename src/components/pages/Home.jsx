import {useState} from "react";
import BookList from "../main/BookList";
import Modal from "../common/Modal";
import Add from "../modal/Add";
import Edit from "../modal/Edit";
import Delete from "../modal/Delete";
import BookDetails from "../modal/BookDetails";
import { Plus, Search } from "lucide-react";

function Home(){
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [bookToEdit, setBookToEdit] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [refreshBooks, setRefreshBooks] = useState(0);

    const handleAddBook = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
    };

    const handleBookAdded = () => {
        // Refresh book list by incrementing refresh counter
        setRefreshBooks(prev => prev + 1);
    };

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setBookToDelete(null);
    };

    const handleBookDeleted = () => {
        // Refresh book list after deletion
        setRefreshBooks(prev => prev + 1);
        // Also close the details modal if it's open
        if (isDetailsModalOpen) {
            setIsDetailsModalOpen(false);
            setSelectedBook(null);
        }
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedBook(null);
    };

    const handleEditFromDetails = (book) => {
        // Close details modal and open edit modal
        setIsDetailsModalOpen(false);
        setSelectedBook(null);
        setBookToEdit(book);
        setIsEditModalOpen(true);
    };

    const handleEditClick = (book) => {
        setBookToEdit(book);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setBookToEdit(null);
    };

    const handleBookUpdated = () => {
        // Refresh book list after update
        setRefreshBooks(prev => prev + 1);
    };

    const handleDeleteFromDetails = (book) => {
        setBookToDelete(book);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50">
                <div className="px-4 sm:px-10 md:px-20 lg:px-30 xl:px-45 pt-4 sm:pt-6 pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Book Collection</h1>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            
                            <button 
                                onClick={handleAddBook}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                            >
                                <Plus size={16} />
                                <span>Add Book</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Book List Component */}
                <BookList 
                    searchTerm={searchTerm} 
                    refreshTrigger={refreshBooks} 
                    onDeleteClick={handleDeleteClick}
                    onBookClick={handleBookClick}
                    onEditClick={handleEditClick}
                />
            </main>

            <Modal 
                isOpen={isAddModalOpen} 
                onClose={handleCloseModal}
                title="Add New Book"
                zIndex={50}
            >
                <Add 
                    onClose={handleCloseModal} 
                    onBookAdded={handleBookAdded}
                />
            </Modal>

            <Modal 
                isOpen={isEditModalOpen} 
                onClose={handleCloseEditModal}
                title="Edit Book"
                zIndex={60}
            >
                <Edit 
                    book={bookToEdit}
                    onClose={handleCloseEditModal} 
                    onBookUpdated={handleBookUpdated}
                />
            </Modal>

            <Modal 
                isOpen={isDetailsModalOpen} 
                onClose={handleCloseDetailsModal}
                title="Book Details"
                zIndex={50}
            >
                <BookDetails 
                    book={selectedBook}
                    onClose={handleCloseDetailsModal} 
                    onEdit={handleEditFromDetails}
                    onBookDeleted={handleBookDeleted}
                    onDeleteClick={handleDeleteFromDetails}
                />
            </Modal>

            <Modal 
                isOpen={isDeleteModalOpen} 
                onClose={handleCloseDeleteModal}
                title="Delete Book"
                zIndex={60}
            >
                <Delete 
                    book={bookToDelete}
                    onClose={handleCloseDeleteModal} 
                    onBookDeleted={handleBookDeleted}
                />
            </Modal>
        </div>
    )
}

export default Home;