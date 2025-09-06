import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState<any | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    API.get(`/movies/${id}`).then(res => setMovie(res.data))
    API.get(`/comments/${id}`).then(res => setComments(res.data))
  }, [id])

  const handleLike = async (type: number) => {
    try {
      await API.post('/likes', { movieId: id, type })
      const updated = await API.get(`/movies/${id}`)
      setMovie(updated.data)
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error')
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/comments', { movieId: id, text })
      setText('')
      const res = await API.get(`/comments/${id}`)
      setComments(res.data)
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error')
    }
  }

  if (!movie) return <p>Loading...</p>

  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={movie.poster_url} alt={movie.title} />
      <p>{movie.description}</p>
      <p>👍 {movie.likes || 0} 👎 {movie.dislikes || 0} 💬 {movie.comments || 0}</p>
      {user && (
        <div>
          <button onClick={() => handleLike(1)}>Like</button>
          <button onClick={() => handleLike(-1)}>Dislike</button>
        </div>
      )}
      <h3>Comments</h3>
      {comments.map(c => (
        <p key={c.id}><b>{c.username}:</b> {c.text}</p>
      ))}
      {user && (
        <form onSubmit={handleComment}>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  )
}
