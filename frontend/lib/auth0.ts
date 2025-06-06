import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { ManagementClient } from 'auth0';

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },
});

export const management = new ManagementClient({
  domain: process.env.AUTH0_MGMT_DOMAIN!,
  clientId: process.env.AUTH0_MGMT_CLIENT_ID!,
  clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET!,
});
