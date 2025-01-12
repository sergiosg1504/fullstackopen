import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      console.log('id', id)
      const changedAnecdote = action.payload

      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
    append(state, action) {
      state.push(action.payload)
    },
    set(state, action) {
      return action.payload
    },
  }
})

export const { vote, append, set } = anecdoteSlice.actions

export const initializeAncedotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(set(anecdotes))
  }
}

export const createAnecdotes = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(append(newAnecdote))
  }
}

export const addVote = id => {
  return async dispatch => {
    const newVote = await anecdoteService.updateVote(id)
    dispatch(vote(newVote))
  }
}

export default anecdoteSlice.reducer 
