// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} (env=${process.env.NODE_ENV ?? 'development'})`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

export default server;
