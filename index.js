const fs = require("fs");
const path = require("path");
const isString = require("is-string");
const get = require("lodash.get");
const yaml = require("js-yaml");
const pify = require("pify");

const readFile = pify(fs.readFile);

module.exports = function oscuro(placesToLook = [], options = {}) {
  const { defaultResponse, returnPathOnly } = options;
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
        try {
          const contents = require(readFrom);
          if (input.key) {
            const resolvedContent = get(contents, input.key);
            if (resolvedContent && returnPathOnly) {
              return Promise.resolve(input);
            }
            return Promise.resolve(resolvedContent);
          }
          return Promise.resolve(returnPathOnly ? input : contents);
        } catch (e) {
          return void 0;
        }
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
            const resolvedContent = get(contents, input.key);
            if (resolvedContent && returnPathOnly) {
              return Promise.resolve(input);
            }
            return Promise.resolve(resolvedContent);
          }
          return Promise.resolve(returnPathOnly ? input : contents);
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
      return resolve(void 0);
    });
  });
};
