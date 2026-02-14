import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function VideoUpload({ session, onUploadComplete }) {
    const [uploading, setUploading] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [videoFile, setVideoFile] = useState(null)

    const handleUpload = async (event) => {
        event.preventDefault()

        if (!videoFile || !title) {
            alert('Please select a video and enter a title.')
            return
        }

        try {
            setUploading(true)

            // Generate file path
            const fileExt = videoFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload directly to 'Videos Wayland' bucket
            // Path is randomized to prevent collisions
            const { error: uploadError } = await supabase.storage
                .from('Videos Wayland')
                .upload(filePath, videoFile)

            if (uploadError) {
                throw uploadError
            }

            // Get the Public URL of the uploaded file for database storage
            const { data: { publicUrl } } = supabase.storage
                .from('Videos Wayland')
                .getPublicUrl(filePath)

            // Save metadata to 'videos' table
            const { error: dbError } = await supabase
                .from('videos')
                .insert([
                    {
                        user_id: session.user.id,
                        title: title,
                        description: description,
                        url: publicUrl,
                    },
                ])

            if (dbError) {
                throw dbError
            }

            alert('Video uploaded successfully!')
            setTitle('')
            setDescription('')
            setVideoFile(null)
            if (onUploadComplete) onUploadComplete()

        } catch (error) {
            alert('Error uploading video: ' + error.message)
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="upload-container" style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Upload New Video</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div>
                    <label>Video File:</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        required
                        style={{ marginTop: '5px' }}
                    />
                </div>
                <button type="submit" disabled={uploading} style={{ alignSelf: 'center', padding: '10px 40px' }}>
                    {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    )
}
