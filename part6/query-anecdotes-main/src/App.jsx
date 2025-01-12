import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from './requests'
import { useNotificationDispatch } from './notificationContext'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {

  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  console.log(JSON.parse(JSON.stringify(result)))

  const updateVoteMutation = useMutation(updateVote, {
    onSuccess: (updatedAnecdote) => {

      console.log('update', updatedAnecdote)

      const anecdotes = queryClient.getQueryData('anecdotes')

      queryClient.setQueryData('anecdotes', anecdotes.map(anecdote =>

        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote

      ))
    }
  })

  if (result.isError) {
    return <div>anecdote service not avaiable due to problems in server</div>
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data



  const handleVote = async (anecdote) => {
    updateVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })

    await dispatch({ type: 'showNotification', payload: `you voted: ${anecdote.content}` })

    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)

    console.log('vote')
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
