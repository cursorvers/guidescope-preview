/**
 * Lite版の技術的制限設定
 *
 * 目的: 医療誤用を防ぐための実装レベルでの制約
 * 根拠: 設計レビュー（2026-02-04）における必須条件
 */

export interface WatermarkConfig {
  text: string;
  color: string;
  position: 'fixed-top' | 'fixed-bottom' | 'inline';
  fontSize: string;
  zIndex: number;
}

export interface DisclaimerConfig {
  frequency: 'every-page' | 'once-per-session' | 'on-output';
  dismissible: boolean;
  text: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface OutputRestrictionsConfig {
  hideDetailedReferences: boolean;
  hideRegulatoryMappings: boolean;
  copyableSections: string[];
  maxCopiesPerSession?: number;
}

export interface LiteModeConfig {
  watermark: WatermarkConfig;
  disclaimer: DisclaimerConfig;
  outputRestrictions: OutputRestrictionsConfig;
}

/**
 * Lite版のデフォルト設定
 */
export const LITE_MODE_CONFIG: LiteModeConfig = {
  watermark: {
    text: '学習・探索用途のみ | 医療判断には使用禁止',
    color: 'rgba(239, 68, 68, 0.15)', // red-500 with 15% opacity
    position: 'fixed-top',
    fontSize: '0.75rem', // text-xs
    zIndex: 9999,
  },
  disclaimer: {
    frequency: 'every-page',
    dismissible: false,
    text: `
⚠️ 本ツールは学習・探索支援のみを目的としています。
医療判断・診断・治療・法的助言には使用できません。
個別のケースについては医師、弁護士、薬事専門家等の
有資格者にご相談ください。
    `.trim(),
    severity: 'critical',
  },
  outputRestrictions: {
    // 詳細参照の非表示（Full版のみ）
    hideDetailedReferences: true,
    // 法令クロスリファレンスの非表示（Full版のみ）
    hideRegulatoryMappings: true,
    // コピー可能セクションの制限
    copyableSections: ['prompt', 'basic-queries'],
    // セッションあたりの最大コピー回数（任意）
    maxCopiesPerSession: undefined, // 無制限（将来的に制限可能）
  },
};

/**
 * セッションごとのコピー回数を追跡
 */
class CopyTracker {
  private copies: Map<string, number> = new Map();

  track(section: string): boolean {
    const maxCopies = LITE_MODE_CONFIG.outputRestrictions.maxCopiesPerSession;
    if (maxCopies === undefined) return true;

    const current = this.copies.get(section) || 0;
    if (current >= maxCopies) return false;

    this.copies.set(section, current + 1);
    return true;
  }

  reset() {
    this.copies.clear();
  }

  getCount(section: string): number {
    return this.copies.get(section) || 0;
  }
}

export const copyTracker = new CopyTracker();

/**
 * コピー可能かどうかをチェック
 */
export function canCopy(section: string): boolean {
  const { copyableSections } = LITE_MODE_CONFIG.outputRestrictions;

  // セクションが許可リストに含まれているかチェック
  if (!copyableSections.includes(section)) {
    return false;
  }

  // セッションごとの制限チェック
  return copyTracker.track(section);
}

/**
 * 出力に透かしを追加
 */
export function addWatermark(content: string): string {
  const { watermark } = LITE_MODE_CONFIG;
  return `${watermark.text}\n\n${content}\n\n${watermark.text}`;
}

/**
 * Lite版で非表示にすべきセクションかどうか
 */
export function shouldHideSection(sectionType: string): boolean {
  const { hideDetailedReferences, hideRegulatoryMappings } =
    LITE_MODE_CONFIG.outputRestrictions;

  if (sectionType === 'detailed-references') return hideDetailedReferences;
  if (sectionType === 'regulatory-mappings') return hideRegulatoryMappings;

  return false;
}
