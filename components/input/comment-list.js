import classes from "./comment-list.module.css";

function CommentList(props) {
  if (props.isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <ul className={classes.comments}>
      {props.comments.map((comment, index) => (
        <li key={index}>
          <p>{comment.text}</p>
          <div>
            By <address>{comment.name}</address>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
