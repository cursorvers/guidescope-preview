/**
 * Medical AI Prompt Builder - Extended Settings Page
 * Design: Medical Precision 2.0
 *
 * Features:
 * 1. プロンプトテンプレートのカスタマイズ
 *    - Role定義文の編集
 *    - 注意事項・免責事項の文言変更
 *    - 出力フォーマットのカスタマイズ
 * 2. 検索設定の詳細調整
 *    - 検索演算子のON/OFF
 *    - 検索結果の優先順位ルール
 *    - 除外ドメインの設定
 * 3. 出力設定
 *    - プロンプトの言語設定
 *    - 出力の詳細度
 *    - 法令クロスリファレンスのON/OFF
 * 4. UI/UX設定
 *    - ダークモード切り替え
 *    - フォントサイズ調整
 *    - デフォルトで開くタブの設定
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Layers,
  FileText,
  Database,
  Search,
  Palette,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TAB_PRESETS,
  type TabPreset,
} from '@/lib/presets';
import {
  type ExtendedSettings,
  type TemplateSettings,
  type SearchSettings,
  type OutputSettings,
  type UISettings,
  loadExtendedSettings,
  saveExtendedSettings,
} from '@/lib/settings';
import {
  SettingsTemplate,
  SettingsSearch,
  SettingsOutput,
  SettingsUI,
  SettingsPresets,
  SettingsData,
} from './settings-tabs';

// Storage keys for custom settings
const CUSTOM_PRESETS_KEY = 'medai_custom_presets_v1';
const CUSTOM_DOMAINS_KEY = 'medai_custom_domains_v1';
const CUSTOM_SCOPES_KEY = 'medai_custom_scopes_v1';
const CUSTOM_AUDIENCES_KEY = 'medai_custom_audiences_v1';

// Load custom data from localStorage
function loadCustomData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
  }
  return defaultValue;
}

// Save custom data to localStorage
function saveCustomData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

// ============================================================================
// Main Settings Component
// ============================================================================

export default function Settings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('template');

  // Extended settings state
  const [extendedSettings, setExtendedSettings] = useState<ExtendedSettings>(() =>
    loadExtendedSettings()
  );

  // Custom data states
  const [customPresets, setCustomPresets] = useState<TabPreset[]>(() =>
    loadCustomData(CUSTOM_PRESETS_KEY, [])
  );
  const [customDomains, setCustomDomains] = useState<string[]>(() =>
    loadCustomData(CUSTOM_DOMAINS_KEY, [])
  );
  const [customScopes, setCustomScopes] = useState<string[]>(() =>
    loadCustomData(CUSTOM_SCOPES_KEY, [])
  );
  const [customAudiences, setCustomAudiences] = useState<string[]>(() =>
    loadCustomData(CUSTOM_AUDIENCES_KEY, [])
  );

  // Save extended settings when changed
  useEffect(() => {
    saveExtendedSettings(extendedSettings);
  }, [extendedSettings]);

  // Save custom data when changed
  useEffect(() => {
    saveCustomData(CUSTOM_PRESETS_KEY, customPresets);
  }, [customPresets]);

  useEffect(() => {
    saveCustomData(CUSTOM_DOMAINS_KEY, customDomains);
  }, [customDomains]);

  useEffect(() => {
    saveCustomData(CUSTOM_SCOPES_KEY, customScopes);
  }, [customScopes]);

  useEffect(() => {
    saveCustomData(CUSTOM_AUDIENCES_KEY, customAudiences);
  }, [customAudiences]);

  // Apply theme immediately
  useEffect(() => {
    const root = document.documentElement;
    const theme = extendedSettings.ui.theme;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [extendedSettings.ui.theme]);

  // All presets (built-in + custom)
  const allPresets = [...TAB_PRESETS, ...customPresets];

  // Update helpers
  const updateTemplate = (updates: Partial<TemplateSettings>) => {
    setExtendedSettings(prev => ({
      ...prev,
      template: { ...prev.template, ...updates },
    }));
  };

  const updateSearch = (updates: Partial<SearchSettings>) => {
    setExtendedSettings(prev => ({
      ...prev,
      search: { ...prev.search, ...updates },
    }));
  };

  const updateOutput = (updates: Partial<OutputSettings>) => {
    setExtendedSettings(prev => ({
      ...prev,
      output: { ...prev.output, ...updates },
    }));
  };

  const updateUI = (updates: Partial<UISettings>) => {
    setExtendedSettings(prev => ({
      ...prev,
      ui: { ...prev.ui, ...updates },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center gap-4 h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">設定</h1>
              <p className="text-xs text-muted-foreground">
                テンプレート・検索・出力・UIの詳細設定
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 gap-1">
            <TabsTrigger value="template" className="gap-2 py-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">テンプレート</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2 py-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">検索</span>
            </TabsTrigger>
            <TabsTrigger value="output" className="gap-2 py-2">
              <FileCode className="w-4 h-4" />
              <span className="hidden sm:inline">出力</span>
            </TabsTrigger>
            <TabsTrigger value="ui" className="gap-2 py-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">UI/UX</span>
            </TabsTrigger>
            <TabsTrigger value="presets" className="gap-2 py-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">プリセット</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2 py-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">データ</span>
            </TabsTrigger>
          </TabsList>

          {/* Template Settings Tab */}
          <TabsContent value="template">
            <SettingsTemplate
              extendedSettings={extendedSettings}
              updateTemplate={updateTemplate}
            />
          </TabsContent>

          {/* Search Settings Tab */}
          <TabsContent value="search">
            <SettingsSearch
              extendedSettings={extendedSettings}
              updateSearch={updateSearch}
            />
          </TabsContent>

          {/* Output Settings Tab */}
          <TabsContent value="output">
            <SettingsOutput
              extendedSettings={extendedSettings}
              updateOutput={updateOutput}
            />
          </TabsContent>

          {/* UI/UX Settings Tab */}
          <TabsContent value="ui">
            <SettingsUI
              extendedSettings={extendedSettings}
              updateUI={updateUI}
              allPresets={allPresets}
            />
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets">
            <SettingsPresets
              customPresets={customPresets}
              setCustomPresets={setCustomPresets}
              customDomains={customDomains}
              setCustomDomains={setCustomDomains}
              customScopes={customScopes}
              setCustomScopes={setCustomScopes}
              customAudiences={customAudiences}
              setCustomAudiences={setCustomAudiences}
            />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <SettingsData
              extendedSettings={extendedSettings}
              customPresets={customPresets}
              customDomains={customDomains}
              customScopes={customScopes}
              customAudiences={customAudiences}
              setExtendedSettings={setExtendedSettings}
              setCustomPresets={setCustomPresets}
              setCustomDomains={setCustomDomains}
              setCustomScopes={setCustomScopes}
              setCustomAudiences={setCustomAudiences}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
