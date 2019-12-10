const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const commentComponent = require("./routes/comment");

app.use(cors());

app.use(bodyParser.json({ limit: "50mb", extend: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extend: true }));
// app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url =
  "mongodb+srv://yuchen:1234@cluster0-xlcav.mongodb.net/post?retryWrites=true";

// Use connect method to connect to the Server
// MongoClient.connect(url, async function(err, client) {
//   const db = client.db("post");

//   const collection = await db
//     .collection("content")
//     .find()
//     .toArray();

//   let content = {
//     id: "",
//     name: "999",
//     comment: [{ comment: "new comment", timestamps: 09, likes: 9 }],
//     image: "sdf",
//     video: "lll"
//   };
//   const updated = await db.collection("content").replaceOne(
//     { id: { $eq: "" } },
//     {
//       $set: {
//         id: "",
//         comment: [{ comment: "new comment1123231", likes: 9 }],
//         image: "sdf",
//         video: "lll"
//       }
//     }
//   );

//   const remove = await db.collection("content").remove({ id: { $eq: "" } });

//   let newArray = [{ comment: "new comment1123231", likes: 9 }];
//   let newDoc = {
//     id: "123",
//     name: "Yuchen",
//     comment: newArray,
//     images: "",
//     vidoes: "2"
//   };
//   const insert = await db.collection("content").insertOne(newDoc);
//   const col = await db
//     .collection("content")
//     .find({})
//     .toArray();

//   console.log(collection[1].id);
//   console.log(col[0]);

//   client.close();
// });

app.use("/comment", commentComponent);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
