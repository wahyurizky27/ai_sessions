import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Welcome</h1>
      <Link className="underline" href="/sessions">Go to Sessions</Link>
    </div>
  );
}
