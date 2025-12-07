import { Navbar } from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content container */}
      <main className="container mx-auto px-10 py-6 flex-1 bg-white dark:bg-neutral-900">
        {children}
      </main>
    </div>
  );
}
