import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#454545] flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="text-9xl font-black text-[#0f7f6d] mb-4">404</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-white/70 mb-10 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#0f7f6d] hover:bg-[#005a3d] text-white font-semibold px-8 py-4 rounded-full transition text-lg"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
