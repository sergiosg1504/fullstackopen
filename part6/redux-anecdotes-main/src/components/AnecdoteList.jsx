import { useDispatch, useSelector } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"
import { addVote } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {

  const dispatch = useDispatch()

  const anecdotes = useSelector(state => {
    if (state.filters === null) {
      return state.anecdotes.sort((a, b) => b.votes - a.votes)
    }
    return state.anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(state.filters.toLowerCase())).sort((a, b) => b.votes - a.votes)
  })

  const vote = (anecdote) => {
    dispatch(addVote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList