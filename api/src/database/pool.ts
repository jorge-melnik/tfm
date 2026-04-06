import { Pool, PoolConfig } from 'pg';

const pgConfig: PoolConfig = {
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
  host: process.env.PGHOST,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 1000,
  max: 10,
  min: 0,
  allowExitOnIdle: false,
  maxLifetimeSeconds: 0,
};

export const myPool = new Pool(pgConfig);
