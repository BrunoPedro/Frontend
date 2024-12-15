import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Book() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/books/searchbook/${id}`);
      const data = await response.json();
      if (data.book) {
        setBook(data);
      } else {
        setError("Book not found");
      }
    } catch (err) {
      setError("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const { book: bookDetails, reviews, pagination } = book;

  return (
    <div className="container pt-5 pb-5">
      <h2>{bookDetails.title}</h2>
      <div className="row gx-0"> 
        <div className="col-md-6" style={{ paddingRight: "10px" }}> 
          <img
            src={bookDetails.thumbnailUrl}
            alt={bookDetails.title}
            style={{
              width: "300px",
              height: "450px" 
            }}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6" style={{ paddingRight: "10px" }}> 
          <p>
            <strong>ISBN:</strong> {bookDetails.isbn}
          </p>
          <p>
            <strong>Authors:</strong> {bookDetails.authors}
          </p>
          <p>
            <strong>Categories:</strong> {bookDetails.categories.join(", ")}
          </p>
          <p>
            <strong>Published Date:</strong> {new Date(bookDetails.publishedDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Short Description:</strong> {bookDetails.shortDescription}
          </p>
          <p>
            <strong>Long Description:</strong> {bookDetails.longDescription}
          </p>
          <p>
            <strong>Status:</strong> {bookDetails.status}
          </p>
        </div>
      </div>
      <hr />
      <h3>Reviews (Average Score: {book.averageScore})</h3>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            <strong>Score:</strong> {review.score} |{" "}
            <strong>Recommended:</strong> {review.recommendation ? "Yes" : "No"} |{" "}
            <strong>Date:</strong>{" "}
            {new Date(parseInt(review.review_date)).toLocaleDateString()}
            <p>{review.review}</p>
            <h5>Comments:</h5>
            {book.comments[index] && <p>{book.comments[index].comment}</p>} 
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
