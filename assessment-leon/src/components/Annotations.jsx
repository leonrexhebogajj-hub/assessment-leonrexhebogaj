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
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <h4 style={{ marginBottom: '10px' }}>Annotations</h4>
            <form onSubmit={handleAddAnnotation} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a note..."
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button
                    type="submit"
                    style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
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
                            style={{
                                padding: '8px',
                                background: isActive ? '#e3f2fd' : '#f8f9fa',
                                borderLeft: isActive ? '4px solid #3498db' : '4px solid transparent',
                                marginBottom: '5px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{note.text}</span>
                            <span style={{ color: '#3498db', fontWeight: 'bold' }}>
                                {Math.floor(note.timestamp)}s
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
