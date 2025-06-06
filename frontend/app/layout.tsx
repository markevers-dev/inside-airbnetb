import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { management, auth0 } from '@/lib/auth0';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Inside Airbnetb',
  description: 'This is an app',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth0.getSession();
  const user = session?.user;
  let roles: string[] = [];
  if (user) {
    const rolesResponse = await management.users.getRoles({
      id: user.sub,
    });
    roles = Array.isArray(rolesResponse.data)
      ? rolesResponse.data.map((role: { name: string }) => role.name)
      : [];
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mb-4 flex w-full max-w-screen flex-col items-center justify-between gap-y-4 bg-slate-100 font-[family-name:var(--font-geist-sans)] antialiased md:mb-12 md:gap-y-12`}
      >
        <Header roles={roles} />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
