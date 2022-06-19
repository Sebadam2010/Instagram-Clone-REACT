import React, { useState } from "react";
import "./App.css";
import Post from "./Post";

function App() {
  const [posts, setPosts] = useState([
    {
      username: "Sebadam",
      caption: "Great caption",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    },
    {
      username: "misunderstood_philosopher",
      caption: "Incredible read, here is my favourite section.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/4/46/Karyotakis_Nonjudicial_Notice_of_Default.jpg",
    },
    {
      username: "Doggywoggy",
      caption: "🐕🐶🐕‍🦺🐩",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/b/b4/Dr%C3%B3tosvizsla_vadat_%C3%A1ll.jpg",
    },
  ]);

  return (
    <div className="App">
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
          className="app__headerImage"
        />
      </div>

      {posts.map((post) => (
        <Post
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
