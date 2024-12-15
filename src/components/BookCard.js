import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

function BookCard(props) {
  const navigate = useNavigate();
  const [averageScore, setAverageScore] = useState(null); 

  const handleOpenBook = () => {
    navigate(`/book/${props._id}`);
  };

  const thumbnailUrl = props.thumbnailUrl || "path/to/default/image.jpg"; 

  const calculateAverageScore = (reviews) => {
    if (reviews && reviews.length > 0) {
      const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
      return (totalScore / reviews.length).toFixed(1);
    }
    return "N/A"; 
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/searchbook/${props._id}`);
        const data = await response.json();

        const avgScore = calculateAverageScore(data.reviews);
        setAverageScore(avgScore); 
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAverageScore("N/A"); 
      }
    };

    fetchReviews(); 
  }, [props._id]); 

  return (
    <Card style={{ width: '18rem' }} className="mb-3">
      <Card.Body className="text-center">
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          <strong>Average Score:</strong> {averageScore}
        </Card.Text>
      </Card.Body>
      
      <Card.Img
        variant="top"
        src={thumbnailUrl}
        alt={`${props.title} thumbnail`}
        onError={(e) => e.target.src = "path/to/default/image.jpg"} 
      />
      
      <Card.Body>
        <Button onClick={handleOpenBook} variant="outline-primary">
          Open Book
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
