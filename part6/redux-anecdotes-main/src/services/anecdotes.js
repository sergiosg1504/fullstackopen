import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0)

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (content) => {
  const anecdote = { id: getId(), content, votes: 0 };
  const response = await axios.post(baseUrl, anecdote);
  return response.data;
};

const updateVote = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  const anecdote = response.data
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  return axios.put(`${baseUrl}/${id}`, updatedAnecdote).then(response => response.data)
}

export default {
  getAll,
  create,
  updateVote
};