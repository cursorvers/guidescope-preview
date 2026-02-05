# Full版導線設置ガイド

## 実装オプション

### Option 1: Cursorvers LP に問い合わせフォーム追加（推奨）

**メリット:**
- 既存の信頼基盤を活用
- LP（信頼・免責・契約）の一貫性
- GA4トラッキングが容易

**実装内容:**

1. **LP に新規ページ作成:** `cursorvers.com/guidescope/contact`
2. **フォーム項目:**
   - 組織名（必須）
   - 担当者名（必須）
   - メールアドレス（必須）
   - 電話番号（任意）
   - 利用目的（選択式＋自由記述）
     - [ ] 医療機器開発
     - [ ] 臨床運用
     - [ ] 研究倫理審査
     - [ ] その他（自由記述）
   - 想定利用人数（必須）
   - 問い合わせ内容（自由記述）

3. **送信先:**
   - Email: info@cursorvers.com
   - Slack通知: `#guidescope-leads`（任意）
   - Google Form/Typeform 連携（任意）

4. **自動返信:**
   - 件名: 【GuideScope Full版】お問い合わせありがとうございます
   - 本文:
     ```
     この度はGuideScope Full版にご興味をお持ちいただき、
     ありがとうございます。

     担当者より2営業日以内にご連絡させていただきます。
     なお、Full版のご利用には用途確認と契約手続きが
     必要となります。詳細は追ってご案内いたします。

     ご不明点がございましたら、本メールにご返信ください。

     株式会社Cursorvers
     ```

---

### Option 2: アプリ内に「Full版ベータ希望」ボタン追加

**メリット:**
- ユーザー体験が直線的
- Lite → Full の導線が明確

**実装箇所:**

1. **ヘッダー右上に固定ボタン**

```tsx
// client/src/pages/Home.tsx
<Button
  variant="default"
  size="sm"
  className="bg-primary text-primary-foreground hover:bg-primary/90"
  onClick={handleFullVersionInquiry}
>
  <Sparkles className="w-4 h-4 mr-1" />
  Full版（契約者向け）
</Button>
```

2. **クリック時の動作**

```tsx
const handleFullVersionInquiry = () => {
  // Option 2A: 外部フォームへ遷移
  window.open('https://cursorvers.com/guidescope/contact', '_blank');

  // Option 2B: モーダルダイアログ表示
  setShowFullVersionModal(true);

  // GA4トラッキング
  trackEvent('full_version_inquiry_clicked', {
    source: 'lite_app_header',
  });
};
```

3. **モーダル内容（Option 2B の場合）**

```tsx
<Dialog open={showFullVersionModal} onOpenChange={setShowFullVersionModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Full版（契約者向け）について</DialogTitle>
      <DialogDescription>
        組織での本格的な運用に対応した機能を提供しています。
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <h4 className="font-medium">Full版の主な機能</h4>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
        <li>JSON形式でのAPI連携用出力</li>
        <li>プロンプトテンプレートの保存・共有</li>
        <li>利用状況の監査ログ記録</li>
        <li>セキュリティ要件に応じた対応</li>
        <li>専任サポートによる導入支援</li>
      </ul>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Full版のご利用には用途確認と契約手続きが必要です。
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={() => {
            window.open('https://cursorvers.com/guidescope/contact', '_blank');
            setShowFullVersionModal(false);
          }}
        >
          問い合わせフォームへ
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowFullVersionModal(false)}
        >
          閉じる
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

---

## 実装推奨度

| Option | 推奨度 | 理由 |
|--------|--------|------|
| Option 1 | ⭐⭐⭐⭐⭐ | 信頼性・一貫性・管理しやすさ |
| Option 2A | ⭐⭐⭐⭐ | UX優先、Option 1 へ誘導 |
| Option 2B | ⭐⭐⭐ | リッチだがメンテナンス負荷高 |

---

## 実装ステップ（Option 1 + Option 2A）

### Phase 1: LP に問い合わせフォーム追加（1週間）

1. **ページ作成:** `cursorvers.com/guidescope/contact`
2. **フォーム実装:** Google Forms or Typeform 埋め込み
3. **自動返信設定:** Zapier / Make.com で連携
4. **GA4イベント設定:** `full_version_inquiry_submit`

### Phase 2: アプリ内にボタン追加（1週間）

1. **ヘッダーにボタン追加**
2. **クリック時に LP へ遷移**
3. **GA4イベント設定:** `full_version_inquiry_clicked`

### Phase 3: X投稿で導線テスト（2週間）

1. **X投稿テンプレート実行**
2. **問い合わせ数計測**
3. **用途確認フロー改善**

---

## トラッキング設定（GA4）

### イベント定義

| イベント名 | トリガー | パラメータ |
|-----------|---------|-----------|
| `full_version_inquiry_clicked` | Full版ボタンクリック | `source: 'lite_app_header'` |
| `full_version_inquiry_submit` | フォーム送信完了 | `organization_type`, `use_case` |
| `full_version_modal_opened` | モーダル表示（Option 2B） | `source: 'lite_app_header'` |

### 実装例

```typescript
// client/src/lib/analytics.ts
export function trackFullVersionInquiry(action: 'clicked' | 'submitted' | 'modal_opened', params?: Record<string, string>) {
  trackEvent(`full_version_inquiry_${action}`, {
    ...params,
    timestamp: new Date().toISOString(),
  });
}
```

---

## フォロwアップフロー

### 問い合わせ受領後

1. **2営業日以内に初回連絡**
   - 用途確認
   - 想定利用規模のヒアリング
   - デモ/トライアルの提案

2. **用途審査**
   - 医療機関/開発企業向けか確認
   - 悪用リスクの評価
   - 契約条件の提示

3. **契約手続き**
   - NDA締結
   - 利用規約の同意
   - 初期設定・オンボーディング

---

## 次のステップ

1. Cursorvers LP に問い合わせフォームを追加（Option 1）
2. guidescope-preview アプリにボタンを追加（Option 2A）
3. GA4イベント設定
4. X投稿テンプレートで導線テスト

---

作成日時: 2026-02-04
担当: マーケティング/フロントエンド
