import { useDispatch } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"
import { createAnecdotes } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdotesInput.value
    event.target.anecdotesInput.value = ''
    dispatch(createAnecdotes(content))
    dispatch(setNotification(`new anecdote '${content}'`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdotesInput' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm