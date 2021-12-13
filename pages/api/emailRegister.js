import { connectDatabase, insertDocument } from "../../helpers/db-utils";

async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;

    if (!email || !email.includes("@")) {
      res.status(442).join({ message: "Invalid email. @ is required!" });
      return;
    }

    let client;

    try {
      client = await connectDatabase("newsletter");
    } catch (error) {
      res.status(500).json({ message: "Connecting to database failed" });
      return;
    }

    try {
      await insertDocument(client, "emails", { email: email });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting into the database failed" });
      return;
    }

    res.status(201).json({ message: "Signed Up" });
  }
}

export default handler;
