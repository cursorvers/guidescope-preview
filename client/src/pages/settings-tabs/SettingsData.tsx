/**
 * SettingsData Tab Component
 * Data management: export, import, reset
 */

import { useState } from 'react';
import {
  Download,
  Upload,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { TEMPLATE_BASE_DATE } from '@/lib/presets';
import { createDefaultExtendedSettings } from '@/lib/settings';
import { SettingsCard } from './components';
import type { SettingsDataProps } from './types';

export function SettingsData({
  extendedSettings,
  customPresets,
  customDomains,
  customScopes,
  customAudiences,
  setExtendedSettings,
  setCustomPresets,
  setCustomDomains,
  setCustomScopes,
  setCustomAudiences,
}: SettingsDataProps) {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Export all settings
  const handleExportSettings = () => {
    const exportData = {
      version: 2,
      exportDate: new Date().toISOString(),
      extendedSettings,
      customPresets,
      customDomains,
      customScopes,
      customAudiences,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medai-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('設定をエクスポートしました');
  };

  // Import settings
  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (data.version === 2 && data.extendedSettings) {
          setExtendedSettings(data.extendedSettings);
        }
        if (data.customPresets) {
          setCustomPresets(data.customPresets);
        }
        if (data.customDomains) {
          setCustomDomains(data.customDomains);
        }
        if (data.customScopes) {
          setCustomScopes(data.customScopes);
        }
        if (data.customAudiences) {
          setCustomAudiences(data.customAudiences);
        }

        toast.success('設定をインポートしました');
      } catch (error) {
        toast.error('設定ファイルの読み込みに失敗しました');
      }
    };
    input.click();
  };

  // Reset all settings
  const handleResetAll = () => {
    setExtendedSettings(createDefaultExtendedSettings());
    setCustomPresets([]);
    setCustomDomains([]);
    setCustomScopes([]);
    setCustomAudiences([]);
    setResetConfirmOpen(false);
    toast.success('すべての設定をリセットしました');
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsCard
            icon={Download}
            title="エクスポート"
            description="すべての設定をJSONファイルに保存"
          >
            <Button onClick={handleExportSettings} className="w-full gap-2">
              <Download className="w-4 h-4" />
              設定をエクスポート
            </Button>
          </SettingsCard>

          <SettingsCard
            icon={Upload}
            title="インポート"
            description="JSONファイルから設定を復元"
          >
            <Button onClick={handleImportSettings} variant="outline" className="w-full gap-2">
              <Upload className="w-4 h-4" />
              設定をインポート
            </Button>
          </SettingsCard>
        </div>

        <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive">すべての設定をリセット</h3>
              <p className="text-sm text-muted-foreground">
                カスタムプリセット、ドメイン、テンプレート設定、UI設定をすべて削除し、デフォルト状態に戻します。この操作は取り消せません。
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setResetConfirmOpen(true)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            すべてリセット
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground space-y-1">
          <p><strong>テンプレート基準日:</strong> {TEMPLATE_BASE_DATE}</p>
          <p><strong>設定バージョン:</strong> {extendedSettings.version}</p>
          <p><strong>最終更新:</strong> {new Date(extendedSettings.lastUpdated).toLocaleString('ja-JP')}</p>
          <p className="mt-2">
            カスタムプリセット: {customPresets.length}件 /
            カスタムドメイン: {customDomains.length}件 /
            カスタム範囲: {customScopes.length}件 /
            カスタム対象者: {customAudiences.length}件 /
            除外ドメイン: {extendedSettings.search.excludedDomains.length}件
          </p>
        </div>
      </div>

      {/* Reset Confirm Dialog */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>すべての設定をリセットしますか？</AlertDialogTitle>
            <AlertDialogDescription>
              カスタムプリセット、ドメイン、テンプレート設定、UI設定がすべて削除され、デフォルト状態に戻ります。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              リセット
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
