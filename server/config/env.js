import "dotenv/config.js";

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET_KEY

export { PORT, MONGO_URI, JWT_SECRET }