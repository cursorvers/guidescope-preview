/**
 * Watermark Component
 *
 * Lite版専用の透かし表示
 * 医療誤用を防ぐための視覚的制約
 */

import { useMinimalMode } from '@/contexts/MinimalModeContext';
import { LITE_MODE_CONFIG } from '@/lib/lite-restrictions';

export function Watermark() {
  const { isMinimalMode } = useMinimalMode();

  if (!isMinimalMode) return null;

  const { watermark } = LITE_MODE_CONFIG;

  return (
    <div
      className="pointer-events-none select-none"
      style={{
        position: 'fixed',
        top: watermark.position === 'fixed-top' ? 0 : undefined,
        bottom: watermark.position === 'fixed-bottom' ? 0 : undefined,
        left: 0,
        right: 0,
        zIndex: watermark.zIndex,
        backgroundColor: watermark.color,
        textAlign: 'center',
        padding: '0.5rem',
        fontSize: watermark.fontSize,
        fontWeight: 600,
        color: 'rgb(239, 68, 68)', // text-red-500
      }}
    >
      {watermark.text}
    </div>
  );
}
