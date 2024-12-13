import React, { useState, useEffect } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import { Card, Spinner, Button } from "react-bootstrap";

export default function App() {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const [currentPage, setCurrentPage] = useState(1); // To track the current page
  const [totalPages, setTotalPages] = useState(1); // To track total pages for pagination

  // Function to fetch users
  const getUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/getusers?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("API Response:", data); // Debug API response

      // Update states with the data from API response
      setUsers(data.users || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);

      console.log("Current Page:", data.currentPage);
      console.log("Total Pages:", data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component is mounted or when the page changes
  useEffect(() => {
    getUsers(currentPage);
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
      <h2>Users Page</h2>
      <CardGroup>
        <Row xs={1} md={2} lg={3} className="d-flex justify-content-around">
          {users.map((user) => (
            <div key={user._id} className="col">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {user.first_name} {user.last_name}
                  </Card.Title>
                  <Card.Text>
                    <strong>Job:</strong> {user.job} <br />
                    <strong>Year of Birth:</strong> {user.year_of_birth} <br />
                    <strong>Reviews:</strong> {user.reviews.length} <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </CardGroup>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          disabled={currentPage === 1} // Disable if on the first page
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Decrement page
        >
          Previous
        </Button>
        <span className="mx-3">
          Page {currentPage || "?"} of {totalPages || "?"}
        </span>
        <Button
          disabled={currentPage === totalPages} // Disable if on the last page
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} // Increment page
        >
          Next
        </Button>
      </div>
    </div>
  );
}
