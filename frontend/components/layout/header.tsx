'use client';

import { Button } from '../ui/8bit/button';
import { BlurReveal } from '../ui/blur-reveal';

export const Header = () => (
  <header className="flex w-full flex-row items-center justify-between border-b-[0.5px] border-slate-950/10 bg-slate-100 px-8 py-4 text-slate-950 md:px-20">
    <BlurReveal className="font-[family-name:var(--font-geist-mono)] text-xl font-bold md:text-3xl">
      Inside Airbnetb
    </BlurReveal>
    <Button
      onClick={() => alert('Login functionality not implemented yet')}
      variant="destructive"
      className="hover:cursor-pointer"
    >
      Login
    </Button>
  </header>
);
