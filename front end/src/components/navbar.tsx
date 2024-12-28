import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          AI Samasya
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/challenges">Challenges</Link>
          <Link href="/progress">My Progress</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <ThemeToggle />
          <Button>Sign In</Button>
        </nav>
      </div>
    </header>
  );
} 