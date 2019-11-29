const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const commentComponent = require("./routes/comment");

app.use(cors());
app.use(bodyParser.json());

app.use("/comment", commentComponent);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
