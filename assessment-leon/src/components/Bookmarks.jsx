import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Bookmarks({ session, videoId, currentTime, onRequestSeek }) {
    const [bookmarks, setBookmarks] = useState([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        if (videoId) fetchBookmarks()
    }, [videoId])

    const fetchBookmarks = async () => {
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('video_id', videoId)
            .order('timestamp', { ascending: true })

        if (!error) setBookmarks(data)
    }

    const handleAddBookmark = async (e) => {
        e.preventDefault()
        if (!title) return

        const { error } = await supabase
            .from('bookmarks')
            .insert([{
                video_id: videoId,
                user_id: session.user.id,
                title: title,
                timestamp: currentTime
            }])

        if (!error) {
            setTitle('')
            fetchBookmarks()
        } else {
            alert('Error adding bookmark')
        }
    }

    return (
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <h4 style={{ marginBottom: '10px' }}>Bookmarks</h4>
            <form onSubmit={handleAddBookmark} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bookmark Title..."
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button
                    type="submit"
                    style={{ padding: '8px 15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Save
                </button>
            </form>

            <div className="bookmarks-list">
                {bookmarks.map((mark) => (
                    <div
                        key={mark.id}
                        onClick={() => onRequestSeek(mark.timestamp)}
                        style={{
                            padding: '8px',
                            background: '#f0fdf4',
                            marginBottom: '5px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            border: '1px solid #dcfce7'
                        }}
                    >
                        <span>{mark.title}</span>
                        <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                            {Math.floor(mark.timestamp)}s
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
