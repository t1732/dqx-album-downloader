import { ConfigurationFactory } from "webpack"
import path from "path"
import CopyPlugin from "copy-webpack-plugin"

const config: ConfigurationFactory = () => {
  return {
    mode: "production",
    entry: {
      content: path.join(__dirname, "src", "content_scripts.ts"),
      menu: path.join(__dirname, "src","popup.ts"),
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /.ts$/,
          use: "ts-loader",
          exclude: "/node_modules/"
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "public", to: "." }
        ],
      })
    ]
  }
}

export default config
