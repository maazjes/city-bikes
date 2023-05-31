import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ?? 8080;
const SECRET = process.env.SECRET ?? 'susanna';
const DATABASE_URL = process.env.DATABASE_URL!;
const NODE_ENV = process.env.NODE_ENV || 'production';

export { DATABASE_URL, PORT, SECRET, NODE_ENV };
