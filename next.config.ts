import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // One production name: the older project hostname sends people to results-summary.royeradames.com.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "angular-results-summary-component.royeradames.com" }],
        destination: "https://results-summary.royeradames.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
