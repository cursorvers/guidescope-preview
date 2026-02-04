/**
 * SettingsOutput Tab Component
 * Output settings: language, detail level, cross-reference, format
 */

import {
  Languages,
  Scale,
  FileCode,
  FileText,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OutputSettings } from '@/lib/settings';
import { SettingsCard, SettingsRow } from './components';
import type { SettingsOutputProps } from './types';

export function SettingsOutput({
  extendedSettings,
  updateOutput,
}: SettingsOutputProps) {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Languages}
        title="言語設定"
        description="プロンプトと出力の言語設定"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>言語モード</Label>
            <Select
              value={extendedSettings.output.languageMode}
              onValueChange={(value: OutputSettings['languageMode']) =>
                updateOutput({ languageMode: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="japanese_only">日本語のみ</SelectItem>
                <SelectItem value="mixed">日英混在</SelectItem>
                <SelectItem value="english_priority">英語優先</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SettingsRow
            label="英語の専門用語を含める"
            description="SaMD、AI等の英語表記を併記"
          >
            <Switch
              checked={extendedSettings.output.includeEnglishTerms}
              onCheckedChange={(checked) => updateOutput({ includeEnglishTerms: checked })}
            />
          </SettingsRow>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Scale}
        title="詳細度"
        description="出力の詳細度を設定します"
      >
        <div className="space-y-2">
          <Label>出力の詳細度</Label>
          <Select
            value={extendedSettings.output.detailLevel}
            onValueChange={(value: OutputSettings['detailLevel']) =>
              updateOutput({ detailLevel: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concise">簡潔版（要点のみ）</SelectItem>
              <SelectItem value="standard">標準（バランス重視）</SelectItem>
              <SelectItem value="detailed">詳細版（網羅的）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={FileCode}
        title="クロスリファレンス"
        description="法令参照とe-Gov連携の設定"
      >
        <div className="space-y-4">
          <SettingsRow
            label="e-Gov法令クロスリファレンス"
            description="関連法令をe-Gov APIで取得"
          >
            <Switch
              checked={extendedSettings.output.eGovCrossReference}
              onCheckedChange={(checked) => updateOutput({ eGovCrossReference: checked })}
            />
          </SettingsRow>

          {extendedSettings.output.eGovCrossReference && (
            <SettingsRow
              label="法令条文の抜粋を含める"
              description="関連条文の短い引用を出力に含める"
            >
              <Switch
                checked={extendedSettings.output.includeLawExcerpts}
                onCheckedChange={(checked) => updateOutput({ includeLawExcerpts: checked })}
              />
            </SettingsRow>
          )}

          <SettingsRow
            label="検索ログを含める"
            description="使用した検索語と参照ドメインを出力"
          >
            <Switch
              checked={extendedSettings.output.includeSearchLog}
              onCheckedChange={(checked) => updateOutput({ includeSearchLog: checked })}
            />
          </SettingsRow>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={FileText}
        title="出力形式"
        description="プロンプト出力の形式を設定"
      >
        <div className="space-y-2">
          <Label>出力形式</Label>
          <Select
            value={extendedSettings.output.outputFormat}
            onValueChange={(value: OutputSettings['outputFormat']) =>
              updateOutput({ outputFormat: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="plain_text">プレーンテキスト</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingsCard>
    </div>
  );
}
