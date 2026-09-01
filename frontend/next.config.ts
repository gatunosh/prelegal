import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` so FastAPI can serve it directly.
  output: "export",
};

export default nextConfig;
