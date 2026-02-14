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

            // 1. Upload file to Supabase Storage
            const fileExt = videoFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filePath, videoFile)

            if (uploadError) {
                throw uploadError
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath)

            // 3. Save metadata to 'videos' table
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
            if (onUploadComplete) onUploadComplete() // Refresh the list if needed

        } catch (error) {
            alert('Error uploading video: ' + error.message)
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
                <button type="submit" disabled={uploading} style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>
                    {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    )
}
