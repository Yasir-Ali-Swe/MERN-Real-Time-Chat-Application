import "dotenv/config.js";

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const CLIENT_URL = process.env.CLIENT_URL;

export { PORT, MONGO_URI, JWT_SECRET, EMAIL, EMAIL_PASSWORD, CLIENT_URL };
