// Generated using webpack-cli https://github.com/webpack/webpack-cli

/** 
 * I've added some commented lines I ended up using to make things work in previous projects. For the time being, I'm
 * going to leave them commented until I'm sure they're actually necessary.
*/

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        open: true,
        host: "localhost",
    // static: "./dist/",
    // watchFiles: ["src/*.html"],
    // hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: false,
        }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    devtool: "eval-source-map",
    // output: {
    //   filename: "bundle.js",
    //   path: path.resolve(__dirname, "dist"),
    //   clean: true,
    // },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
            // {
            //   test: /\.html$/i,
            //   loader: "html-loader",
            //   options: {
            //     sources: {
            //       list: [
            //         "...",
            //         {
            //           tag: "script",
            //           attribute: "src",
            //           type: "src",
            //           filter: () => false,
            //         }
            //       ]
            //     }
            //   }
            // },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
