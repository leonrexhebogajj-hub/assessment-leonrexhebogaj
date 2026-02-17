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
        <div className="upload-container">
            <h3>Submit New Content</h3>
            <form onSubmit={handleUpload} className="upload-form">
                <div className="input-group">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Enter video title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Enter video description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                    />
                </div>
                <div className="input-group">
                    <label>Video File</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        required
                        className="file-input"
                    />
                </div>
                <button type="submit" disabled={uploading}>
                    {uploading ? (
                        <span className="flex-center">
                            Signaling...
                        </span>
                    ) : 'Upload Video'}
                </button>
            </form>
        </div>
    )
}
