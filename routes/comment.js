const express = require("express");
const router = express.Router();
const content = require("../model/content.json");
const json_helper = require("../helper/json_helper");
const MongoClient = require("mongodb").MongoClient;

const url =
  "mongodb+srv://yuchen:1234@cluster0-xlcav.mongodb.net/welifePost?retryWrites=true";

const contentFilename = __dirname + "/../model/content.json";

//pass database test
router.get("/", (request, response) => {
  MongoClient.connect(url, async function (err, client) {
    const db = client.db("post");
    const collection = await db.collection("content").find().toArray();

    response.json(collection);
    client.close();
  });
});

//pass database test
router.post("/", (request, response) => {
  let newPost = {
    id: json_helper.getNewId(),
    name: request.body.name,
    comment: [],
    image: request.body.image,
    video: request.body.video,
  };
  let curTime = new Date();
  let newComment = {
    comment: request.body.comment,
    timestamp: curTime.getTime(),
    likes: 0,
  };

  //insertOne()
  newPost.comment.push(newComment);

  MongoClient.connect(url, async function (err, client) {
    const db = client.db("post");

    const insert = await db.collection("content").insertOne(newPost);
    const collection = await db.collection("content").find().toArray();

    response.json(collection);
    client.close();
  });
});

//pass database test
// add comment to exist post
router.put("/:id", (request, response) => {
  let postId = request.params.id;
  let curPost = content.find((element) => element.id === postId);
  let curIndex = content.findIndex((element) => element.id === postId);

  MongoClient.connect(url, async function (err, client) {
    const db = client.db("post");

    const replace = await db.collection("content").replaceOne(
      { id: { $eq: postId } },
      {
        $set: {
          id: request.body.id,
          name: request.body.name,
          comment: request.body.comment,
          image: request.body.image,
          video: request.body.video,
        },
      }
    );
    const collection = await db.collection("content").find().toArray();

    response.json(collection);
    client.close();
  });
});

//pass database test
router.delete("/", (request, response) => {
  let id = request.body.id;

  console.log(request.body);

  MongoClient.connect(url, async function (err, client) {
    const db = client.db("post");
    console.log(request.body);
    const remove = await db.collection("content").deleteMany({
      id: { $eq: id },
    });
    const collection = await db.collection("content").find().toArray();

    response.json(collection);
    client.close();
  });
});

module.exports = router;
