"use client";

export default function ValuesSection() {
  const values = [
    {
      title: "Strength in Unity",
      tagline: "United for excellence",
      description:
        "We value the distinctive talents of individuals and foster a culture of partnership, aligning collective strengths to deliver outstanding results.",
    },
    {
      title: "Career Growth & Personal Enrichment",
      tagline: "Empowering your potential",
      description:
        "We provide a dynamic environment that blends challenge with opportunity, empowering our people to advance their careers while nurturing creativity and personal enrichment.",
    },
    {
      title: "Inclusive by Nature, United by Purpose",
      tagline: "Belong. Grow. Thrive",
      description:
        "We embrace diversity and foster an inclusive environment where every individual feels valued, supported, and empowered to grow and succeed.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        Our Employee Value Proposition
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {values.map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-sm font-medium text-accent mb-2">
              {item.tagline}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
