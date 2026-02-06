import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mb-8 text-lg text-gray-600">Page not found</p>
      <Link href="/" className="text-blue-600 underline hover:text-blue-800">
        Back to home
      </Link>
    </div>
  );
}
