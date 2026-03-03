import { useState } from "react";
import { useNavigate } from "react-router";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { getDatabase, ref, push as firebasePush } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function NewStudyAbroadPage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewURL(URL.createObjectURL(selectedFile));
    }
  };

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
  };

  // AI used to help setting up handler for submit
  const handleSubmit = (e) => {
    e.preventDefault(); 

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to submit.");
      return;
    }

    const userId = user.uid;
    const db = getDatabase();
    const studyAbroadProgramsRef = ref(db, `users/${userId}/studyAbroads`);

    const defaultImage = "/img/default-placeholder.jpg"; //placeholder img in case no img uploaded

    // Option 2 that Joel mentioned, uploading images to Realtime Database, this part used AI
    if (image) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.currentTarget.result;

        const newStudyAbroadProgram = {
          title: title,
          img: dataUrl, // 
        };

        // AI generated this part because I was having trouble navigating back to Study Abroad Page after pressing 
        // save button, but later discover the bug is caused by not setting up firebase storage and linking properly,
        // solving by using option 2 where treating img as string and saved in RTDB
        firebasePush(studyAbroadProgramsRef, newStudyAbroadProgram)
          .then(() => navigate("/"))
          .catch((err) => {
            console.error("Failed to save entry:", err);
            alert("Failed to save your program.");
          });
      };

      reader.readAsDataURL(image);
    } else {
      const newStudyAbroadProgram = {
        title: title,
        img: defaultImage, // use default image if none uploaded
      };

      firebasePush(studyAbroadProgramsRef, newStudyAbroadProgram)
        .then(() => navigate("/"))
        .catch((err) => {
          console.error("Failed to save entry:", err);
          alert("Failed to save your program.");
        });
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All changes will be lost."
    );
    if (confirmCancel) {
      navigate("/");
    }
  };

  return (
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className="page-header-simple">Add Study Abroad</h1>

          <label htmlFor="titleInput">Title</label>
          <input
            id="titleInput"
            type="text"
            name="titleInput"
            value={title}
            onChange={handleTitleChange}
          />

          <div>
            <label htmlFor="cover-photo">Add Cover Photo</label>
            <br />
            <input
              type="file"
              id="cover-photo"
              name="cover-photo"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {previewURL && (
            <div style={{ marginTop: "10px" }}>
              <p>Image Preview:</p>
              <img
                src={previewURL}
                alt="Preview"
                style={{ width: "200px", borderRadius: "8px" }}
              />
            </div>
          )}

          <div className="button-container">
            <button
              type="button"
              className="button cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="button save-button">
              Save
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}