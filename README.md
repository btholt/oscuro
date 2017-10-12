# Oscuro

Provide oscuro with a list of files and you'll only get the first one back that exists. Useful for looking for config files in different places. Similar to cosmiconfig (great package!) but less batteries included.

## API

Oscuro exports a function.

```es6
const promise = oscuro([
    './file1.json', 
    'file2.yaml', 
    'file3.js', 
    { path: "./.file5", type: "json" }, 
    { path: "./file6.json", key: "path.to.my.prop" }, 
    'file4.html'
], "default thing to give if none are found");
```

`paths`: array of strings and objects, required. First param is a list of paths to try to read, in order. Every path will be read and it will wait until all resolve before returning your answer. Items in the array can be strings or objects. 

Objects must have a `path` prop and may have a `type` prop and/or a `key` prop. Type will tell it how to interept the data. `json` and `yaml` are parsed and returned as objects. `js` is required and returned. Anything else is returned as a string. The type is inferred from the path if no type is provided. `key` prop will use lodash's `get` method to return only part of the object that you specify.

`defaultResponse`: mixed, optional. what to be passed back if none of the paths resolve.

## License

Apache 2.0