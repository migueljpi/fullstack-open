import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'
import { setNotification } from './setNotification'

const App = () => {

  const { isLoading, isError, data } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const notificationDispatch = useNotificationDispatch()

  const onCreateAnecdote = (anecdote) => {
    newAnecdoteMutation.mutate(anecdote, {
      onSuccess: () => {
        setNotification(notificationDispatch, `anecdote '${anecdote.content}' created`)
      }
    })
  }

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      setNotification(notificationDispatch, error.response.data.error)
    }
  })

  const updateAnecdoteMutation = useMutation({
  mutationFn: updateAnecdote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  }
})

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = data

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    setNotification(notificationDispatch, `anecdote '${anecdote.content}' voted`)
  }



  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm onCreateAnecdote={onCreateAnecdote} />
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
