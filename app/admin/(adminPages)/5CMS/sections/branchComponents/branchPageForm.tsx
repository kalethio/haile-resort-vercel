// src/components/branchPageForm.tsx
"use client";
import React, { useState } from "react";

type Attraction = { id: string; label: string; image?: string };
type Accommodation = { title: string; description?: string; image?: string };
type PackageT = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
};
type Experience = {
  externalId?: string;
  title: string;
  description?: string;
  highlightImage?: string;
  packages: PackageT[];
};

export default function BranchPageForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [slug, setSlug] = useState("");
  const [branchName, setBranchName] = useState("");
  const [description, setDescription] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [directionsUrl, setDirectionsUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [starRating, setStarRating] = useState(4);
  const [published, setPublished] = useState(true);

  const [attractions, setAttractions] = useState<Attraction[]>([
    { id: "a1", label: "", image: "" },
  ]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    { title: "", description: "", image: "" },
  ]);
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      externalId: "exp-1",
      title: "",
      description: "",
      highlightImage: "",
      packages: [
        {
          id: "p1",
          title: "",
          subtitle: "",
          description: "",
          image: "",
          ctaLabel: "",
        },
      ],
    },
  ]);

  const [saving, setSaving] = useState(false);

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: fd });
    const json = await res.json();
    return json.url;
  }

  function slugify(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // helpers to mutate dynamic lists
  const updateAttraction = (index: number, patch: Partial<Attraction>) =>
    setAttractions((s) =>
      s.map((a, i) => (i === index ? { ...a, ...patch } : a))
    );
  const addAttraction = () =>
    setAttractions((s) => [
      ...s,
      { id: `a${Date.now()}`, label: "", image: "" },
    ]);
  const removeAttraction = (i: number) =>
    setAttractions((s) => s.filter((_, idx) => idx !== i));

  const updateAccommodation = (index: number, patch: Partial<Accommodation>) =>
    setAccommodations((s) =>
      s.map((a, i) => (i === index ? { ...a, ...patch } : a))
    );
  const addAccommodation = () =>
    setAccommodations((s) => [...s, { title: "", description: "", image: "" }]);
  const removeAccommodation = (i: number) =>
    setAccommodations((s) => s.filter((_, idx) => idx !== i));

  const updateExperience = (index: number, patch: Partial<Experience>) =>
    setExperiences((s) =>
      s.map((ex, i) => (i === index ? ({ ...ex, ...patch } as Experience) : ex))
    );
  const addExperience = () =>
    setExperiences((s) => [
      ...s,
      {
        externalId: `exp-${Date.now()}`,
        title: "",
        description: "",
        highlightImage: "",
        packages: [],
      },
    ]);
  const removeExperience = (i: number) =>
    setExperiences((s) => s.filter((_, idx) => idx !== i));

  const addPackage = (expIndex: number) =>
    setExperiences((s) =>
      s.map((ex, i) =>
        i === expIndex
          ? {
              ...ex,
              packages: [...ex.packages, { id: `p-${Date.now()}`, title: "" }],
            }
          : ex
      )
    );
  const removePackage = (expIndex: number, pkgIndex: number) =>
    setExperiences((s) =>
      s.map((ex, i) =>
        i === expIndex
          ? { ...ex, packages: ex.packages.filter((_, j) => j !== pkgIndex) }
          : ex
      )
    );

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!branchName) return alert("branchName required");
    setSaving(true);
    try {
      const finalSlug = slug || slugify(branchName);

      // upload hero if provided
      let heroImageUrl: string | null = null;
      if (heroImageFile) heroImageUrl = await uploadFile(heroImageFile);

      // upload attraction/accommodation/experience images if they are File objects? (this UI uses string inputs for image path)
      // Build payload compatible with POST /api/branches nested create
      const payload: any = {
        slug: finalSlug,
        branchName,
        description,
        heroImage: heroImageUrl,
        directionsUrl,
        starRating,
        published,
        contact: { phone, email },
        attractions: attractions.map((a) => ({
          id: a.id,
          label: a.label,
          image: a.image || null,
        })),
        accommodations: accommodations.map((ac) => ({
          title: ac.title,
          description: ac.description || null,
          image: ac.image || null,
        })),
        experiences: experiences.map((ex) => ({
          externalId: ex.externalId,
          title: ex.title,
          description: ex.description || null,
          highlightImage: ex.highlightImage || null,
          packages: ex.packages.map((p) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle || null,
            description: p.description || null,
            image: p.image || null,
            ctaLabel: p.ctaLabel || null,
          })),
        })),
        seo: {
          title: `${branchName} | Haile Resort`,
          description: description || null,
          keywords: [branchName],
        },
        location: { city: "", region: "", country: "" },
      };

      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create failed");
      onCreated?.();
      // reset UI
      setSlug("");
      setBranchName("");
      setDescription("");
      setHeroImageFile(null);
      setAttractions([{ id: "a1", label: "", image: "" }]);
      setAccommodations([{ title: "", description: "", image: "" }]);
      setExperiences([
        {
          externalId: "exp-1",
          title: "",
          description: "",
          highlightImage: "",
          packages: [{ id: "p1", title: "" }],
        },
      ]);
      alert("Branch created");
    } catch (err) {
      console.error(err);
      alert("Failed to create branch");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-6 text-black" onSubmit={handleSubmit}>
      {/* Basic */}
      <section className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Basic</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Branch name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="Slug (auto)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="Directions URL"
            value={directionsUrl}
            onChange={(e) => setDirectionsUrl(e.target.value)}
            className="border rounded p-2 col-span-2"
          />
          <textarea
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 col-span-2"
          />
          <div>
            <label className="block text-sm">Hero image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
            />
            <div className="text-xs text-gray-600 mt-1">
              Uploads to /api/uploads
            </div>
          </div>
          <div>
            <label className="block text-sm">Star rating</label>
            <input
              type="number"
              min={1}
              max={5}
              value={starRating}
              onChange={(e) => setStarRating(Number(e.target.value))}
              className="border rounded p-2 w-24"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>Published</span>
          </label>
        </div>
      </section>

      {/* Contact */}
      <section className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded p-2"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </section>

      {/* Attractions */}
      <section className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Attractions</h3>
          <button
            type="button"
            onClick={addAttraction}
            className="text-sm px-2 py-1 border rounded"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 mt-3">
          {attractions.map((a, i) => (
            <div
              key={a.id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
            >
              <input
                placeholder="Label"
                value={a.label}
                onChange={(e) => updateAttraction(i, { label: e.target.value })}
                className="border rounded p-2 col-span-2"
              />
              <input
                placeholder="Image path or URL"
                value={a.image}
                onChange={(e) => updateAttraction(i, { image: e.target.value })}
                className="border rounded p-2"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeAttraction(i)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accommodations */}
      <section className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Accommodations</h3>
          <button
            type="button"
            onClick={addAccommodation}
            className="text-sm px-2 py-1 border rounded"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 mt-3">
          {accommodations.map((ac, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start"
            >
              <input
                placeholder="Title"
                value={ac.title}
                onChange={(e) =>
                  updateAccommodation(i, { title: e.target.value })
                }
                className="border rounded p-2 col-span-1"
              />
              <textarea
                placeholder="Description"
                value={ac.description}
                onChange={(e) =>
                  updateAccommodation(i, { description: e.target.value })
                }
                className="border rounded p-2 col-span-1"
              />
              <div>
                <input
                  placeholder="Image path or URL"
                  value={ac.image}
                  onChange={(e) =>
                    updateAccommodation(i, { image: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => removeAccommodation(i)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences & Packages */}
      <section className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Experiences & Packages</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addExperience}
              className="text-sm px-2 py-1 border rounded"
            >
              + Experience
            </button>
          </div>
        </div>

        <div className="space-y-4 mt-3">
          {experiences.map((ex, ei) => (
            <div key={ex.externalId || ei} className="border p-3 rounded">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <input
                    placeholder="Experience title"
                    value={ex.title}
                    onChange={(e) =>
                      updateExperience(ei, { title: e.target.value })
                    }
                    className="border rounded p-2 w-full mb-2"
                  />
                  <textarea
                    placeholder="Experience description"
                    value={ex.description}
                    onChange={(e) =>
                      updateExperience(ei, { description: e.target.value })
                    }
                    className="border rounded p-2 w-full mb-2"
                  />
                  <input
                    placeholder="Highlight image path or URL"
                    value={ex.highlightImage}
                    onChange={(e) =>
                      updateExperience(ei, { highlightImage: e.target.value })
                    }
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => addPackage(ei)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    + Package
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(ei)}
                    className="px-2 py-1 border rounded text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {ex.packages.map((p, pi) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start"
                  >
                    <input
                      placeholder="Package title"
                      value={p.title}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[ei].packages[pi].title = e.target.value;
                        setExperiences(copy);
                      }}
                      className="border rounded p-2"
                    />
                    <input
                      placeholder="CTA label"
                      value={p.ctaLabel}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[ei].packages[pi].ctaLabel = e.target.value;
                        setExperiences(copy);
                      }}
                      className="border rounded p-2"
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="Image path"
                        value={p.image}
                        onChange={(e) => {
                          const copy = [...experiences];
                          copy[ei].packages[pi].image = e.target.value;
                          setExperiences(copy);
                        }}
                        className="border rounded p-2"
                      />
                      <button
                        type="button"
                        onClick={() => removePackage(ei, pi)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO & Location */}
      <section className="p-4 border rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">SEO Title</label>
          <input
            placeholder="SEO title"
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm">SEO Keywords (comma)</label>
          <input placeholder="keywords" className="border rounded p-2 w-full" />
        </div>

        <div>
          <label className="block text-sm">City</label>
          <input placeholder="City" className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Region</label>
          <input placeholder="Region" className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Country</label>
          <input placeholder="Country" className="border rounded p-2 w-full" />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            /* optional reset */
          }}
          className="px-4 py-2 border rounded"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-slate-800 text-white rounded"
        >
          {saving ? "Saving..." : "Create Branch"}
        </button>
      </div>
    </form>
  );
}
