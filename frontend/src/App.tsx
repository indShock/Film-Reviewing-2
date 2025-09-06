import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MovieDetails from './pages/MovieDetails'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, logout } = useAuth()

  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  )
}

export default App
