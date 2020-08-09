import React, { useState, useEffect } from 'react'
import { Avatar, Button } from '@material-ui/core';
import { db } from "../../firebase"
import firebase from "firebase";

import './Post.css';

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setCommments] = useState([]);
    const [comment, setCommment] = useState("");
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setCommments(snapshot.docs.map((doc) =>
                        doc.data()))
                });
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (e) => {
        console.log(comment);
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setCommment("");
    }
    return (
        <div className="post">
            <div className="post-header">
                <Avatar className="post-avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3 className="post-name">{username}</h3>
            </div>
            <img className="post-image"
                src={imageUrl}
                alt="post" />
            <h4 className="post-text"> <strong className="post-text-user">{username}</strong>{caption}</h4>
            <div className="comments">
                {comments.map(
                    (com) => (
                        <p>
                            <strong className="post-text-user">{com.username}</strong>{com.text}
                        </p>
                    )
                )}
            </div>

            {
                user && (
                    <form className="comment-form">
                        <input
                            className="post-input"
                            type="text"
                            placeholder="Add a comment .."
                            value={comment}
                            onChange={(e) => setCommment(e.target.value)} />
                        <Button
                            className="comment-button"

                            type="submit"
                            onClick={postComment}
                        >Comment</Button>
                    </form>
                )}
        </div>
    )
}

export default Post
