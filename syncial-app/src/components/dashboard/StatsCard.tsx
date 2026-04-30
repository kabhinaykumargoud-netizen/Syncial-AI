interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  change?: string;
  changePositive?: boolean;
}

export default function StatsCard({ title, value, icon, color, change, changePositive }: StatsCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 flex items-start justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{title}</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
        {change && (
          <p className={`text-xs font-medium ${changePositive ? 'text-green-400' : 'text-red-400'}`}>
            {changePositive ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '20', color: color }}
      >
        {icon}
      </div>
    </div>
  );
}
