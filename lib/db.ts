/** 
 * Every time we save our application we run a hot-reload, instantiating a new PrismaClient
 * ! There should be only one instance --> Each instance will manage a connection pool with database
 * * Many instances(clients) will exhaust database connection limit --> slowing down the aplication
 *  https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client#the-number-of-prismaclient-instances-matters
 * * Since globalThis is not affected by hot-reload --> we store PrismaClient in globalThis to be instatiate only one time
*/

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
} 


export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;