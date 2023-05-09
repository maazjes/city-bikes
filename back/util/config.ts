import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ?? 8080;
const SECRET = process.env.SECRET ?? "susanna";
const DATABASE_URL = process.env.DATABASE_URL!;

export { DATABASE_URL, PORT, SECRET };
