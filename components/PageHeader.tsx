import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Icon className="text-primary" />
        {title}
      </h1>
      <p className="text-base-content/60 mt-1">{subtitle}</p>
    </div>
  );
}
