'use server';

import { management, auth0 } from '@/lib/auth0';
import { unauthorized } from 'next/navigation';

const Charts = async () => {
  const session = await auth0.getSession();
  const user = session?.user;

  const rolesResponse = await management.users.getRoles({
    id: user?.sub || '',
  });
  const roles = Array.isArray(rolesResponse.data)
    ? rolesResponse.data.map((role: { name: string }) => role.name)
    : [];

  if (!roles.includes('Admin')) unauthorized();

  return <main>This is where the charts will go</main>;
};

export default Charts;
