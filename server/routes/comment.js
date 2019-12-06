const express = require("express");
const router = express.Router();
const content = require("../model/content.json");
const json_helper = require("../helper/json_helper");

const contentFilename = __dirname + "/../model/content.json";

router.get("/", (request, response) => {
  response.json(content);
});

router.post("/", (request, response) => {
  let newPost = {
    id: json_helper.getNewId(),
    name: request.body.name,
    comment: request.body.comment,
    image: request.body.image,
    video: request.body.video
  };

  content.push(newPost);

  json_helper.writeJson(contentFilename, content);
  response.json(content);
});

router.delete("/", (request, response) => {
  let id = request.body.id;
  let location = undefined;

  content.map((element, index) => {
    if (element.id === id && location === undefined) {
      location = index;
    }
  });

  content.splice(location, 1);
  json_helper.writeJson(contentFilename, content);
  response.json(content);
});

module.exports = router;
