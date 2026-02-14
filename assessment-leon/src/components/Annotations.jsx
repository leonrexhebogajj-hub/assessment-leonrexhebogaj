import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Annotations({ session, videoId, currentTime, onRequestSeek }) {
    const [annotations, setAnnotations] = useState([])
    const [text, setText] = useState('')

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
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
            <h4>Annotations</h4>
            <form onSubmit={handleAddAnnotation} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a note at this timestamp..."
                    style={{ flex: 1 }}
                />
                <button type="submit">Add Note</button>
            </form>

            <div className="annotations-list">
                {annotations.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => onRequestSeek(note.timestamp)}
                        style={{
                            padding: '10px',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span>{note.text}</span>
                        <span style={{ color: '#007bff' }}>
                            {Math.floor(note.timestamp)}s
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
