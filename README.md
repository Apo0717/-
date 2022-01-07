# 開發工具

---

Visual Studio Code

# receipt_test

> 使用者可瀏覽已紀錄的發票內容，也可手動輸入發票、刪除尚在驗證中的發票。

### Project setup

```
yarn install

or

npm i
```

### Compiles and hot-reloads for development

```
yarn run start

or

npm run start
```

### 開啟 json server

```
yarn run json-start

or

npm run json-start
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint --fix
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 專案的架構、邏輯說明

```
主要分類
- ssets-CSS樣式和IMG圖片放置
  (css使用採用scss開發，採用SMACSS，以不同page的方式去開發。)
  --app.scss-所有樣式入口
  --golbal.scss-共用樣式和加速開發的設定
- components-元件放置處
- router-路由設定
- store-vuex(此專案未使用)
- utils-開發小幫手設定處(API.)
- views-web顯示的每一頁放置處
  (Home為原始頁，因此專案較小，沒有用資料夾去分開。)
```

### 問題與解決

原本習慣使用 Vue2 開發，下面為記錄改用 Vue3 開發的過程。

```
Q. 之前只用cdn的方式做過vue3.0，所以在架vue-cli的時候照著官網create專案無法
建立vue3.0的專案?
A. 執行"npm update -g @vue/cli" 升級至少到4.0以上的版本才會出現建立vue3的選項。


Q.vue3 (Composition API) 跟 vue2 (Options API) 結構不一樣?
A.照官網一步一步去做起，同時參考各部落格分享的差異，一邊測試一邊學習。
```
