import { MongoClient } from "mongodb";

export async function connectDatabase(dbname) {
  const client = await MongoClient.connect(
    `mongodb+srv://Mohammad:Mohammadpw@cluster0.gfww0.mongodb.net/${dbname}?retryWrites=true&w=majority`
  );

  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  await db.collection(collection).insertOne(document);
}

export async function getAllComments(client, collection, sort) {
  const db = client.db();
  const allComments = await db
    .collection(collection)
    .find()
    .sort(sort)
    .toArray();
  return allComments;
}
