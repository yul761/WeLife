const fs = require("fs");
const uuid = require("uuid/v4");

function writeJson(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8", error => {
    if (error) console.log("Error occurs on writing files : " + error);
  });

  console.log(`Saving files to ${filename}`);
}

const getNewId = () => {
  return uuid();
};

module.exports = {
  getNewId,
  writeJson
};
