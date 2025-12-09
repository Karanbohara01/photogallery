import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /**
   * Next.js 16 warns about the workspace root when multiple lockfiles exist.
   * Setting turbopack.root ensures the dev server always resolves relative
   * to the frontend folder, which avoids the warning both locally and on Vercel.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
