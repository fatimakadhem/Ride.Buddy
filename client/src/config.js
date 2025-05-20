const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://ridebuddy-production-c98d.up.railway.app"
  : "http://localhost:3000";

export default BASE_URL;
