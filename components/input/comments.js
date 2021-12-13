import { useState, useEffect, useContext } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import NotificationContext from "../../store/notification-context";

function Comments(props) {
  const { eventId } = props;
  const [comments, setComment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    if (showComments) {
      setIsLoading(true);
      fetch(`/api/${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          setComment(data.comment);
          setIsLoading(false);
        });
    }
  }, [eventId, showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    const { email, name, text } = commentData;

    const reqBody = { email: email, name: name, text: text, eventId: eventId };

    notificationCtx.showNotification({
      title: "Adding comment...",
      message: `Adding new comment for event ${eventId}`,
      status: "pending",
    });

    fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || "Somthing went wrong!");
        });
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: `Successfully added comment for event ${eventId}`,
          status: "success",
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Somthing went wrong!",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && (
        <NewComment onAddComment={addCommentHandler} route={eventId} />
      )}
      {showComments && comments && (
        <CommentList comments={comments} isLoading={isLoading} />
      )}
    </section>
  );
}

export default Comments;
