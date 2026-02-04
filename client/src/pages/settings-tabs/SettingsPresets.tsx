/**
 * SettingsPresets Tab Component
 * Presets management: purpose presets, priority domains, scope/audience options
 */

import {
  PresetManager,
  DomainManager,
  OptionTagsManager,
} from './components';
import type { SettingsPresetsProps } from './types';

export function SettingsPresets({
  customPresets,
  setCustomPresets,
  customDomains,
  setCustomDomains,
  customScopes,
  setCustomScopes,
  customAudiences,
  setCustomAudiences,
}: SettingsPresetsProps) {
  return (
    <div className="space-y-6">
      <PresetManager
        customPresets={customPresets}
        setCustomPresets={setCustomPresets}
      />

      <DomainManager
        customDomains={customDomains}
        setCustomDomains={setCustomDomains}
      />

      <OptionTagsManager
        customScopes={customScopes}
        setCustomScopes={setCustomScopes}
        customAudiences={customAudiences}
        setCustomAudiences={setCustomAudiences}
      />
    </div>
  );
}
