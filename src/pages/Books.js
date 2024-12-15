import React, { useState, useEffect } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import { Button, Spinner } from "react-bootstrap";

import BookCard from "../components/BookCard";

export default function App() {
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  const getBooks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/books?page=${page}`);
      const data = await response.json();
      console.log(data);

      setBooks(Array.isArray(data.results) ? data.results : []);
      setCurrentPage(page);
      setTotalPages(data.info.pages || 1); 
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooks(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pt-5">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="container pt-5 pb-5">
      <h2>Books</h2>
      <CardGroup>
        <Row xs={1} md={2} className="d-flex justify-content-around">
          {books &&
            books.map((book) => (
              <BookCard key={book._id} {...book} />
            ))}
        </Row>
      </CardGroup>

      <div className="d-flex justify-content-center mt-4">
        <Button
          disabled={!currentPage || currentPage === 1} 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
        >
          Previous
        </Button>
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
        >
          Next
        </Button>
      </div>
    </div>
  );
}
