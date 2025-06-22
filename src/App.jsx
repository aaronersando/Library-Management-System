import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import FooterComp from "./components/common/FooterComp";
import Home from "./components/pages/Home";
import BookList from "./components/pages/BookList";
import AddBook from "./components/pages/AddBook";
import BookDetails from "./components/pages/BookDetails";
import EditBook from "./components/pages/EditBook";
import DeleteBook from "./components/pages/DeleteBook";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/book-details" element={<BookDetails />} />
          <Route path="/edit-book" element={<EditBook />} />
          <Route path="/delete-book" element={<DeleteBook />} />
        </Routes>
      </main>
      <FooterComp />
    </div>
  );
}

export default App;
