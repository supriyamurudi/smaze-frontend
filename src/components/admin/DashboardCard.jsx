import { ArrowUpRight } from "lucide-react";

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color = "bg-violet-600",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Background Circle */}

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-50 transition-all duration-300 group-hover:scale-125" />

      {/* Top */}

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} shadow-lg`}
        >
          <Icon size={26} className="text-white" />
        </div>

        <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
          +12%
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* Value */}

      <h2 className="mt-8 text-4xl font-bold text-slate-900">{value}</h2>

      {/* Title */}

      <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>

      {/* Bottom */}

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">Compared to last month</span>

        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          Excellent
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;
