import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function App() {
  const [topic, setTopic] = useState('general')   // デフォルトのトピック
  const [content, setContent] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchComments = async (t) => {
    if (!t) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/v1/comments?topic=${encodeURIComponent(t)}`)
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      setComments(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComments(topic) }, [topic])

  const addComment = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/v1/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: { topic, content } })
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.errors?.join(', ') || `Failed to create: ${res.status}`)
      }
      const created = await res.json()
      setComments(prev => [created, ...prev])
      setContent('')
    } catch (e) {
      setError(e.message)
    }
  }

  const deleteComment = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/comments/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error(`Failed to delete: ${res.status}`)
      setComments(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div style={{maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'}}>
      <h1 style={{margin: 0}}>Comments</h1>
      <p style={{color: '#666', marginTop: 8}}>トピックごとにコメントを保存できます。</p>

      <div style={{display: 'flex', gap: 8, marginTop: 16}}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="topic（例: react, rails, diary ...）"
          style={{flex: '0 0 260px', padding: 8, borderRadius: 8, border: '1px solid #ddd'}}
        />
        <button onClick={() => fetchComments(topic)} style={{padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#f6f6f6'}}>
          取得
        </button>
      </div>

      <form onSubmit={addComment} style={{marginTop: 16, display: 'flex', gap: 8}}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力"
          style={{flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd'}}
        />
        <button type="submit" style={{padding: '12px 16px', borderRadius: 8, border: 'none', background: '#1f7aed', color: 'white'}}>
          追加
        </button>
      </form>

      {error && <div style={{marginTop: 12, color: 'crimson'}}>エラー: {error}</div>}
      {loading && <div style={{marginTop: 12}}>読み込み中...</div>}

      <ul style={{listStyle: 'none', padding: 0, marginTop: 16}}>
        {comments.map(c => (
          <li key={c.id} style={{border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 12}}>
            <div>
              <div style={{fontSize: 14, color: '#666'}}>{new Date(c.created_at).toLocaleString()}</div>
              <div style={{marginTop: 4}}>{c.content}</div>
            </div>
            <button onClick={() => deleteComment(c.id)} style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff'}}>削除</button>
          </li>
        ))}
        {(!loading && comments.length === 0) && <li style={{color: '#666'}}>コメントはまだありません。</li>}
      </ul>
    </div>
  )
}

export default App
