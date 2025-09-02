import { PrismaClient } from "../generated/prisma";
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Try multiple possible locations for the .env file
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),                 // Current working directory
  path.resolve(process.cwd(), '../.env'),              // Parent of current working directory
  path.resolve(process.cwd(), '../../.env'),           // Grandparent of current working directory
  path.resolve(process.cwd(), '../../../.env'),        // Great-grandparent of current working directory
  path.resolve(__dirname, '../.env'),                  // Parent of __dirname
  path.resolve(__dirname, '../../.env'),               // Grandparent of __dirname
  path.resolve(process.cwd(), 'packages/db/.env'),     // Explicit path to packages/db/.env
  path.resolve(process.cwd(), '../packages/db/.env'),  // Another possible path
];

// Try to load from each possible path
let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Found .env file at: ${envPath}`);
    dotenv.config({ path: envPath, debug: process.env.NODE_ENV !== 'production' });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('ERROR: Could not find .env file in any of the expected locations');
  console.log('Tried the following paths:');
  possibleEnvPaths.forEach(p => console.log(` - ${p}`));
}

// Verify DATABASE_URL is loaded
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL is loaded successfully');
} else {
  console.error('ERROR: DATABASE_URL is not loaded');
}

// Define global type for Node.js
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };