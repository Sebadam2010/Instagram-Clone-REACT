import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { FirebaseError } from "firebase/app";
import {
  serverTimestamp,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const metadata = {
    contentType: "image/jpeg",
  };

  const handleChange = (e) => {
    //set first file, as you can get multiple. only allowing 1
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    const storageRef = ref(storage, `images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    //const uploadTask = ref(storage, `images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("upload is running");
            break;
          default:
            break;
        }
        setProgress(progress);
      },
      (error) => {
        //error function
        console.log(error);
        //as message is not user friendly, alerting not best
        alert(error.message);
      },
      () => {
        //complete function
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          //Post img inside of Database
          const docRef = addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });

          console.log(`Document written with ID: ${docRef.id}`);
          setProgress(0);
          setCaption("");
          setImage(null);
        });
      }
    );
  };

  return (
    <div className="imageupload">
      <CircularProgress
        className="imageupload__progress"
        value={progress}
        variant="determinate"
      />
      <input
        type="text"
        placeholder="Enter caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button variant="contained" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
