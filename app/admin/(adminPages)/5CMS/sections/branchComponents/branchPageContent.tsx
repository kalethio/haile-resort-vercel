// src/components/branchPageContent.tsx
"use client";
import React, { useEffect, useState } from "react";

type Attraction = { id?: string; label: string; image?: string };
type Accommodation = {
  id?: number;
  title: string;
  description?: string;
  image?: string;
};
type PackageT = {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
};
type Experience = {
  id?: number;
  externalId?: string;
  title: string;
  description?: string;
  highlightImage?: string;
  packages: PackageT[];
};

export default function BranchPageContent({
  slug,
  onSaved,
}: {
  slug: string;
  onSaved?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branch, setBranch] = useState<any>(null);

  useEffect(() => {
    if (slug) fetchBranch();
  }, [slug]);

  async function fetchBranch() {
    setLoading(true);
    try {
      const res = await fetch(`/api/branches/${slug}`);
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      // normalize to editable structure
      setBranch({
        branchName: data.branchName,
        description: data.description ?? "",
        heroImage: data.heroImage ?? "",
        directionsUrl: data.directionsUrl ?? "",
        starRating: data.starRating ?? 4,
        published: !!data.published,
        contact: {
          phone: data.contact?.phone ?? "",
          email: data.contact?.email ?? "",
          address: data.contact?.address ?? "",
        },
        attractions: data.attractions ?? [],
        accommodations: data.accommodations ?? [],
        experiences: (data.experiences ?? []).map((ex: any) => ({
          ...ex,
          packages: ex.packages ?? [],
        })),
        seo: data.seo ?? {},
        location: data.location ?? {},
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch branch");
    } finally {
      setLoading(false);
    }
  }

  function updateField(path: string[], value: any) {
    setBranch((b: any) => {
      const copy = JSON.parse(JSON.stringify(b));
      let cur: any = copy;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return copy;
    });
  }

  async function handleSave() {
    if (!branch) return;
    setSaving(true);
    try {
      const payload = {
        branchName: branch.branchName,
        description: branch.description,
        heroImage: branch.heroImage,
        directionsUrl: branch.directionsUrl,
        starRating: branch.starRating,
        published: branch.published,
        contact: branch.contact,
        // server expects nested update logic; for now send full nested arrays and server will reconcile (implement in API)
        attractions: branch.attractions,
        accommodations: branch.accommodations,
        experiences: branch.experiences,
        seo: branch.seo,
        location: branch.location,
      };
      const res = await fetch(`/api/branches/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      onSaved?.();
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!branch) return <div>Branch not found</div>;

  return (
    <div className="space-y-4 text-black">
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Basic</h3>
        <input
          className="border p-2 rounded w-full mt-2"
          value={branch.branchName}
          onChange={(e) => updateField(["branchName"], e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full mt-2"
          value={branch.description}
          onChange={(e) => updateField(["description"], e.target.value)}
        />
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold">Contact</h3>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <input
            value={branch.contact.phone}
            onChange={(e) => updateField(["contact", "phone"], e.target.value)}
            className="border p-2 rounded"
          />
          <input
            value={branch.contact.email}
            onChange={(e) => updateField(["contact", "email"], e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold">Attractions</h3>
        <div className="space-y-2 mt-2">
          {(branch.attractions || []).map((a: any, i: number) => (
            <div key={a.id || i} className="flex gap-2">
              <input
                className="border p-2 rounded flex-1"
                value={a.label}
                onChange={(e) => {
                  const copy = [...branch.attractions];
                  copy[i].label = e.target.value;
                  updateField(["attractions"], copy);
                }}
              />
              <input
                className="border p-2 rounded w-48"
                value={a.image || ""}
                onChange={(e) => {
                  const copy = [...branch.attractions];
                  copy[i].image = e.target.value;
                  updateField(["attractions"], copy);
                }}
              />
            </div>
          ))}
          <button
            className="px-2 py-1 border rounded"
            onClick={() =>
              updateField(
                ["attractions"],
                [
                  ...branch.attractions,
                  { id: `a${Date.now()}`, label: "", image: "" },
                ]
              )
            }
          >
            + Add attraction
          </button>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold">Accommodations</h3>
        <div className="space-y-2 mt-2">
          {(branch.accommodations || []).map((ac: any, i: number) => (
            <div key={ac.id || i} className="grid sm:grid-cols-3 gap-2">
              <input
                className="border p-2 rounded"
                value={ac.title}
                onChange={(e) => {
                  const copy = [...branch.accommodations];
                  copy[i].title = e.target.value;
                  updateField(["accommodations"], copy);
                }}
              />
              <input
                className="border p-2 rounded"
                value={ac.description || ""}
                onChange={(e) => {
                  const copy = [...branch.accommodations];
                  copy[i].description = e.target.value;
                  updateField(["accommodations"], copy);
                }}
              />
              <input
                className="border p-2 rounded"
                value={ac.image || ""}
                onChange={(e) => {
                  const copy = [...branch.accommodations];
                  copy[i].image = e.target.value;
                  updateField(["accommodations"], copy);
                }}
              />
            </div>
          ))}
          <button
            className="px-2 py-1 border rounded"
            onClick={() =>
              updateField(
                ["accommodations"],
                [
                  ...branch.accommodations,
                  { title: "", description: "", image: "" },
                ]
              )
            }
          >
            + Add accommodation
          </button>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold">Experiences & Packages</h3>
        <div className="space-y-4 mt-2">
          {(branch.experiences || []).map((ex: any, ei: number) => (
            <div key={ex.id || ei} className="border p-3 rounded">
              <input
                className="border p-2 rounded w-full mb-2"
                value={ex.title}
                onChange={(e) => {
                  const copy = [...branch.experiences];
                  copy[ei].title = e.target.value;
                  updateField(["experiences"], copy);
                }}
              />
              <textarea
                className="border p-2 rounded w-full mb-2"
                value={ex.description || ""}
                onChange={(e) => {
                  const copy = [...branch.experiences];
                  copy[ei].description = e.target.value;
                  updateField(["experiences"], copy);
                }}
              />

              <div className="text-sm font-medium mb-2">Packages</div>
              {(ex.packages || []).map((p: any, pi: number) => (
                <div
                  key={p.id || pi}
                  className="grid sm:grid-cols-3 gap-2 mb-2"
                >
                  <input
                    className="border p-2 rounded"
                    value={p.title}
                    onChange={(e) => {
                      const copy = [...branch.experiences];
                      copy[ei].packages[pi].title = e.target.value;
                      updateField(["experiences"], copy);
                    }}
                  />
                  <input
                    className="border p-2 rounded"
                    value={p.ctaLabel || ""}
                    onChange={(e) => {
                      const copy = [...branch.experiences];
                      copy[ei].packages[pi].ctaLabel = e.target.value;
                      updateField(["experiences"], copy);
                    }}
                  />
                  <input
                    className="border p-2 rounded"
                    value={p.image || ""}
                    onChange={(e) => {
                      const copy = [...branch.experiences];
                      copy[ei].packages[pi].image = e.target.value;
                      updateField(["experiences"], copy);
                    }}
                  />
                </div>
              ))}
              <button
                className="px-2 py-1 border rounded"
                onClick={() => {
                  const copy = [...branch.experiences];
                  copy[ei].packages.push({
                    id: `p${Date.now()}`,
                    title: "",
                    ctaLabel: "",
                    image: "",
                  });
                  updateField(["experiences"], copy);
                }}
              >
                + Add package
              </button>
            </div>
          ))}
          <button
            className="px-2 py-1 border rounded"
            onClick={() =>
              updateField(
                ["experiences"],
                [
                  ...(branch.experiences || []),
                  {
                    externalId: `exp${Date.now()}`,
                    title: "",
                    description: "",
                    highlightImage: "",
                    packages: [],
                  },
                ]
              )
            }
          >
            + Add experience
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded"
          onClick={() => fetchBranch()}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-slate-800 text-white rounded"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
