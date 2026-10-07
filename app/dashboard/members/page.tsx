import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const members = [
  {
    name: "Lena Hart",
    role: "Community lead",
    status: "Active",
    revenue: "$3.4K",
  },
  {
    name: "Aaron Cole",
    role: "Growth partner",
    status: "Active",
    revenue: "$2.9K",
  },
  {
    name: "Nia Brooks",
    role: "Content creator",
    status: "Pending",
    revenue: "$2.4K",
  },
  {
    name: "Theo Park",
    role: "Affiliate manager",
    status: "Paused",
    revenue: "$1.8K",
  },
  { name: "Mila Chen", role: "Operations", status: "Active", revenue: "$2.1K" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Paused: "bg-slate-200 text-slate-700",
};

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Community
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Members
          </h1>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">Export list</Button>
          <Button>Invite member</Button>
        </div>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Member directory
          </CardTitle>
          <span className="text-sm text-slate-500">
            {members.length} members
          </span>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Revenue</th>
                  <th className="py-3 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.name}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium text-slate-900">
                      {member.name}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{member.role}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[member.status]}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-900">
                      {member.revenue}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <button className="text-sm font-medium text-violet-600 hover:text-violet-700">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
