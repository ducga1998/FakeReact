
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