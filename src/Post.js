import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { db } from "./firebase";
import { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  getDocs,
  query,
  querySnapshot,
  documentId,
  collectionGroup,
  orderBy,
  FieldPath,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const cc = collection(db, "posts", postId, "comments");
  const qc = query(
    collection(db, "posts", postId, "comments"),
    orderBy("timestamp", "desc")
  );
  const commentsDocs = getDocs(qc);

  const postComment = (event) => {
    event.preventDefault();

    const commentRef = addDoc(cc, {
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp(),
    });

    console.log(`comment posted at: ${serverTimestamp()}`);
    setComment("");
  };

  useEffect(() => {
    let unsubscribe;

    //  if (postId) {
    //    unsubscribe = db
    //      .collection("posts")
    //      .doc(postId)
    //      .collection("comments")
    //      .orderBy("timestamp", "asc")
    //      .onSnapshot((snapshot) => {
    //        setComments(snapshot.docs.map((doc) => doc.data()));
    //      });
    //  }

    //  const cc = collection(db, "posts", postId, "comments");
    //  const qc = query(collection(db, "posts", postId, "comments"));
    //  const commentsDocs = getDocs(qc);

    if (postId) {
      unsubscribe = onSnapshot(qc, (querySnapshot) => {
        setComments(querySnapshot.docs.map((doc) => doc.data()));
      });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__header__avatarUsername">
          <Avatar
            className="post__avatar"
            alt={username[0].toUpperCase()}
            src="#"
          />
          <h3>{username}</h3>
        </div>

        <FontAwesomeIcon className="fa-lg" icon={faEllipsis} />
      </div>
      <img className="post__image" src={imageUrl} />

      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p className="post__comment">
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user ? (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></input>
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      ) : (
        <form className="post__commentBox">
          <input
            className="post__input post__input--disabled"
            type="text"
            placeholder="Login to comment..."
            onChange={(e) => setComment(e.target.value)}
            disabled="true"
          ></input>
        </form>
      )}
    </div>
  );
}

export default Post;
