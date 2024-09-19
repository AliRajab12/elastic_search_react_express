import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/common/Footer";
import NavigationBar from "./components/common/Navbar";
import CommentForm from "./components/CommentForm";
import CommentList from "./components/CommentList";
import ClearCommentsButton from './components/ClearCommentsButton'; // Import the new component
import { Container, Row, Col } from "react-bootstrap";
import SearchComponent from './components/SearchComponent';

const App = () => {
  const [comments, setComments] = useState([]);

  // Function to fetch comments from the server
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch('/api/comments');
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  // Fetch comments when the component mounts
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Function to add a comment
  const addComment = async (newComment) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error('Error adding comment');
      }

      await response.json();
      fetchComments(); // Refresh comments after adding
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to clear all comments
  const clearComments = async () => {
    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error clearing comments');
      }

      fetchComments(); // Refresh comments after clearing
    } catch (error) {
      console.error('Error clearing comments:', error);
    }
  };

  return (
    <div>
      <NavigationBar />

      <Container style={{ marginTop: '80px' }}>
      <SearchComponent/>
        <Row>
          <Col md={6}>
            <h3>Add a Comment</h3>
            <CommentForm onAddComment={addComment} />
          </Col>
          <Col md={6}>
            <h3>Comments</h3>
            <CommentList comments={comments} />
            {/* Clear Button Component */}
            <ClearCommentsButton 
              onClearComments={clearComments} 
              commentsCount={comments.length} 
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
