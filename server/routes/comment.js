const express = require("express");
const router = express.Router();
const content = require("../model/content.json");
const json_helper = require("../helper/json_helper");
const MongoClient = require("mongodb").MongoClient;

const url =
  "mongodb+srv://yuchen:1234@cluster0-xlcav.mongodb.net/post?retryWrites=true";

const contentFilename = __dirname + "/../model/content.json";

//pass database test
router.get("/", (request, response) => {
  MongoClient.connect(url, async function(err, client) {
    const db = client.db("post");
    const collection = await db
      .collection("content")
      .find()
      .toArray();

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
    video: request.body.video
  };
  let curTime = new Date();
  let newComment = {
    comment: request.body.comment,
    timestamp: curTime.getTime(),
    likes: 0
  };

  //insertOne()
  newPost.comment.push(newComment);

  MongoClient.connect(url, async function(err, client) {
    const db = client.db("post");

    const insert = await db.collection("content").insertOne(newPost);
    const collection = await db
      .collection("content")
      .find()
      .toArray();

    response.json(collection);
    client.close();
  });

  // content.push(newPost);

  // json_helper.writeJson(contentFilename, content);
  // response.json(content);
});

// add comment to exist post
router.put("/:id", (request, response) => {
  // let newComment = request.body.comment;
  let postId = request.params.id;
  let curPost = content.find(element => element.id === postId);
  let curIndex = content.findIndex(element => element.id === postId);
  // curPost.comment.push(newComment);

  //replaceOne()
  // content.splice(curIndex, 1, request.body);

  // json_helper.writeJson(contentFilename, content);
  // response.json(content);

  MongoClient.connect(url, async function(err, client) {
    const db = client.db("post");

    const replace = await db.collection("content").replaceOne(
      { id: { $eq: { postId } } },
      {
        $set: request.body
      }
    );
    const collection = await db
      .collection("content")
      .find()
      .toArray();

    response.json(collection);
    client.close();
  });
});

router.delete("/", (request, response) => {
  let id = request.body.id;
  let location = undefined;

  content.map((element, index) => {
    if (element.id === id && location === undefined) {
      location = index;
    }
  });

  // content.splice(location, 1);
  // json_helper.writeJson(contentFilename, content);
  // response.json(content);

  MongoClient.connect(url, async function(err, client) {
    const db = client.db("post");

    const remove = await db.collection("content").deleteMany({
      id: { $eq: { id } }
    });
    const collection = await db
      .collection("content")
      .find()
      .toArray();

    response.json(collection);
    client.close();
  });
});

module.exports = router;
