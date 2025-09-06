import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

export default function Home() {
  const [movies, setMovies] = useState<any[]>([])

  useEffect(() => {
    API.get('/movies?limit=20').then(res => setMovies(res.data))
  }, [])

  return (
    <div>
      <h1>Movies</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movies.map(m => (
          <div key={m.id} style={{ width: '200px', margin: '10px' }}>
            <Link to={`/movie/${m.id}`}>
              <img src={m.poster_url} alt={m.title} width="200" />
              <p>{m.title}</p>
            </Link>
            <p>👍 {m.likes || 0} 👎 {m.dislikes || 0} 💬 {m.comments || 0}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
