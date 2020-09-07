import { ConfigurationFactory } from "webpack"
import path from "path"
import CopyPlugin from "copy-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const config: ConfigurationFactory = () => {
  return {
    mode: "production",
    entry: {
      content_scripts: path.join(__dirname, "src", "content_scripts.ts"),
      popup: path.join(__dirname, "src", "popup.ts"),
      background: path.join(__dirname, "src", "background.ts"),
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: {
                pretty: true,
              },
            },
          ],
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "stylus-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js", ".styl"],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: ".",
            globOptions: {
              dot: false,
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: "./src/popup.pug",
        chunks: ["popup"],
        minify: false,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  }
}

export default config
