import Link from "next/link";

const cards = [
  { href: "/provinces", title: "Provinces", body: "Create and maintain province names in English, Sinhala, and Tamil." },
  { href: "/districts", title: "Districts", body: "Manage districts with a province dropdown. This is the fully worked example page." },
  { href: "/divisional-secretariats", title: "Divisional Secretariats", body: "Attach each DS division to the correct district." },
  { href: "/cities", title: "Cities", body: "Manage city names, sub names, postcodes, and coordinates." },
];

export default function HomePage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2.5rem] bg-ink p-8 text-sand shadow-soft sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-clay">Raw SQL + Neon</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
          A compact CRUD cockpit for public location data.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-sand/80">
          Use the navigation to manage records, export a JSON backup, and restore data safely with ordered imports.
        </p>
      </div>
      <div className="grid gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-soft transition hover:-translate-y-1 hover:bg-white"
          >
            <h3 className="text-xl font-black text-ink">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">{card.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
