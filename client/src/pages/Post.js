//Hello, I am Seba, and you are looking at my code haha

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (!response.data.error) {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setComments(comments.filter((val) => val.id !== commentId)); // Update the state to remove the comment
        console.log(response.data.message); // Log the success message
      })
      .catch((error) => {
        console.error("Failed to delete comment:", error.response?.data?.error || error.message);
        alert(error.response?.data?.error || "An error occurred while deleting the comment.");
      });
  };
  

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:3001/posts/${postId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    let newValue = prompt(`Enter New ${option.charAt(0).toUpperCase() + option.slice(1)}:`);

    if (newValue) {
      axios.put(`http://localhost:3001/posts/${option}`, { newValue, id }, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then(() => {
        setPostObject({ ...postObject, [option]: newValue });
      });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title" onClick={() => authState.username === postObject.username && editPost("title")}>
            {postObject.title}
          </div>
          <div className="body" onClick={() => authState.username === postObject.username && editPost("body")}>
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button onClick={() => deletePost(postObject.id)}>Delete Post</button>
            )}
          </div>
        </div>

        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
  {comments.map((comment, key) => (
    <div key={key} className="comment">
      <span className="comment-username">{comment.username}:</span>
      <span className="comment-body"> {comment.commentBody}</span>
      {authState.username === comment.username && (
        <button onClick={() => deleteComment(comment.id)}>X</button>
      )}
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default Post;

