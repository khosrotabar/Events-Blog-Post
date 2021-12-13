import { connectDatabase, insertDocument } from "../../helpers/db-utils";

async function handler(req, res) {
  if (req.method === "POST") {
    const commentEmail = req.body.email;
    const commentName = req.body.name;
    const commentText = req.body.text;
    const eventId = req.body.eventId;

    if (
      !commentEmail.includes("@") ||
      !commentEmail ||
      !commentName.trim() === "" ||
      !commentName ||
      !commentText.trim() === "" ||
      !commentText
    ) {
      res.status(442).json({ message: "All inputs are required" });
      client.close();
      return;
    }

    const newComment = {
      id: eventId,
      email: commentEmail,
      name: commentName,
      text: commentText,
    };

    let client;

    try {
      client = await connectDatabase("events");
    } catch (error) {
      res.status(500).json({ message: "Connection to database failed" });
      return;
    }

    try {
      await insertDocument(client, "comments", newComment);
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting into the database failed" });
      return;
    }

    res.status(201).json({ message: "Comment Added Successfuly" });
  }
}

export default handler;
