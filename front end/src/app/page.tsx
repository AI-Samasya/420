import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Master LeetCode with AI-Powered Learning
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Personalized learning paths, adaptive hints, and gamified challenges
          designed for ADHD and differently-abled learners.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/challenges">
            <Button size="lg">Start Learning</Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Assistance</CardTitle>
            <CardDescription>
              Get personalized hints and explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            Receive contextual help and step-by-step guidance tailored to your
            learning style.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gamified Learning</CardTitle>
            <CardDescription>Learn while having fun</CardDescription>
          </CardHeader>
          <CardContent>
            Earn rewards, track progress, and compete with friends in a engaging
            learning environment.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility First</CardTitle>
            <CardDescription>Designed for everyone</CardDescription>
          </CardHeader>
          <CardContent>
            Voice commands, screen reader support, and customizable interface
            for all learners.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
