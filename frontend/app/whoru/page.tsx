import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Who are you ?
        </h1>
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          "Let's stop hunger and change lives."
        </blockquote>
        <Button variant="outline" asChild>
          <Link href="/user_login">User</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/donor_login">Donor</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/user_login">Delivery</Link>
        </Button>
      </div>
    </div>
  );
}
