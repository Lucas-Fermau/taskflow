import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[taskflow-api] listening on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`[taskflow-api] received ${signal}, closing...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
