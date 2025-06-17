import { Book } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function NavBar(){
    const location = useLocation();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Book List", path: "/books" },
        { name: "Add Book", path: "/add-book" },
        { name: "Book Details", path: "/book-details" },
        { name: "Edit Book", path: "/edit-book" },
        { name: "Delete Book", path: "/delete-book" }
    ];

    return(
        <nav className="flex flex-row place-content-between px-5 sm:px-20 md:px-30 lg:px-45 pt-5 pb-3 shadow-sm z-30">
            <div className="flex flex-row space-x-2">
                <Book color="blue" size={27}/>
                <Link to="/" className="font-bold text-lg hover:text-blue-600 transition-colors">
                    Library Manager
                </Link>
            </div>
            <div className="flex flex-row space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`font-medium text-md px-3 py-1.5 rounded-md transition-colors ${
                            location.pathname === item.path
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default NavBar;