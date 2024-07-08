import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

export const mainConfig: Configuration = {
  /**
   * Main entry point is index.ts
   * 
   * ffmpegWorker is a forkable process, so needs its own
   * js file.
   */
  entry: {
    index: "./src/index.ts",
    ffmpegWorker: {
      import: "./src/main/processes/ffmpegWorker.ts",
      filename: "processes/[name].js",
    },
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
