import React, { useEffect, useState } from 'react';
import { ListGroup, Pagination } from 'react-bootstrap';
import axios from 'axios';

const CommentList = ({ comments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Number of comments per page

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate the indices of the comments to be displayed on the current page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

  // Total number of pages
  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <ListGroup className="mt-3">
        {currentComments.length > 0 ? (
          currentComments.map((comment, index) => (
            <ListGroup.Item key={index}>
              <strong>{comment.text}</strong>
              <br />
              <small className="text-muted">
                {new Date(comment.date).toLocaleString()}
              </small>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No comments yet.</ListGroup.Item>
        )}
      </ListGroup>

      <Pagination className="mt-3">
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Pagination.Item
            key={pageNumber + 1}
            active={pageNumber + 1 === currentPage}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            {pageNumber + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default CommentList;
