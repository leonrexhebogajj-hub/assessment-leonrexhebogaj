import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function VideoPlayer({ session }) {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch videos on mount
    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setVideos(data)
        } catch (error) {
            console.error('Error fetching videos:', error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>Loading videos...</p>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Recent Uploads</h2>
                <button
                    onClick={fetchVideos}
                    style={{ width: 'auto', background: 'transparent', color: '#6366f1', border: '1px solid #6366f1' }}
                >
                    Refresh List
                </button>
            </div>

            {videos.length === 0 ? (
                <p style={{ color: '#64748b' }}>No videos uploaded yet. upload one above!</p>
            ) : (
                <div className="video-grid">
                    {videos.map((video) => (
                        <div key={video.id} className="video-card">
                            <video controls preload="metadata">
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-info">
                                <h3>{video.title}</h3>
                                <p>{video.description || 'No description'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
