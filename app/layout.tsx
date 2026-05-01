import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sri Lanka Location Admin",
  description: "CRUD admin dashboard for provinces, districts, DS divisions, and cities.",
};

const navItems = [
  { href: "/provinces", label: "Provinces" },
  { href: "/districts", label: "Districts" },
  { href: "/divisional-secretariats", label: "Divisional Secretariats" },
  { href: "/cities", label: "Cities" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-soft backdrop-blur">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <Link href="/" className="group">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-clay">Admin Dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                  Sri Lanka Public Data
                </h1>
              </Link>
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-ink/10 bg-sand/80 px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-ink hover:text-sand"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
