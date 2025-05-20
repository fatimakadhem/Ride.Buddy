// client/src/config.js

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // Tom sträng = relative path
    : "http://localhost:3000"; // Utvecklingsläge

export default BASE_URL;
