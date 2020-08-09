import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from '../../firebase'
import firebase from "firebase";
import './ImageUpload.css'

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }

    }
    const handleUpload = () => {
        if (image) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error.message);
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(
                            url => {
                                db.collection("posts")
                                    .add({
                                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                        caption: caption,
                                        imageUrl: url,
                                        username: username,
                                    });
                                setProgress(0);
                                setCaption("");
                                setImage(null);
                            });
                }
            );
        }

    }

    return (
        <div className="post-items">
            <div>
                {
                    image && (
                        <progress className="progress-bar" value={progress} max="100" />

                    )
                }

            </div>
            <div>
                <input type="text" placeholder="Enter a Caption.."
                    onChange={e => setCaption(e.target.value)}
                    value={caption} className="caption-upload" />
                <input type="file" onChange={handleChange} className="image-select" />
                <Button className="image-upload" onClick={handleUpload}>Post</Button>
            </div>
        </div>
    )
}

export default ImageUpload
