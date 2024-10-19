// Main.js
import React, { useState } from 'react';
import ReviewComponent from './ReviewComponents';
import { Button, Modal, Form } from 'react-bootstrap';
import './Main.css'; // Import Main.css

const Main = () => {
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [categories, setCategories] = useState([
    { name: 'Driver Punctuality', rating: 0 },

    { name: 'Driver Behavior', rating: 0 },
    { name: 'Comfort Level', rating: 0 },
    { name: 'Ease of Booking', rating: 0 },
    { name: 'Overall Experience', rating: 0 },
  ]);
  const [comment, setComment] = useState('');

  const handleRatingChange = (categoryIndex, newRating) => {
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex ? { ...category, rating: newRating } : category
    );
    setCategories(updatedCategories);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleClose = () => {
    console.log('Ratings:', categories);
    console.log('Comment:', comment);
    setShowModal(false);
  };

  return (
    <div className="Main d-flex justify-content-center align-items-center vh-100">
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rate Your Ride</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewComponent categories={categories} onRatingChange={handleRatingChange} />
          <Form.Group className="mt-3" controlId="comment">
            <Form.Label>Additional Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Share your thoughts about the ride..."
              value={comment}
              onChange={handleCommentChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Main;