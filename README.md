## 流程

-   查詢房東或房客姓名
    -   若有回傳資訊，沒有回傳空陣列
        -   原告姓名
        -   被告姓名
        -   租金
        -   地區
        -   勝訴方
        -   案件 ID
        -   年份

## 後台 API

-   取得預警資訊 <http://localhost:3010/cases?search=張淑晶>
    -   query
        -   search `string` 可搜尋房東或房客姓名

```
{
"judicialFileset": [
	{
		"id" : "CCEV,100,潮簡,260,20910811,1",
		"jyear" : "100",
		"plaintiff" : "張淑晶",
		"defendant" : "張淑晶",
		"rent" : 10000,
		"city" : "屏東",
		"win" : "plaintiff"
	}
]}


```

## 網站環境架設

-   在 AWS S3 建立公開儲存桶

    -   名稱為 rental.imallenlai.com
    -   關閉「封鎖所有公有存取權」

-   選擇已建立的儲存桶，選擇許可，編輯儲存桶政策

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::rental.imallenlai.com/*"
        }
    ]
}
```

-   選擇屬性，編輯靜態網站託管
    -   啟用託管靜態網站
    -   索引文件 `index.html`
    -   錯誤文件 `index.html`
-   專案設定 homepage `https://rental.imallenlai.com/`
-   編譯專案產出 build 資料夾
-   上傳 build 資料夾內所有檔案到 S3 儲存桶
-   建立 cloudfront
    -   在 route 53 建立紀錄驗證 ACM SSL 憑證
    -   來源網域選 S3 的儲存桶 rental.imallenlai.com
    -   名稱輸入 rental.imallenlai.com
    -   快取政策選 CachingOptimized
    -   備用網域名稱設定 rental.imallenlai.com
    -   自訂 ACM SSL 憑證 rental.imallenlai.com
        -   DNS 驗證
    -   建立錯誤回應
        -   HTTP 錯誤碼 404
        -   錯誤快取最短 TTL 300
        -   自訂錯誤回應
            -   回應頁面路徑 index.html
            -   HTTP 回應碼 200
-   建立 Route 53 A 紀錄
    -   設定別名到 Cloudfront 的 rental.imallenlai.com

## 建立.env.local

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_MEASUREMENT_ID=

## 參考技術文章

-   [在 s3 上架設網站](https://blog.cloudthat.com/step-by-step-guide-to-deploy-reactjs-app-on-aws-s3/)
-   [CRA 自定義環境變數](https://create-react-app.dev/docs/adding-custom-environment-variables/)
-   [cloudfront 連結 s3 權限問題](https://aws.amazon.com/tw/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/)
-   [cloudfront 連結 s3 經由 https](https://www.youtube.com/watch?v=2VpsKK0nZi8)
-   [cloudfront 連結 github page](https://medium.com/@pieter.fiers/seo-git-pages-spa-with-cloudfront-696ae7c784fb)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3011](http://localhost:3011) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
