export default function SystemAdmin() {
  const cards = [
    {
      title: "User Admin",
      description: "Manage roles and permissions",
      href: "/admin/8systemAdmin/user-role",
    },
    {
      title: "Audit Logs",
      description: "View system activity and changes",
      href: "/admin/8systemAdmin/audit-logs",
    },
    {
      title: "API Connections",
      description: "Configure external integrations",
      href: "/admin/8systemAdmin/api-connections",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-accent mb-6">
        System Administration
      </h1>

      <div className="space-y-3 max-w-md">
        {cards.map((card) => (
          <a key={card.title} href={card.href} className="block">
            <div className="bg-gray-100 border-l-4 my-4 border-accent pl-4 py-3 hover:scale-[1.02] transition-transform rounded-md">
              <h2 className="text-lg font-medium text-accent">{card.title}</h2>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
