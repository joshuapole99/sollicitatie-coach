import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <Link href="/" className="font-bold text-gray-900 text-sm mb-8 block">
        ← Sollicitatie Coach
      </Link>
      {children}
    </div>
  );
}
