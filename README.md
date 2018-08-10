Project use : 
1 : algo backtracking 
2 : es5 javascript 
3 : class es6
4 : setup environment : webpack, babel, npm
B1 : config jsx : 
```{
  "presets": ["stage-2"],
  "plugins": [
    "transform-class-properties",
    "transform-object-rest-spread",
    [
      "transform-react-jsx",
      {
        "pragma": "fakeReact.createElement"
      }
    ]
  ]
}
```
B2 : config webpack : 
```
const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    entry: resolveApp("./index.jsx"),
    target: "web",
    devtool: "source-map",
    output: {
        path: resolveApp("./public"),
        filename: "test.js"
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                loader: "babel-loader"
            }
        ]
    },
    watch : true
};
```
b3 : code  reactFake.js
b4 : use the same react in file index.jsx
Use FakeReact, write code in index.jsx 

