/**
 * PresetManager Component
 * Manages purpose presets with create, edit, delete functionality
 */

import { useState } from 'react';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { TAB_PRESETS, type TabPreset } from '@/lib/presets';
import { SettingsCard } from './SettingsCard';

export interface PresetManagerProps {
  customPresets: TabPreset[];
  setCustomPresets: React.Dispatch<React.SetStateAction<TabPreset[]>>;
}

export function PresetManager({
  customPresets,
  setCustomPresets,
}: PresetManagerProps) {
  // Dialog states
  const [editingPreset, setEditingPreset] = useState<TabPreset | null>(null);
  const [isNewPreset, setIsNewPreset] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);

  // Form states
  const [presetForm, setPresetForm] = useState({
    id: '',
    name: '',
    categories: '',
    keywordChips: '',
  });

  // Preset editing handlers
  const handleEditPreset = (preset: TabPreset) => {
    setEditingPreset(preset);
    setIsNewPreset(false);
    setPresetForm({
      id: preset.id,
      name: preset.name,
      categories: preset.categories.join('\n'),
      keywordChips: preset.keywordChips.join('\n'),
    });
  };

  const handleNewPreset = () => {
    setEditingPreset({
      id: `custom-${Date.now()}`,
      name: '',
      categories: [],
      keywordChips: [],
    });
    setIsNewPreset(true);
    setPresetForm({
      id: `custom-${Date.now()}`,
      name: '',
      categories: '',
      keywordChips: '',
    });
  };

  const handleSavePreset = () => {
    if (!presetForm.name.trim()) {
      toast.error('プリセット名を入力してください');
      return;
    }

    const newPreset: TabPreset = {
      id: presetForm.id,
      name: presetForm.name.trim(),
      categories: presetForm.categories.split('\n').map(s => s.trim()).filter(Boolean),
      keywordChips: presetForm.keywordChips.split('\n').map(s => s.trim()).filter(Boolean),
    };

    if (isNewPreset) {
      setCustomPresets(prev => [...prev, newPreset]);
      toast.success('プリセットを追加しました');
    } else {
      const isCustom = customPresets.some(p => p.id === presetForm.id);
      if (isCustom) {
        setCustomPresets(prev => prev.map(p => p.id === presetForm.id ? newPreset : p));
        toast.success('プリセットを更新しました');
      } else {
        const customCopy = { ...newPreset, id: `custom-${Date.now()}` };
        setCustomPresets(prev => [...prev, customCopy]);
        toast.success('カスタムプリセットとして保存しました');
      }
    }

    setEditingPreset(null);
  };

  const handleDeletePreset = (presetId: string) => {
    setPresetToDelete(presetId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePreset = () => {
    if (presetToDelete) {
      setCustomPresets(prev => prev.filter(p => p.id !== presetToDelete));
      toast.success('プリセットを削除しました');
    }
    setDeleteConfirmOpen(false);
    setPresetToDelete(null);
  };

  return (
    <>
      <SettingsCard
        icon={Layers}
        title="目的プリセット"
        description="探索目的に応じたカテゴリと検索語のプリセットを管理します"
      >
        <Button onClick={handleNewPreset} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          新規プリセット作成
        </Button>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="default">
            <AccordionTrigger className="text-sm font-medium">
              デフォルトプリセット ({TAB_PRESETS.length}件)
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {TAB_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{preset.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {preset.categories.length}カテゴリ / {preset.keywordChips.length}検索語
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPreset(preset)}
                      className="gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      複製して編集
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {customPresets.length > 0 && (
            <AccordionItem value="custom">
              <AccordionTrigger className="text-sm font-medium">
                カスタムプリセット ({customPresets.length}件)
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {customPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {preset.categories.length}カテゴリ / {preset.keywordChips.length}検索語
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPreset(preset)}
                        className="gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        編集
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePreset(preset.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </SettingsCard>

      {/* Preset Edit Dialog */}
      <Dialog open={!!editingPreset} onOpenChange={(open) => !open && setEditingPreset(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isNewPreset ? '新規プリセット作成' : 'プリセット編集'}
            </DialogTitle>
            <DialogDescription>
              カテゴリと検索語は1行に1つずつ入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">プリセット名 *</Label>
              <Input
                id="preset-name"
                value={presetForm.name}
                onChange={(e) => setPresetForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="例: カスタム医療AI探索"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-categories">カテゴリ（1行1カテゴリ）</Label>
              <Textarea
                id="preset-categories"
                value={presetForm.categories}
                onChange={(e) => setPresetForm(prev => ({ ...prev, categories: e.target.value }))}
                rows={5}
                placeholder="医療機器規制とSaMD&#10;臨床評価と性能評価&#10;品質マネジメント"
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-keywords">検索語（1行1検索語）</Label>
              <Textarea
                id="preset-keywords"
                value={presetForm.keywordChips}
                onChange={(e) => setPresetForm(prev => ({ ...prev, keywordChips: e.target.value }))}
                rows={5}
                placeholder="医療AI ガイドライン 国内&#10;SaMD 承認申請 手引き&#10;PMDA プログラム医療機器"
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPreset(null)}>
              キャンセル
            </Button>
            <Button onClick={handleSavePreset} className="gap-2">
              <Save className="w-4 h-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>プリセットを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。プリセットは完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePreset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
