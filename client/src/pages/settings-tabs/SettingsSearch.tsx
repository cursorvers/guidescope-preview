/**
 * SettingsSearch Tab Component
 * Search settings: operators, priority rules, excluded domains
 */

import { useState } from 'react';
import {
  Search,
  Sliders,
  Globe,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { SearchSettings } from '@/lib/settings';
import { SettingsCard, SettingsRow } from './components';
import type { SettingsSearchProps } from './types';

export function SettingsSearch({
  extendedSettings,
  updateSearch,
}: SettingsSearchProps) {
  const [newFiletype, setNewFiletype] = useState('');
  const [newExcludedDomain, setNewExcludedDomain] = useState('');

  // Filetype handlers
  const handleAddFiletype = () => {
    const filetype = newFiletype.trim().toLowerCase().replace('.', '');
    if (!filetype) return;
    if (extendedSettings.search.filetypes.includes(filetype)) {
      toast.error('このファイル形式は既に登録されています');
      return;
    }
    updateSearch({
      filetypes: [...extendedSettings.search.filetypes, filetype],
    });
    setNewFiletype('');
    toast.success('ファイル形式を追加しました');
  };

  const handleRemoveFiletype = (filetype: string) => {
    updateSearch({
      filetypes: extendedSettings.search.filetypes.filter(f => f !== filetype),
    });
    toast.success('ファイル形式を削除しました');
  };

  // Excluded domain handlers
  const handleAddExcludedDomain = () => {
    const domain = newExcludedDomain.trim().toLowerCase();
    if (!domain) return;
    if (extendedSettings.search.excludedDomains.includes(domain)) {
      toast.error('このドメインは既に除外リストに登録されています');
      return;
    }
    updateSearch({
      excludedDomains: [...extendedSettings.search.excludedDomains, domain],
    });
    setNewExcludedDomain('');
    toast.success('除外ドメインを追加しました');
  };

  const handleRemoveExcludedDomain = (domain: string) => {
    updateSearch({
      excludedDomains: extendedSettings.search.excludedDomains.filter(d => d !== domain),
    });
    toast.success('除外ドメインを削除しました');
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Search}
        title="検索演算子"
        description="検索クエリで使用する演算子を設定します"
      >
        <div className="space-y-4">
          <SettingsRow
            label="site: 演算子を使用"
            description="優先ドメインに対してsite:指定を併用"
          >
            <Switch
              checked={extendedSettings.search.useSiteOperator}
              onCheckedChange={(checked) => updateSearch({ useSiteOperator: checked })}
            />
          </SettingsRow>

          <SettingsRow
            label="filetype: 演算子を使用"
            description="特定のファイル形式を優先して検索"
          >
            <Switch
              checked={extendedSettings.search.useFiletypeOperator}
              onCheckedChange={(checked) => updateSearch({ useFiletypeOperator: checked })}
            />
          </SettingsRow>

          {extendedSettings.search.useFiletypeOperator && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
              <Label className="text-sm">対象ファイル形式</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="例: pdf, html, doc"
                  value={newFiletype}
                  onChange={(e) => setNewFiletype(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFiletype()}
                  className="flex-1"
                />
                <Button onClick={handleAddFiletype} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {extendedSettings.search.filetypes.map((ft) => (
                  <div
                    key={ft}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-sm"
                  >
                    <span>.{ft}</span>
                    <button
                      onClick={() => handleRemoveFiletype(ft)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Sliders}
        title="優先順位ルール"
        description="検索結果の優先順位を決定するルール"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>優先順位の基準</Label>
            <Select
              value={extendedSettings.search.priorityRule}
              onValueChange={(value: SearchSettings['priorityRule']) =>
                updateSearch({ priorityRule: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revised_date">改定日（最新版優先）</SelectItem>
                <SelectItem value="published_date">公開日順</SelectItem>
                <SelectItem value="relevance">関連度順</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>最大検索結果数: {extendedSettings.search.maxResults}</Label>
            <Slider
              value={[extendedSettings.search.maxResults]}
              onValueChange={([value]) => updateSearch({ maxResults: value })}
              min={5}
              max={50}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>再帰的参照の深さ: {extendedSettings.search.recursiveDepth}</Label>
            <Slider
              value={[extendedSettings.search.recursiveDepth]}
              onValueChange={([value]) => updateSearch({ recursiveDepth: value })}
              min={0}
              max={5}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              一次資料内の参照をどこまで辿るか（0=参照を辿らない）
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Globe}
        title="除外ドメイン"
        description="検索結果から除外するドメインを設定します"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="例: example.com"
              value={newExcludedDomain}
              onChange={(e) => setNewExcludedDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExcludedDomain()}
              className="flex-1"
            />
            <Button onClick={handleAddExcludedDomain} className="gap-2">
              <Plus className="w-4 h-4" />
              追加
            </Button>
          </div>

          {extendedSettings.search.excludedDomains.length > 0 ? (
            <div className="grid gap-2">
              {extendedSettings.search.excludedDomains.map((domain) => (
                <div
                  key={domain}
                  className="flex items-center gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5"
                >
                  <Globe className="w-4 h-4 text-destructive shrink-0" />
                  <span className="flex-1 font-mono text-sm">{domain}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExcludedDomain(domain)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              除外ドメインは設定されていません
            </p>
          )}
        </div>
      </SettingsCard>
    </div>
  );
}
