"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UserRoleControl.tsx
 * -------------------
 * Improved single-file implementation for the "User Role Control" page.
 * Tech: Next.js (app router) + TailwindCSS + TypeScript.
 *
 * Goals for this iteration (per your direction):
 * - Cleaner structure with small subcomponents defined inline for a single-file
 *   developer UX during early-stage prototyping.
 * - Clearer, enterprise-oriented comments marking integration points (API / data.ts)
 * - Better UX: debounced search, keyboard support, select-all, undo toast,
 *   accessible modals, side panel focus management.
 * - Keep mock data local but show how to swap to `data.ts` (commented import).
 * - Well-documented: inline comments explaining each interaction point.
 *
 * Next-phase: split into components/files and replace local calls with API hooks.
 */

/* =========================
   Types
   ========================= */

type ID = string;

type Branch = { id: ID; name: string };

type Role = { id: ID; name: string; description?: string };

type UserStatus = "active" | "inactive" | "archived";

type User = {
  id: ID;
  name: string;
  email: string;
  roleId: ID;
  branches: ID[]; // branch ids
  status: UserStatus;
  lastLogin?: string | null;
};

/* =========================
   Data (MVP): Local mock; replace with `import { branches, roles, users }
   from './data';` when ready to externalize.
   ========================= */

// Example: // import { initialBranches, initialRoles, initialUsers } from './data';
const initialBranches: Branch[] = [
  { id: "branch-addis", name: "Addis Ababa" },
  { id: "branch-bahir", name: "Bahir Dar" },
  { id: "branch-hawassa", name: "Hawassa" },
];

const initialRoles: Role[] = [
  { id: "role-super", name: "Super Admin", description: "Full system access" },
  {
    id: "role-manager",
    name: "Manager",
    description: "Manage bookings & team",
  },
  { id: "role-tech", name: "Technician", description: "Field task updates" },
  { id: "role-admin", name: "Admin", description: "Site admin" },
];

const initialUsers: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@hotel.com",
    roleId: "role-manager",
    branches: ["branch-addis"],
    status: "active",
    lastLogin: "2025-09-30T10:12:00Z",
  },
  {
    id: "u2",
    name: "Sara Smith",
    email: "sara@hotel.com",
    roleId: "role-tech",
    branches: ["branch-bahir"],
    status: "active",
    lastLogin: "2025-09-28T08:01:00Z",
  },
  {
    id: "u3",
    name: "Ali Ibrahim",
    email: "ali@hotel.com",
    roleId: "role-admin",
    branches: ["branch-addis"],
    status: "inactive",
    lastLogin: null,
  },
];

/* =========================
   Utilities
   - uid: minimal id generator for local mocks
   - debounce: small utility for search
   ========================= */

const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 250) {
  let t: number | null = null;
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}

/* =========================
   Accessible Focus Trap (minimal)
   - For side panel / modal we capture focus for keyboard users.
   - This is a lean helper — replace with a11y lib in production.
   ========================= */

function useFocusTrap(open: boolean, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, ref]);
}

/* =========================
   Subcomponents (inline for single-file dev speed)
   - Badge, Button small, Icon placeholders, etc.
   ========================= */

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-800">
    {children}
  </span>
);

/* =========================
   Main Component
   ========================= */

export default function UserRoleControl() {
  // === data stores (local for now) ===
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // === UI state ===
  const [query, setQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState<string | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string | "all">("all");

  // Side panel & modal
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"view" | "create" | "edit">(
    "view"
  );
  const [activeUserId, setActiveUserId] = useState<ID | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(panelOpen, panelRef);

  // Selection for bulk
  const [selected, setSelected] = useState<Record<ID, boolean>>({});
  const selectedCount = Object.values(selected).filter(Boolean).length;

  // Undo stack (simple): store last change to revert (for demo)
  const [lastAction, setLastAction] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Pagination (simple)
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Debounced search handler (for UX)
  const debouncedSetQuery = useRef(
    debounce((q: string) => setQuery(q), 200)
  ).current;

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  /* =========================
     Derived lists & helpers
   ========================= */

  const roleName = (id: ID) => roles.find((r) => r.id === id)?.name || "—";
  const branchNames = (u: User) =>
    u.branches
      .map((b) => branches.find((x) => x.id === b)?.name || b)
      .join(", ");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) =>
        filterBranch === "all" ? true : u.branches.includes(filterBranch)
      )
      .filter((u) =>
        filterStatus === "all"
          ? true
          : u.status === (filterStatus as UserStatus)
      )
      .filter((u) => {
        if (!q) return true;
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          roleName(u.roleId).toLowerCase().includes(q)
        );
      });
  }, [users, query, filterBranch, filterStatus, roles]);

  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  /* =========================
     CRUD (local) — clearly marked for later API replacement
     Integration notes:
     - Replace setUsers(...) with API calls and optimistic updates
     - Keep toasts/undo stack for UX parity with backend operations
   ========================= */

  const createUser = (payload: Omit<User, "id" | "lastLogin">) => {
    const u: User = { ...payload, id: uid("user"), lastLogin: null };
    setUsers((s) => [u, ...s]);
    setLastAction({ type: "create", payload: u });
    setToast("User created");
    // API: POST /users
  };

  const updateUser = (id: ID, patch: Partial<User>) => {
    const prev = users.find((x) => x.id === id);
    if (!prev) return;
    setUsers((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    setLastAction({ type: "update", id, prev });
    setToast("User updated");
    // API: PATCH /users/:id
  };

  const archiveUser = (id: ID) => {
    const prev = users.find((x) => x.id === id);
    if (!prev) return;
    setUsers((s) =>
      s.map((x) => (x.id === id ? { ...x, status: "archived" } : x))
    );
    setLastAction({ type: "archive", id, prev });
    setToast("User archived");
    // API: DELETE /users/:id or PATCH status
  };

  const undoLast = () => {
    if (!lastAction) return;
    if (lastAction.type === "create") {
      setUsers((s) => s.filter((x) => x.id !== lastAction.payload.id));
      setToast("Create undone");
    } else if (lastAction.type === "update") {
      setUsers((s) =>
        s.map((x) => (x.id === lastAction.id ? lastAction.prev : x))
      );
      setToast("Update undone");
    } else if (lastAction.type === "archive") {
      setUsers((s) =>
        s.map((x) => (x.id === lastAction.id ? lastAction.prev : x))
      );
      setToast("Archive undone");
    }
    setLastAction(null);
  };

  /* =========================
     Selection helpers
   ========================= */
  const toggleSelect = (id: ID) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const selectAll = () => {
    const map: Record<ID, boolean> = {};
    filtered.forEach((u) => (map[u.id] = true));
    setSelected(map);
  };
  const clearSelection = () => setSelected({});

  /* =========================
     Panel control helpers
   ========================= */
  const openCreate = () => {
    setPanelMode("create");
    setActiveUserId(null);
    setPanelOpen(true);
  };
  const openView = (id: ID) => {
    setPanelMode("view");
    setActiveUserId(id);
    setPanelOpen(true);
  };
  const openEdit = (id: ID) => {
    setPanelMode("edit");
    setActiveUserId(id);
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setActiveUserId(null);
    setPanelMode("view");
  };

  /* =========================
     Subcomponent: UserRow
   ========================= */
  function UserRow({ u }: { u: User }) {
    return (
      <tr className="border-b">
        <td className="px-3 py-2">
          <input
            aria-label={`Select ${u.name}`}
            checked={!!selected[u.id]}
            onChange={() => toggleSelect(u.id)}
            type="checkbox"
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">
              {u.name.split(" ")[0][0]}
            </div>
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-slate-500">{u.email}</div>
            </div>
          </div>
        </td>
        <td className="px-3 py-2">{roleName(u.roleId)}</td>
        <td className="px-3 py-2">{branchNames(u)}</td>
        <td className="px-3 py-2 text-sm text-slate-500">
          {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "—"}
        </td>
        <td className="px-3 py-2">
          <Badge>{u.status}</Badge>
        </td>
        <td className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => openView(u.id)}
              aria-label={`View ${u.name}`}
              className="text-sm rounded px-2 py-1 border"
            >
              View
            </button>
            <button
              onClick={() => openEdit(u.id)}
              className="text-sm rounded px-2 py-1 bg-slate-800 text-white"
            >
              Quick Edit
            </button>
            <button
              onClick={() => archiveUser(u.id)}
              className="text-sm rounded px-2 py-1 border text-red-600"
            >
              Archive
            </button>
          </div>
        </td>
      </tr>
    );
  }

  /* =========================
     Subcomponent: Panel (View/Create/Edit)
     - Panel will render a profile view or a form depending on mode.
   ========================= */

  function SidePanel() {
    const active = users.find((x) => x.id === activeUserId) || null;

    return (
      <aside
        ref={panelRef}
        aria-hidden={!panelOpen}
        className={`rounded bg-white shadow-sm min-h-[240px] p-4 transition-all ${panelOpen ? "opacity-100" : "opacity-60"}`}
      >
        {!panelOpen ? (
          <div>
            <div className="text-sm font-medium">Details panel</div>
            <p className="text-xs text-slate-500 mt-2">
              Select a user and click View to open details here.
            </p>
          </div>
        ) : panelMode === "create" ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Create user</div>
              <button onClick={closePanel} className="text-sm">
                Close
              </button>
            </div>
            <div className="mt-3">
              <UserForm
                mode="create"
                onCancel={closePanel}
                onSave={(p) => {
                  createUser(p as any);
                  closePanel();
                }}
              />
            </div>
          </div>
        ) : active ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                {panelMode === "view" ? "View user" : "Edit user"}
              </div>
              <div className="flex gap-2">
                {panelMode === "view" && (
                  <button
                    onClick={() => openEdit(active.id)}
                    className="text-sm rounded border px-2 py-1"
                  >
                    Edit
                  </button>
                )}
                <button onClick={closePanel} className="text-sm">
                  Close
                </button>
              </div>
            </div>

            <div className="mt-3">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-500">Name</div>
                  <div className="font-medium">{active.name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <div className="font-medium">{active.email}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Role</div>
                  <div className="font-medium">{roleName(active.roleId)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Branches</div>
                  <div className="font-medium">{branchNames(active)}</div>
                </div>
                <div className="pt-2 border-t" />
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(active.id)}
                    className="rounded border px-3 py-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => archiveUser(active.id)}
                    className="rounded bg-red-600 text-white px-3 py-2"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => setToast("Invite resent (simulated)")}
                    className="rounded border px-3 py-2"
                  >
                    Resend invite
                  </button>
                </div>

                {panelMode === "edit" && (
                  <div className="mt-3">
                    <UserForm
                      mode="edit"
                      user={active}
                      onCancel={() => setPanelMode("view")}
                      onSave={(p) => {
                        updateUser(active.id, p as any);
                        setPanelMode("view");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-red-600">User not found</div>
        )}
      </aside>
    );
  }

  /* =========================
     Subcomponent: UserForm
     - Minimal validation, progressive disclosure for advanced options.
   ========================= */
  function UserForm({
    mode,
    user,
    onCancel,
    onSave,
  }: {
    mode: "create" | "edit";
    user?: User | null;
    onCancel: () => void;
    onSave: (payload: any) => void;
  }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [roleId, setRoleId] = useState(user?.roleId || roles[0]?.id || "");
    const [selBranches, setSelBranches] = useState<ID[]>(
      user?.branches || [branches[0]?.id]
    );
    const [status, setStatus] = useState<UserStatus>(user?.status || "active");

    useEffect(() => {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setRoleId(user?.roleId || roles[0]?.id || "");
      setSelBranches(user?.branches || [branches[0]?.id]);
      setStatus(user?.status || "active");
    }, [user]);

    const toggleBranch = (id: ID) =>
      setSelBranches((s) =>
        s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
      );
    const valid =
      name.trim() && email.includes("@") && roleId && selBranches.length > 0;

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          onSave({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            roleId,
            branches: selBranches,
            status,
          });
        }}
      >
        <div className="space-y-3">
          <label className="block">
            <div className="text-sm font-medium">Full name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium">Role</div>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              {roles.map((r) => (
                <option value={r.id} key={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="text-sm font-medium">Branches</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBranch(b.id)}
                  className={`px-3 py-1 rounded-full border text-sm ${selBranches.includes(b.id) ? "bg-slate-800 text-white" : "bg-white"}`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Status</div>
            <div className="mt-2 flex gap-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                />{" "}
                <span className="text-sm">Active</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  checked={status === "inactive"}
                  onChange={() => setStatus("inactive")}
                />{" "}
                <span className="text-sm">Inactive</span>
              </label>
            </div>
          </div>

          <details className="mt-2 text-sm text-slate-600">
            <summary className="cursor-pointer">Advanced options</summary>
            <div className="mt-2 space-y-2">
              <div>
                <label className="block text-sm">
                  Require MFA on next login
                </label>
                <input type="checkbox" />
              </div>
              <div>
                <label className="block text-sm">Temporary access expiry</label>
                <input type="date" className="mt-1 rounded border px-2 py-1" />
              </div>
            </div>
          </details>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded border px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid}
              className={`rounded px-3 py-2 text-white ${valid ? "bg-slate-800" : "bg-slate-300"}`}
            >
              {mode === "create" ? "Create user" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  /* =========================
     Render layout
   ========================= */

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Topbar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="rounded bg-slate-800 text-white px-4 py-2"
          >
            + Create User
          </button>
          <input
            onChange={(e) => debouncedSetQuery(e.target.value)}
            placeholder="Search name / email / role"
            className="rounded border px-3 py-2"
          />
          <div className="text-sm text-slate-500 ml-2">
            {selectedCount > 0 ? `${selectedCount} selected` : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value as any)}
            className="rounded border px-3 py-2"
          >
            <option value="all">All branches</option>
            {branches.map((b) => (
              <option value={b.id} key={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded border px-3 py-2"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="relative">
            <button
              onClick={() => {
                if (selectedCount === 0) {
                  setToast("No users selected");
                  return;
                }
                setToast("Bulk assign simulated");
              }}
              className="rounded border px-3 py-2"
            >
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: users table */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded bg-white shadow-sm overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2">
                    <input
                      aria-label="Select all"
                      type="checkbox"
                      onChange={(e) =>
                        e.target.checked ? selectAll() : clearSelection()
                      }
                    />
                  </th>
                  <th className="px-3 py-2 text-left">User</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Branch</th>
                  <th className="px-3 py-2 text-left">Last active</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((u) => (
                  <UserRow key={u.id} u={u} />
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm text-slate-600">
                Showing {Math.min(filtered.length, page * rowsPerPage)} of{" "}
                {filtered.length} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded border px-2 py-1"
                >
                  ◀
                </button>
                <div className="px-2">{page}</div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border px-2 py-1"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: side panel */}
        <div className="col-span-12 lg:col-span-4">
          <SidePanel />
        </div>
      </div>

      {/* Role mini-manager (concise) */}
      <div className="mt-6">
        <div className="text-sm font-medium mb-2">Roles</div>
        <div className="flex gap-2">
          {roles.map((r) => (
            <div key={r.id} className="px-3 py-1 rounded border text-sm">
              {r.name}
            </div>
          ))}
          <button
            onClick={() => {
              const nr = { id: uid("role"), name: "New Role" };
              setRoles((s) => [nr, ...s]);
              setToast("Role created (local)");
            }}
            className="rounded border px-3 py-1 text-sm"
          >
            + Add Role
          </button>
        </div>
      </div>

      {/* Toast & undo */}
      {toast && (
        <div className="fixed right-6 bottom-6 rounded bg-slate-800 text-white px-4 py-2 flex items-center gap-4">
          <div>{toast}</div>
          {lastAction && (
            <button onClick={undoLast} className="underline">
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
