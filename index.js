const fs = require("fs");
const path = require("path");
const isString = require("is-string");
const get = require("lodash.get");
const yaml = require("js-yaml");
const pify = require("pify");

const readFile = pify(fs.readFile);

module.exports = function oscuro(placesToLook = [], defaultResponse) {
  return new Promise((resolve, reject) => {
    const promises = placesToLook.map(input => {
      let evalType;
      let readFrom;

      if (isString(input)) {
        readFrom = input;
        evalType = path.extname(input);
      } else {
        readFrom = input.path;
        evalType = input.type ? input.type : path.extname(input.path);
      }

      evalType = evalType.toLowerCase();

      if (evalType[0] === ".") {
        evalType = evalType.substr(1);
      }

      if (evalType === "js") {
        return require(readFrom);
      }

      return readFile(readFrom)
        .then(data => {
          let contents;
          if (evalType === "yaml") {
            contents = yaml.safeLoad(data.toString());
          } else if (evalType === "json") {
            contents = JSON.parse(data.toString());
          } else {
            contents = data.toString();
          }

          if (input.key) {
            return Promise.resolve(get(contents, input.key));
          }
          return Promise.resolve(contents);
        })
        .catch(() => {});
    });

    Promise.all(promises).then(results => {
      for (let i = 0; i < results.length; i++) {
        if (results[i]) {
          return resolve(results[i]);
        }
      }
      if (defaultResponse) {
        return resolve(defaultResponse);
      }
      return reject("no config was found");
    });
  });
};
