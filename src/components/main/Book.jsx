import { Edit, Trash2 } from 'lucide-react';

const Book = ({ book, onDelete, onBookClick, onEditClick }) => {

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log("Edit book:", book.title);
    if (onEditClick) {
      onEditClick(book);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log("Delete book:", book.title);
    if (onDelete) {
      onDelete(book);
    }
  };

  const handleCardClick = () => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden cursor-pointer flex flex-col h-full w-full"
      onClick={handleCardClick}
    >
      {/* Book Image */}
      <div className="w-full">
        <img 
          src={book.imageUrl ? book.imageUrl : "https://placehold.co/200x160"} 
          alt={book.title}
          className="w-full h-32 sm:h-40 object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/200x160";
          }}
        />
      </div>

      {/* Book Details*/}
      <div className="p-3 sm:p-4 space-y-1 flex-grow">
        <h3 className="font-bold text-sm text-gray-900 leading-tight line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-xs text-gray-600">
          by {book.author}
        </p>
        
        <p className="text-xs text-gray-500">
          ISBN: {book.isbn}
        </p>
        
        <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 mt-2">
          {book.description}
        </p>

        <hr className='mt-2 text-gray-200'/>
        
        {/* Genre Tag and Actions Row */}
        <div className="flex items-center justify-between pt-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate max-w-[60%]">
            {book.genre}
          </span>

          <div className="flex space-x-1">
            <button 
              onClick={handleEdit}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit book"
            >
              <Edit size={14} />
            </button>
            
            <button 
              onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete book"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;