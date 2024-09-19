import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const CommentForm = ({ onAddComment,  }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        await onAddComment(comment); // Add the comment
        setComment(''); // Clear the input field
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="commentForm">
        <Form.Label>Write a comment:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-2">
        Add Comment
      </Button>
    </Form>
  );
};

export default CommentForm;
