import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Annotations({ session, videoId, currentTime, onRequestSeek }) {
    const [annotations, setAnnotations] = useState([])
    const [text, setText] = useState('')

    // Fetch existing annotations whenever the videoId changes
    useEffect(() => {
        if (videoId) fetchAnnotations()
    }, [videoId])

    const fetchAnnotations = async () => {
        const { data, error } = await supabase
            .from('annotations')
            .select('*')
            .eq('video_id', videoId)
            .order('timestamp', { ascending: true })

        if (!error) setAnnotations(data)
    }

    const handleAddAnnotation = async (e) => {
        e.preventDefault()
        if (!text) return

        const { error } = await supabase
            .from('annotations')
            .insert([{
                video_id: videoId,
                user_id: session.user.id,
                text: text,
                timestamp: currentTime
            }])

        if (!error) {
            setText('')
            fetchAnnotations()
        } else {
            alert('Error adding annotation')
        }
    }

    return (
        <div className="annotations-section">
            <h4>Annotations</h4>
            <form onSubmit={handleAddAnnotation} className="pill-form">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a note..."
                    className="input-pill"
                />
                <button type="submit" className="btn-small">
                    Add
                </button>
            </form>

            <div className="annotations-list">
                {annotations.map((note) => {
                    const isActive = Math.abs(currentTime - note.timestamp) < 2
                    return (
                        <div
                            key={note.id}
                            onClick={() => onRequestSeek(note.timestamp)}
                            className={`list-item ${isActive ? 'active' : ''}`}
                        >
                            <span>{note.text}</span>
                            <span className="timestamp-badge">
                                {Math.floor(note.timestamp)}s
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
