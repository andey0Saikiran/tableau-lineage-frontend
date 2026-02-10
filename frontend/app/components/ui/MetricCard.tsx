interface MetricCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export function MetricCard({ label, value, icon, color }: MetricCardProps) {
  return (
    <div className="group relative bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl p-6
                    shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.15)]
                    transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-[#64748b] font-semibold uppercase tracking-wider">
            {label}
          </div>
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
        </div>
        <div className={`text-4xl font-bold tracking-tight bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value.toLocaleString()}
        </div>

        <div className="mt-4 h-1 bg-black/5 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${color} rounded-full animate-expandBar`}
          />
        </div>
      </div>
    </div>
  );
}