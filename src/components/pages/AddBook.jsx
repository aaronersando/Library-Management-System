import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Add from "../modal/Add";

const AddBook = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/books");
  };

  const handleBookAdded = () => {
    // Navigate to book list after successful addition
    setTimeout(() => {
      navigate("/books");
    }, 1500);
  };

  const handleCancel = () => {
    // Navigate back to book list when cancelled
    navigate("/books");
  };

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Add New Book
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <Add onClose={handleCancel} onBookAdded={handleBookAdded} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBook;
