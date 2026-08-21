import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import NewSnippet from './pages/NewSnippet'
import SnippetDetail from './pages/SnippetDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/new" element={<NewSnippet />} />
      <Route path="/snippet/:id" element={<SnippetDetail />} />
    </Routes>
  )
}

export default App