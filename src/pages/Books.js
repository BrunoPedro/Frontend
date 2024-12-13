import React, { useState, useEffect } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import { Button, Spinner } from "react-bootstrap";

import BookCard from "../components/BookCard";

export default function App() {
  const [books, setBooks] = useState([]); // State to store books
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total pages

  // Function to fetch books
  const getBooks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/books?page=${page}`);
      const data = await response.json();
      console.log(data); // Debug the API response

      // Update books and pagination information
      setBooks(Array.isArray(data.results) ? data.results : []);
      setCurrentPage(page);
      setTotalPages(data.info.pages || 1); // Extract total pages from API
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when the component mounts or when the page changes
  useEffect(() => {
    getBooks(currentPage);
  }, [currentPage]);

  // Loading spinner while fetching data
  if (loading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Error message if fetching fails
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

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          disabled={!currentPage || currentPage === 1} // Disable if on the first page
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Decrement page
        >
          Previous
        </Button>
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage >= totalPages} // Disable if on the last page
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} // Increment page
        >
          Next
        </Button>
      </div>
    </div>
  );
}
