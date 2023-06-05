if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

const SECRET = process.env.SECRET! || 'development';
const DATABASE_URL = process.env.DATABASE_URL!;
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8080;

export { DATABASE_URL, PORT, SECRET, NODE_ENV };
