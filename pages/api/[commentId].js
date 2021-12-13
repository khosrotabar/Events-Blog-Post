import { connectDatabase, getAllComments } from "../../helpers/db-utils";

async function handler(req, res) {
  if (req.method === "GET") {
    const commentId = req.query.commentId;

    let client;
    let allComments;

    try {
      client = await connectDatabase("events");
    } catch (error) {
      res.status(500).json({ message: "Connecting to atabase failed" });
    }

    try {
      allComments = await getAllComments(client, "comments", { _id: -1 });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Getting comments failed" });
    }

    const comment = allComments.filter((comment) => comment.id === commentId);
    res.status(200).json({ comment: comment });
  }
}

export default handler;
