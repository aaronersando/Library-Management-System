import { Book, Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Book List", path: "/books" },
    { name: "Add Book", path: "/add-book" },
    { name: "Book Details", path: "/book-details" },
    { name: "Edit Book", path: "/edit-book" },
    { name: "Delete Book", path: "/delete-book" },
  ];

  return (
    <nav className="flex flex-row place-content-between px-4 sm:px-10 md:px-20 lg:px-30 xl:px-45 pt-5 pb-3 shadow-sm z-30 relative">
      <div className="flex flex-row space-x-2">
        <Book color="blue" size={27} />
        <Link
          to="/"
          className="font-bold text-lg hover:text-blue-600 transition-colors"
        >
          Library Manager
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="xl:hidden flex items-center"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation */}
      <div className="hidden xl:flex flex-row space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `font-medium text-md px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 mt-1 py-3 px-5">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium text-md px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
