# FakeReact
Iam will fake one lir the same react that 160 javascript line code , Yeahhh it's fucking cool
guild line : 
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
Use FakeReact, write code in index.jsx 
