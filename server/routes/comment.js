const express = require("express");
const router = express.Router();
const content = require("../model/content.json");
const json_helper = require("../helper/json_helper");

const contentFilename = __dirname + "/../model/content.json";

router.get("/", (request, response) => {
  response.send(content);
});

router.post("/", (request, response) => {
  let newPost = {
    id: json_helper.getNewId(),
    name: request.body.name,
    comment: request.body.comment
  };

  content.push(newPost);

  json_helper.writeJson(contentFilename, content);
  response.send(content);
});

module.exports = router;
