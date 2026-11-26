# 租屋通（前端）

[租屋通](https://rental.imallenlai.com) 協助房東與房客在簽約前查詢租賃糾紛的**法院判決**，以及其他會員分享的**網友回報**，降低遇到惡房東、惡房客的風險。

後端 API：[`luckstar77/api-judicial-cases`](https://github.com/luckstar77/api-judicial-cases)（契約見該 repo 的 `docs/api-v1.md`）。

## 技術架構

| 類別     | 使用套件                                           |
| -------- | -------------------------------------------------- |
| 建置     | Vite 6、TypeScript 5（strict）                     |
| UI       | React 18、MUI v6 + `@mui/icons-material`           |
| 資料存取 | TanStack Query v5、axios                           |
| 路由     | react-router-dom v6（data router、lazy routes）    |
| 表單     | react-hook-form + zod                              |
| 登入     | Firebase v11（僅手機簡訊驗證）                     |
| 地圖     | react-simple-maps（TopoJSON）                      |
| SEO      | react-helmet-async                                 |
| 測試     | Vitest + Testing Library + MSW v2、Playwright      |
| 程式品質 | ESLint（typescript-eslint、react-hooks）+ Prettier |

Node 版本：20（見 `.nvmrc`），套件管理：npm。

## 專案結構

```text
src/
├── app/            # 應用程式外殼：路由、Provider、主題、版面（TopBar / BottomNav / Footer）
├── features/       # 依功能切分，各自包含 api / hooks / components / 頁面
│   ├── auth/       # 登入、註冊、簡訊驗證、RequireAuth
│   ├── cases/      # 網友回報：列表、詳情、發文
│   ├── engagement/ # 按讚與留言（判決、回報共用）
│   ├── home/       # 首頁區塊與站台統計
│   ├── judgments/  # 判決查詢、判決詳情、高風險名單與地圖
│   └── profile/    # 會員資料
├── pages/          # 不屬於單一功能的頁面（首頁、FAQ、關於我們、404）
├── shared/         # 跨功能共用：API client、常數、元件、hooks、工具函式
├── mocks/          # MSW handlers 與模擬資料（依 API 契約實作）
├── asset/          # 臺灣縣市 TopoJSON
└── test/           # Vitest setup 與 render helper
e2e/                # Playwright smoke tests
public/             # 靜態資源（icon、manifest、OG 圖、MSW worker）
```

命名規則：元件檔案使用 `PascalCase.tsx`，其餘檔案使用 `kebab-case.ts`。

## 常用指令

| 指令                | 說明                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | 啟動開發伺服器（http://localhost:3011），串接 `.env.development` 的 API |
| `npm run dev:mock`  | 以 mock 模式啟動，所有 API 由 MSW 模擬，不需要後端                      |
| `npm run build`     | 型別檢查並建置到 `dist/`                                                |
| `npm run preview`   | 預覽建置結果                                                            |
| `npm run lint`      | ESLint（不允許任何 warning）                                            |
| `npm run typecheck` | TypeScript 型別檢查                                                     |
| `npm run format`    | Prettier 格式化                                                         |
| `npm test`          | Vitest 單元與元件測試                                                   |
| `npm run test:e2e`  | Playwright smoke tests（自動以 mock 模式啟動 dev server）               |

第一次執行 e2e 前請先安裝瀏覽器：`npx playwright install chromium`。

## 環境變數

| 變數                                | 說明                              | 設定位置                                           |
| ----------------------------------- | --------------------------------- | -------------------------------------------------- |
| `VITE_API_BASE_URL`                 | API 位址（含 `/v1`）              | `.env.development`、`.env.production`、`.env.mock` |
| `VITE_API_MOCK`                     | `true` 時啟用 MSW 模擬 API        | `.env.mock`                                        |
| `VITE_FIREBASE_API_KEY`             | Firebase 設定                     | `.env.local`（不進版控）                           |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase 設定                     | `.env.local`                                       |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase 設定                     | `.env.local`                                       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase 設定                     | `.env.local`                                       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase 設定                     | `.env.local`                                       |
| `VITE_FIREBASE_APP_ID`              | Firebase 設定                     | `.env.local`                                       |
| `VITE_MEASUREMENT_ID`               | Firebase Analytics measurement ID | `.env.local`                                       |

Firebase 相關變數請放在 `.env.local`（已列入 `.gitignore`），**不要提交到版控**。Google Analytics 只會在正式環境且非 mock 模式下載入。

## Mock 模式

`npm run dev:mock` 會在瀏覽器啟動 MSW，依照 API 契約回應所有端點（`{ status, code, data }` 格式、分頁、錯誤碼、個資遮罩）。資料存在記憶體中，重新整理頁面即重置。

- 示範帳號：手機 `0912345678`、密碼 `password123`
- 簡訊驗證：任意手機號碼皆可，驗證碼固定為 `123456`（不會呼叫 Firebase）
- 可搜尋的判決姓名範例：`王大明`、`林美玲`、`劉文雄`

## 部署

部署由 CI 將 `dist/` 上傳至 S3，並透過 CloudFront 提供服務（本 repo 的 `.github/workflows/ci.yml` 只做檢查與建置，不含部署 job）。

- `index.html`：設定 `Cache-Control: no-cache`，確保使用者每次都拿到最新版本的入口。
- `assets/` 底下帶 hash 的 JS / CSS：設定 `Cache-Control: public, max-age=31536000, immutable`。
- SPA 路由：CloudFront 需將 403 / 404 導回 `/index.html`（回應 200）。
- `public/mockServiceWorker.js` 會一併輸出，但只在 mock 模式註冊，正式環境不會啟用。

## 其他說明

- JWT 存在 `localStorage` 的 `token` key，與舊版相容。
- 舊網址 `/upload` 會自動導向 `/cases/new`。
- `src/asset/taiwan-counties.topo.json` 由舊版的 `taiwanCountry.json`（GeoJSON，約 9 MB）以 mapshaper 簡化轉為 TopoJSON（約 67 KB）：

  ```sh
  npx mapshaper@0.6 taiwanCountry.json -filter-fields NAME_2014 -rename-fields name=NAME_2014 \
    -rename-layers counties -simplify 4% keep-shapes -o format=topojson quantization=10000 taiwan-counties.topo.json
  ```
