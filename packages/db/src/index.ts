

// First import the client to ensure environment variables are loaded
import './client';

// Then export everything
export { prisma } from './client' // exports instance of prisma
export * from "../generated/prisma" // exports generated types from prisma
export * from './client'