import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Post from './components/Post/Post';
import { auth, db } from "./firebase"
import ImageUpload from './components/ImageUpload/ImageUpload';

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    })

  }, [user])

  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>
        (
          {
            id: doc.id,
            post: doc.data(),
          }
        )
      ))
    })
  }, [posts]);

  return (
    <div className="App">

      <Header />
      <div className="posts-column">
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />

        ) : (<h3 className="not-upload">Login to Upload</h3>)}
        {posts.map
          (
            ({ id, post }) =>
              (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />)
          )
        }</div>

    </div>
  );
}

export default App;
