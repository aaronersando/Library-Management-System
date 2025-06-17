import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/pages/Home";
import BookList from "./components/pages/BookList";
import AddBook from "./components/pages/AddBook";
import BookDetails from "./components/pages/BookDetails";
import EditBook from "./components/pages/EditBook";
import DeleteBook from "./components/pages/DeleteBook";

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/book-details" element={<BookDetails />} />
                <Route path="/edit-book" element={<EditBook />} />
                <Route path="/delete-book" element={<DeleteBook />} />
            </Routes>
        </Router>
    )
}

export default App;