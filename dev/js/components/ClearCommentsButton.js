import React from 'react';
import { Button } from 'react-bootstrap';

const ClearCommentsButton = ({ onClearComments, commentsCount }) => {
  return (
    <>
      {commentsCount > 0 && (
        <Button variant="danger" className="mt-3" onClick={onClearComments}>
          Clear All Comments
        </Button>
      )}
    </>
  );
};

export default ClearCommentsButton;
