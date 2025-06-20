'use client';

import { Button } from '../ui/8bit/button';
import { BlurReveal } from '../ui/blur-reveal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/8bit/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/8bit/navigation-menu';
import { useUser } from '@auth0/nextjs-auth0';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/8bit/avatar';
import Link from 'next/link';

interface HeaderProps {
  roles: string[];
}

export const Header = ({ roles }: HeaderProps) => {
  const { user } = useUser();

  return (
    <header className="flex w-full flex-col items-center justify-between border-b-[0.5px] border-slate-950/10 bg-slate-100 px-8 py-4 text-slate-950 max-md:space-y-4 md:flex-row md:px-20">
      <Link href="/">
        <BlurReveal className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold md:text-3xl">
          Inside Airbnetb
        </BlurReveal>
      </Link>

      {roles.find((role) => role === 'Admin') && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/charts">Charts</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}

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
