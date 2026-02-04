/**
 * Settings Page - Shared Types
 */

import type {
  ExtendedSettings,
  TemplateSettings,
  SearchSettings,
  OutputSettings,
  UISettings,
} from '@/lib/settings';
import type { TabPreset } from '@/lib/presets';

/**
 * Base props for all settings tab components
 */
export interface BaseSettingsProps {
  extendedSettings: ExtendedSettings;
}

/**
 * Props for SettingsTemplate tab
 */
export interface SettingsTemplateProps extends BaseSettingsProps {
  updateTemplate: (updates: Partial<TemplateSettings>) => void;
}

/**
 * Props for SettingsSearch tab
 */
export interface SettingsSearchProps extends BaseSettingsProps {
  updateSearch: (updates: Partial<SearchSettings>) => void;
}

/**
 * Props for SettingsOutput tab
 */
export interface SettingsOutputProps extends BaseSettingsProps {
  updateOutput: (updates: Partial<OutputSettings>) => void;
}

/**
 * Props for SettingsUI tab
 */
export interface SettingsUIProps extends BaseSettingsProps {
  updateUI: (updates: Partial<UISettings>) => void;
  allPresets: TabPreset[];
}

/**
 * Props for SettingsPresets tab
 */
export interface SettingsPresetsProps {
  customPresets: TabPreset[];
  setCustomPresets: React.Dispatch<React.SetStateAction<TabPreset[]>>;
  customDomains: string[];
  setCustomDomains: React.Dispatch<React.SetStateAction<string[]>>;
  customScopes: string[];
  setCustomScopes: React.Dispatch<React.SetStateAction<string[]>>;
  customAudiences: string[];
  setCustomAudiences: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Props for SettingsData tab
 */
export interface SettingsDataProps extends BaseSettingsProps {
  customPresets: TabPreset[];
  customDomains: string[];
  customScopes: string[];
  customAudiences: string[];
  setExtendedSettings: React.Dispatch<React.SetStateAction<ExtendedSettings>>;
  setCustomPresets: React.Dispatch<React.SetStateAction<TabPreset[]>>;
  setCustomDomains: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomScopes: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomAudiences: React.Dispatch<React.SetStateAction<string[]>>;
}
