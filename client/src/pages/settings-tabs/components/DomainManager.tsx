/**
 * DomainManager Component
 * Manages priority domains with add/remove functionality
 */

import { useState } from 'react';
import { Globe, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DEFAULT_PRIORITY_DOMAINS } from '@/lib/presets';
import { SettingsCard } from './SettingsCard';

export interface DomainManagerProps {
  customDomains: string[];
  setCustomDomains: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DomainManager({
  customDomains,
  setCustomDomains,
}: DomainManagerProps) {
  const [newDomain, setNewDomain] = useState('');
  const allDomains = [...DEFAULT_PRIORITY_DOMAINS, ...customDomains];

  const handleAddDomain = () => {
    const domain = newDomain.trim().toLowerCase();
    if (!domain) return;
    if (allDomains.includes(domain)) {
      toast.error('このドメインは既に登録されています');
      return;
    }
    setCustomDomains(prev => [...prev, domain]);
    setNewDomain('');
    toast.success('ドメインを追加しました');
  };

  const handleRemoveDomain = (domain: string) => {
    if (DEFAULT_PRIORITY_DOMAINS.includes(domain)) {
      toast.error('デフォルトドメインは削除できません');
      return;
    }
    setCustomDomains(prev => prev.filter(d => d !== domain));
    toast.success('ドメインを削除しました');
  };

  return (
    <SettingsCard
      icon={Globe}
      title="優先ドメイン"
      description="検索時に優先するドメインを管理します"
    >
      <div className="flex gap-2">
        <Input
          placeholder="例: example.go.jp"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
          className="flex-1"
        />
        <Button onClick={handleAddDomain} className="gap-2">
          <Plus className="w-4 h-4" />
          追加
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-4">
          {allDomains.map((domain) => {
            const isDefault = DEFAULT_PRIORITY_DOMAINS.includes(domain);
            return (
              <div
                key={domain}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg border',
                  isDefault ? 'bg-muted/30 border-border' : 'bg-primary/5 border-primary/30'
                )}
              >
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 font-mono text-xs">{domain}</span>
                {isDefault ? (
                  <span className="text-xs text-muted-foreground">デフォルト</span>
                ) : (
                  <button
                    onClick={() => handleRemoveDomain(domain)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </SettingsCard>
  );
}
