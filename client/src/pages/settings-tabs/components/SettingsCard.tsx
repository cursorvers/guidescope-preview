/**
 * SettingsCard Component
 * Reusable card component for settings sections
 */

import { cn } from '@/lib/utils';

export interface SettingsCardProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
  className,
}: SettingsCardProps) {
  return (
    <div className={cn('p-6 rounded-xl border border-border bg-card space-y-4', className)}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
