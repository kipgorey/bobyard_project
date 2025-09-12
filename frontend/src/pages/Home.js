import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Comment from '../components/Comment/Comment';
import '../styles/Home.css';
import { getComments, addComment, updateComment, deleteComment } from '../services/api';

const COMMENTS_PER_PAGE = 5;

function Home() {
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  const observer = useRef();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newText]);

  const lastCommentElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const fetchComments = async (pageNum) => {
    try {
      const allComments = await getComments();
      const sorted = allComments.sort((a, b) => new Date(b.date) - new Date(a.date));
      const startIndex = (pageNum - 1) * COMMENTS_PER_PAGE;
      const endIndex = startIndex + COMMENTS_PER_PAGE;
      const newComments = sorted.slice(startIndex, endIndex);

      if (newComments.length === 0) {
        setHasMore(false);
      }

      setComments(prevComments => [...prevComments, ...newComments]);
    } catch (err) {
      console.error('Error fetching comments', err);
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const handleAdd = async () => {
    if (!newText.trim() || isSending) return;

    setIsSending(true);

    const newComment = {
      id: Date.now().toString(),
      author: 'Admin',
      text: newText,
      date: new Date().toISOString(),
      likes: 0,
      image: ''
    };

    try {
      const addedComment = await addComment(newComment);
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewText('');
    } catch (err) {
      console.error('Error adding comment', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (isSending) return; // Prevent deleting while another operation is in progress
    setIsSending(true);

    try {
      setComments(prevComments => prevComments.filter(c => c.id !== id)); // Optimistic UI update
      await deleteComment(id); // Asynchronous backend call
    } catch (err) {
      console.error('Error deleting comment', err);
      // Optional: Revert the UI change if the backend call fails
    } finally {
      setIsSending(false);
    }
  };

  const handleEdit = async (id, updatedText) => {
    if (isSending) return;
    setIsSending(true);
    
    try {
      setComments(prevComments =>
        prevComments.map(c =>
          c.id === id ? { ...c, text: updatedText } : c
        )
      );
      await updateComment(id, { text: updatedText });
    } catch (err) {
      console.error('Error updating comment', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="home-container">
        <h2 className="home-title">Comments</h2>

        <div className="add-comment">
          <textarea
            ref={textareaRef}
            placeholder="Add a new comment..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={1}
          />
          <button onClick={handleAdd} disabled={isSending}>
            {isSending ? (
              <div className="spinner"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>

        <div className="comments-scroll-container">
          {comments.map((c, index) => {
            if (comments.length === index + 1 && hasMore) {
              return (
                <div ref={lastCommentElementRef} key={c.id}>
                  <Comment 
                    comment={c} 
                    onDelete={() => handleDelete(c.id)} 
                    onEdit={(updatedText) => handleEdit(c.id, updatedText)} 
                    isSending={isSending} // Pass the state to the child component
                  />
                </div>
              );
            } else {
              return (
                <Comment
                  key={c.id}
                  comment={c}
                  onDelete={() => handleDelete(c.id)}
                  onEdit={(updatedText) => handleEdit(c.id, updatedText)}
                  isSending={isSending} // Pass the state to the child component
                />
              );
            }
          })}
          {comments.length > 0 && !hasMore && <div className="no-more-comments">No more comments to load.</div>}
        </div>
      </main>
    </div>
  );
}

export default Home;