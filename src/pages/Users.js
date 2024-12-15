import React, { useState, useEffect } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import { Spinner, Button } from "react-bootstrap";
import UserCard from "../components/UserCard";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/getusers?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("API Response:", data);

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

  useEffect(() => {
    getUsers(currentPage);
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
      <h2>Users Page</h2>
      <CardGroup>
        <Row xs={1} md={2} lg={3} className="d-flex justify-content-around">
          {users.map((user) => (
            <UserCard
              key={user._id}
              _id={user._id}
              title={`${user.first_name} ${user.last_name}`}
            />
          ))}
        </Row>
      </CardGroup>

      <div className="d-flex justify-content-center mt-4">
        <Button
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
        >
          Previous
        </Button>
        <span className="mx-3">
          Page {currentPage || "?"} of {totalPages || "?"}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
