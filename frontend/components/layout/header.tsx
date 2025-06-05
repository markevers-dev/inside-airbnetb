'use client';

import { Button } from '../ui/8bit/button';
import { BlurReveal } from '../ui/blur-reveal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/8bit/dropdown-menu';
import { useUser } from '@auth0/nextjs-auth0';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/8bit/avatar';

export const Header = () => {
  const { user } = useUser();

  return (
    <header className="flex w-full flex-row items-center justify-between border-b-[0.5px] border-slate-950/10 bg-slate-100 px-8 py-4 text-slate-950 md:px-20">
      <BlurReveal className="font-[family-name:var(--font-geist-mono)] text-xl font-bold md:text-3xl">
        Inside Airbnetb
      </BlurReveal>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center gap-2 font-[family-name:var(--font-geist-mono)] font-bold hover:cursor-pointer">
            {user.nickname || 'User'}
            <Avatar variant="pixel">
              <AvatarImage
                src={user.picture || ''}
                alt={`${user.nickname} Avatar` || 'User Avatar'}
              />
              <AvatarFallback>
                {user.name ? user.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <a href="/auth/logout" className="w-full">
                Logout
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="destructive" className="hover:cursor-pointer">
          <a href="/auth/login" className="text-white">
            Login
          </a>
        </Button>
      )}
    </header>
  );
};
