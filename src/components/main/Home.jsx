import {useState} from "react";
import NavBar from "../common/NavBar";
import FooterComp from "../common/FooterComp";
import BookList from "./BookList";
import { Plus, Search } from "lucide-react";

function Home(){
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 bg-gray-50">
                {/* Header Section with same padding as NavBar */}
                <div className="px-5 sm:px-20 md:px-30 lg:px-45 pt-6 pb-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Book Collection</h1>
                        
                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            
                            {/* Add Book Button */}
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                                <Plus size={16} />
                                <span>Add Book</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Book List Component */}
                <BookList searchTerm={searchTerm} />
            </main>
            <FooterComp />
        </div>
    )
}

export default Home;