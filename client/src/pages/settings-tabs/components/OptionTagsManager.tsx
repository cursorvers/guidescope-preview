/**
 * OptionTagsManager Component
 * Manages scope and audience options as tag lists
 */

import { useState } from 'react';
import { Layers, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DEFAULT_SCOPE_OPTIONS, DEFAULT_AUDIENCE_OPTIONS } from '@/lib/presets';
import { SettingsCard } from './SettingsCard';

export interface OptionTagsManagerProps {
  customScopes: string[];
  setCustomScopes: React.Dispatch<React.SetStateAction<string[]>>;
  customAudiences: string[];
  setCustomAudiences: React.Dispatch<React.SetStateAction<string[]>>;
}

export function OptionTagsManager({
  customScopes,
  setCustomScopes,
  customAudiences,
  setCustomAudiences,
}: OptionTagsManagerProps) {
  const [newScope, setNewScope] = useState('');
  const [newAudience, setNewAudience] = useState('');

  const allScopes = [...DEFAULT_SCOPE_OPTIONS, ...customScopes];
  const allAudiences = [...DEFAULT_AUDIENCE_OPTIONS, ...customAudiences];

  // Scope handlers
  const handleAddScope = () => {
    const scope = newScope.trim();
    if (!scope) return;
    if (allScopes.includes(scope)) {
      toast.error('この範囲は既に登録されています');
      return;
    }
    setCustomScopes(prev => [...prev, scope]);
    setNewScope('');
    toast.success('対象範囲を追加しました');
  };

  const handleRemoveScope = (scope: string) => {
    if (DEFAULT_SCOPE_OPTIONS.includes(scope)) {
      toast.error('デフォルト範囲は削除できません');
      return;
    }
    setCustomScopes(prev => prev.filter(s => s !== scope));
    toast.success('対象範囲を削除しました');
  };

  // Audience handlers
  const handleAddAudience = () => {
    const audience = newAudience.trim();
    if (!audience) return;
    if (allAudiences.includes(audience)) {
      toast.error('この対象者は既に登録されています');
      return;
    }
    setCustomAudiences(prev => [...prev, audience]);
    setNewAudience('');
    toast.success('対象者を追加しました');
  };

  const handleRemoveAudience = (audience: string) => {
    if (DEFAULT_AUDIENCE_OPTIONS.includes(audience)) {
      toast.error('デフォルト対象者は削除できません');
      return;
    }
    setCustomAudiences(prev => prev.filter(a => a !== audience));
    toast.success('対象者を削除しました');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SettingsCard
        icon={Layers}
        title="対象範囲オプション"
        description="探索条件で選択できる対象範囲"
      >
        <div className="flex gap-2">
          <Input
            placeholder="例: 遠隔医療"
            value={newScope}
            onChange={(e) => setNewScope(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddScope()}
            className="flex-1"
          />
          <Button onClick={handleAddScope} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {allScopes.map((scope) => {
            const isDefault = DEFAULT_SCOPE_OPTIONS.includes(scope);
            return (
              <div
                key={scope}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                  isDefault ? 'bg-muted' : 'bg-primary/10 text-primary'
                )}
              >
                <span>{scope}</span>
                {!isDefault && (
                  <button
                    onClick={() => handleRemoveScope(scope)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Layers}
        title="対象者オプション"
        description="探索条件で選択できる対象者"
      >
        <div className="flex gap-2">
          <Input
            placeholder="例: 患者"
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAudience()}
            className="flex-1"
          />
          <Button onClick={handleAddAudience} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {allAudiences.map((audience) => {
            const isDefault = DEFAULT_AUDIENCE_OPTIONS.includes(audience);
            return (
              <div
                key={audience}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                  isDefault ? 'bg-muted' : 'bg-primary/10 text-primary'
                )}
              >
                <span>{audience}</span>
                {!isDefault && (
                  <button
                    onClick={() => handleRemoveAudience(audience)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
}
