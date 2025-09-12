import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/comments/';

export const getComments = async () => {
  const res = await axios.get(API_URL);
  return res.data.comments;
};

export const addComment = async (comment) => {
  const res = await axios.post(API_URL, comment);
  return res.data;
};

export const updateComment = async (id, updatedData) => {
  const res = await axios.patch(`${API_URL}${id}/`, updatedData);
  return res.data;
};

export const deleteComment = async (id) => {
  await axios.delete(`${API_URL}${id}/`);
};
