import React, { useState } from 'react';
import './Comment.css';

function Comment({ comment, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [isLiked, setIsLiked] = useState(false);

  const handleSave = () => {
    onEdit(text);
    setIsEditing(false);
  };

  const handleLike = () => {
    // You would typically call an API to update the like count on the backend
    setIsLiked(!isLiked);
  };

  const avatar = comment.image
    ? comment.image
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=E5E5E5&color=777`;

  return (
    <div className="comment-box">
      <div className="comment-avatar">
        <img src={avatar} alt={comment.author} />
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <strong>{comment.author}</strong>
          <span className="comment-date">{new Date(comment.date).toLocaleString()}</span>
        </div>

        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="comment-edit-textarea"
          />
        ) : (
          <p>{comment.text}</p>
        )}

        <div className="comment-actions">
          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="like-count">{comment.likes + (isLiked ? 1 : 0)}</span>
          </button>
          
          <div className="comment-controls">
            {isEditing ? (
              <>
                <button className="edit-save" onClick={handleSave}>Save</button>
                <button className="edit-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                <button className="delete-button" onClick={onDelete}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;