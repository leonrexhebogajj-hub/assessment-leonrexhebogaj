import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import Annotations from './Annotations'

export default function VideoPlayer({ session }) {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const videoRefs = useRef({})

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
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleTimeUpdate = (id, time) => {
        setCurrentTime(time)
    }

    const seekTo = (id, time) => {
        if (videoRefs.current[id]) {
            videoRefs.current[id].currentTime = time
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
                <p style={{ color: '#64748b' }}>No videos uploaded yet.</p>
            ) : (
                <div className="video-grid">
                    {videos.map((video) => (
                        <div key={video.id} className="video-card">
                            <video
                                controls
                                ref={(el) => videoRefs.current[video.id] = el}
                                onTimeUpdate={(e) => handleTimeUpdate(video.id, e.target.currentTime)}
                            >
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-info">
                                <h3>{video.title}</h3>
                                <p>{video.description}</p>
                                <Annotations
                                    session={session}
                                    videoId={video.id}
                                    currentTime={currentTime}
                                    onRequestSeek={(time) => seekTo(video.id, time)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
