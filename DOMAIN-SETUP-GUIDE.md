# 自社ドメイン入口URL設定ガイド

## 目的
X投稿で使用するURL `cursorvers.com/guidescope` を固定化し、将来の移行（GitHub Pages → Vercel等）でもURLを変えずに済むようにする。

## 実装方法（2つのオプション）

### Option A: Vercel リダイレクト（推奨）

**前提条件:**
- Vercel アカウントがあること
- `cursorvers.com` ドメインが Vercel に追加済みであること

**手順:**

1. **`vercel.json` の作成**

プロジェクトルートに `vercel.json` を作成し、以下を記述：

```json
{
  "redirects": [
    {
      "source": "/guidescope",
      "destination": "https://cursorvers.github.io/guidescope-preview/",
      "permanent": false
    }
  ]
}
```

`permanent: false` = 302リダイレクト（一時的）
将来の移行時に柔軟に対応可能。

2. **デプロイ**

```bash
cd /path/to/cursorvers-landing-page
vercel deploy --prod
```

3. **動作確認**

```bash
curl -I https://cursorvers.com/guidescope
# Location: https://cursorvers.github.io/guidescope-preview/ を確認
```

---

### Option B: Cloudflare Workers（代替案）

**前提条件:**
- Cloudflare アカウントがあること
- `cursorvers.com` が Cloudflare DNS で管理されていること

**手順:**

1. **Worker スクリプトの作成**

```javascript
// guidescope-redirector.js
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/guidescope') {
      // UTMパラメータを保持してリダイレクト
      const targetUrl = new URL('https://cursorvers.github.io/guidescope-preview/');
      url.searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
      });

      return Response.redirect(targetUrl.toString(), 302);
    }

    // その他のパスは通常通り
    return fetch(request);
  }
}
```

2. **Worker のデプロイ**

```bash
npx wrangler deploy guidescope-redirector.js
```

3. **Route の設定**

Cloudflare Dashboard → Workers & Pages → Routes:
- Route: `cursorvers.com/guidescope*`
- Worker: `guidescope-redirector`

---

## UTMパラメータ対応

上記の設定により、以下のようなUTM付きURLが自動的にリダイレクト先に転送されます：

```
https://cursorvers.com/guidescope?utm_source=x&utm_campaign=guidescope_lite
↓
https://cursorvers.github.io/guidescope-preview/?utm_source=x&utm_campaign=guidescope_lite
```

---

## 将来の移行時

例: GitHub Pages → Vercel に移行する場合

**Option A（Vercel）:**
`vercel.json` の `destination` を更新：

```json
{
  "redirects": [
    {
      "source": "/guidescope",
      "destination": "https://guidescope-prod.vercel.app/",
      "permanent": false
    }
  ]
}
```

**Option B（Cloudflare Workers）:**
Worker スクリプトの `targetUrl` を更新：

```javascript
const targetUrl = new URL('https://guidescope-prod.vercel.app/');
```

---

## テスト方法

### 1. リダイレクト動作確認

```bash
curl -I https://cursorvers.com/guidescope
```

期待される出力：
```
HTTP/2 302
location: https://cursorvers.github.io/guidescope-preview/
```

### 2. UTMパラメータ確認

```bash
curl -I "https://cursorvers.com/guidescope?utm_source=x&utm_campaign=guidescope_lite"
```

期待される出力：
```
HTTP/2 302
location: https://cursorvers.github.io/guidescope-preview/?utm_source=x&utm_campaign=guidescope_lite
```

### 3. ブラウザでの確認

1. ブラウザで `https://cursorvers.com/guidescope` を開く
2. GitHub Pages にリダイレクトされることを確認
3. URL バーに正しいUTMパラメータが保持されていることを確認

---

## セキュリティ注意事項

- **永続的リダイレクト（301）は使わない**: 将来の移行時に柔軟性を保つため
- **HTTPS 必須**: HTTP → HTTPS の強制リダイレクトを設定
- **CORS 設定**: 必要に応じて Cloudflare Worker で CORS ヘッダーを追加

---

## トラブルシューティング

### 問題: リダイレクトが動作しない

**確認項目:**
1. Vercel/Cloudflare の設定が正しくデプロイされているか
2. DNS レコードが正しいか（A/CNAME）
3. キャッシュをクリアして再テスト

### 問題: UTMパラメータが消える

**解決策:**
- Vercel: `vercel.json` に `has` フィールドでクエリパラメータを保持
- Cloudflare Workers: スクリプトで明示的に `searchParams` を転送

---

## 次のステップ

1. このガイドに従ってリダイレクトを設定
2. X投稿テンプレート（`X-POSTING-TEMPLATE.md`）を使って投稿
3. GA4で `utm_source=x` のトラフィックを追跡

---

作成日時: 2026-02-04
担当: インフラ/DevOps
