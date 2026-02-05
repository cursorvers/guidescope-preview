/**
 * Lite Disclaimer Component
 *
 * Lite版専用の強化された免責事項
 * 医療誤用を防ぐための明示的な警告
 */

import { AlertTriangle } from 'lucide-react';
import { useMinimalMode } from '@/contexts/MinimalModeContext';
import { LITE_MODE_CONFIG } from '@/lib/lite-restrictions';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LiteDisclaimer() {
  const { isMinimalMode } = useMinimalMode();

  if (!isMinimalMode) return null;

  const { disclaimer } = LITE_MODE_CONFIG;

  return (
    <Alert
      variant="destructive"
      className="border-2 border-red-500 bg-red-50/80 mb-4"
    >
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertDescription className="text-sm text-red-900 font-medium whitespace-pre-line">
        {disclaimer.text}
      </AlertDescription>
    </Alert>
  );
}
