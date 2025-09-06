import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [emailOrUsername, setEou] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/login', { emailOrUsername, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={emailOrUsername} onChange={e=>setEou(e.target.value)} placeholder="Email or Username" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  )
}
