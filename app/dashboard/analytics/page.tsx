import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const channels = [
  { label: "Instagram", percent: 42 },
  { label: "YouTube", percent: 28 },
  { label: "Newsletter", percent: 18 },
  { label: "Referrals", percent: 12 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Insights
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Analytics
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Audience reach", "184.2K", "+21.5%"],
          ["Engagement", "7.8%", "+1.4%"],
          ["Paid conversions", "3.2%", "+0.8%"],
        ].map(([label, value, delta]) => (
          <Card key={label} className="border-slate-200 bg-white">
            <CardHeader>
              <p className="text-sm text-slate-500">{label}</p>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-900">
                {value}
              </div>
              <p className="mt-2 text-sm font-medium text-emerald-600">
                {delta} vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Acquisition sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.label}>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                <span>{channel.label}</span>
                <span>{channel.percent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-violet-500"
                  style={{ width: `${channel.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
