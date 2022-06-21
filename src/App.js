import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { query, orderBy, limit, onSnapshot } from "firebase/firestore";
import {
  collection,
  documentId,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Avatar, Input } from "@mui/material";
import ImageUpload from "./ImageUpload";
import { border, textAlign } from "@mui/system";
import { InstagramEmbed } from "react-social-media-embed";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });

    return () => {
      //perform cleanup action before useeffect is fired
      unsubscribe();
    };
  }, [user, username]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };
  const signInOpen = () => setOpenSignIn(true);
  const signInClose = () => {
    setOpenSignIn(false);
    setEmail("");
    setPassword("");
  };
  const handleUploadOpen = () => setUploadOpen(true);
  const handleUploadClose = () => setUploadOpen(false);
  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(authUser.user, { displayName: username });
      })
      .then((authUser) => {
        alert("You have succesfully signed up!");
        handleClose();
        setUser(authUser);
      })
      .catch((error) => alert(error.message));

    // auth
    //   .createUserWithEmailAndPassword(email, password)
    //   .catch((error) => alert(error.message));
  };
  const signIn = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error.message)
    );

    setOpenSignIn(false);
  };

  //Query to allow to order by and select collection
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

  useEffect(() => {
    onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
  }, []);

  return (
    <div className="App">
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram Logo"
            />
          </center>

          <form className="app__signup">
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              {" "}
              Sign Up{" "}
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openSignIn} onClose={signInClose}>
        <Box sx={style}>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram Logo"
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              {" "}
              Sign In{" "}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* MODAL FOR HANDLING UPLOAD */}
      <Modal open={uploadOpen} onClose={handleUploadClose}>
        <Box sx={{ ...style, width: 400 }}>
          {user?.displayName ? (
            <div>
              <h2 style={{ textAlign: "center" }}> Image Upload</h2>
              <ImageUpload username={user.displayName} />
            </div>
          ) : (
            <h2 style={{ textAlign: "center" }}> Need to login to upload</h2>
          )}
        </Box>
      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
          className="app__headerImage"
        />

        {user ? (
          <div className="app__loginContainer--signedIn">
            <p>
              Signed in as: <strong>{user.displayName}</strong>
            </p>
            <a href="#" onClick={handleUploadOpen}>
              <img
                style={{ width: "30px", objectFit: "contain" }}
                src="https://static.thenounproject.com/png/809337-200.png"
              />
            </a>
            <Button
              variant="contained"
              type="submit"
              onClick={() => auth.signOut()}
            >
              {" "}
              Sign Out{" "}
            </Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button variant="contained" type="submit" onClick={setOpenSignIn}>
              Sign In
            </Button>
            <Button variant="contained" type="submit" onClick={handleOpen}>
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          <h4 style={{ textAlign: "center", paddingBottom: "10px" }}>
            {" "}
            News Feed
          </h4>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        <div className="app__postsRight">
          <h4 style={{ textAlign: "center", paddingBottom: "10px" }}>
            {" "}
            Sponsored Posts{" "}
          </h4>
          <div>
            <InstagramEmbed
              url="https://www.instagram.com/p/CCZerjIDOyz/"
              width={320}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
