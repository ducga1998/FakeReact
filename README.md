Project use : 

1 : Algo backtracking

2 : Es5 javascript 

3 : Class es6

4 : Setup environment : webpack, babel, npm

B1 : Config jsx : 
``` json
{
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
B2 : Config webpack : 
``` javascript
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
b3 : Code  reactFake.js

b4 : Use the same react in file index.jsx

Use FakeReact, write code in index.jsx 

