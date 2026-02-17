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
        <div className="bookmarks-section">
            <h4>Bookmarks</h4>
            <form onSubmit={handleAddBookmark} className="pill-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title..."
                    className="input-pill"
                />
                <button type="submit" className="btn-small">
                    Save
                </button>
            </form>

            <div className="bookmarks-list">
                {bookmarks.map((mark) => (
                    <div
                        key={mark.id}
                        onClick={() => onRequestSeek(mark.timestamp)}
                        className="list-item"
                    >
                        <span>{mark.title}</span>
                        <span className="timestamp-badge">
                            {Math.floor(mark.timestamp)}s
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
