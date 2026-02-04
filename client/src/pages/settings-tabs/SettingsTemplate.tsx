/**
 * SettingsTemplate Tab Component
 * Template settings: Role definition, disclaimers, output format, custom instructions
 */

import {
  BookOpen,
  Shield,
  Layout,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  DISCLAIMER_LINES,
} from '@/lib/presets';
import {
  DEFAULT_ROLE_TITLE,
  DEFAULT_ROLE_DESCRIPTION,
  DEFAULT_OUTPUT_SECTIONS,
} from '@/lib/settings';
import { SettingsCard } from './components';
import type { SettingsTemplateProps } from './types';

export function SettingsTemplate({
  extendedSettings,
  updateTemplate,
}: SettingsTemplateProps) {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={BookOpen}
        title="Role定義"
        description="AIの役割と動作を定義するテキストを編集します"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Role タイトル</Label>
            <Input
              value={extendedSettings.template.roleTitle}
              onChange={(e) => updateTemplate({ roleTitle: e.target.value })}
              placeholder="例: 国内ガイドライン・ダイレクト・リトリーバー"
            />
          </div>
          <div className="space-y-2">
            <Label>Role 説明文</Label>
            <Textarea
              value={extendedSettings.template.roleDescription}
              onChange={(e) => updateTemplate({ roleDescription: e.target.value })}
              rows={5}
              className="font-mono text-sm"
              placeholder="AIの役割と制約を記述..."
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateTemplate({
              roleTitle: DEFAULT_ROLE_TITLE,
              roleDescription: DEFAULT_ROLE_DESCRIPTION,
            })}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            デフォルトに戻す
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Shield}
        title="免責事項・注意事項"
        description="プロンプトに含める免責事項を編集します"
      >
        <div className="space-y-4">
          <Textarea
            value={extendedSettings.template.disclaimers.join('\n')}
            onChange={(e) => updateTemplate({
              disclaimers: e.target.value.split('\n').filter(Boolean),
            })}
            rows={4}
            className="font-mono text-sm"
            placeholder="免責事項を1行ずつ入力..."
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateTemplate({ disclaimers: [...DISCLAIMER_LINES] })}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            デフォルトに戻す
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Layout}
        title="出力フォーマット"
        description="出力セクションの表示/非表示と順序を設定します"
      >
        <div className="space-y-2">
          {extendedSettings.template.outputSections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  section.enabled ? 'bg-primary/5 border-primary/30' : 'bg-muted/30 border-border'
                )}
              >
                <Switch
                  checked={section.enabled}
                  onCheckedChange={(checked) => {
                    updateTemplate({
                      outputSections: extendedSettings.template.outputSections.map(s =>
                        s.id === section.id ? { ...s, enabled: checked } : s
                      ),
                    });
                  }}
                />
                <span className={cn(
                  'flex-1 text-sm',
                  !section.enabled && 'text-muted-foreground'
                )}>
                  {section.name}
                </span>
              </div>
            ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateTemplate({ outputSections: [...DEFAULT_OUTPUT_SECTIONS] })}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          デフォルトに戻す
        </Button>
      </SettingsCard>

      <SettingsCard
        icon={Sparkles}
        title="カスタム指示"
        description="プロンプトに追加するカスタム指示を入力します"
      >
        <Textarea
          value={extendedSettings.template.customInstructions}
          onChange={(e) => updateTemplate({ customInstructions: e.target.value })}
          rows={4}
          className="font-mono text-sm"
          placeholder="追加の指示やルールを入力..."
        />
      </SettingsCard>
    </div>
  );
}
