export interface FaqSubItem {
  question: string;
  answer: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answers?: string[];
  subItems?: FaqSubItem[];
}

/** 常見問題（前三題移植自舊版 FAQPage）。 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'forged-info',
    question: '若碰上對方提交偽造資訊？',
    subItems: [
      { question: '姓名或身分證號不實', answer: '簽約時一定要當場核對身分證正本。' },
      { question: '電話號碼不實', answer: '於簽約現場立刻撥打其手機以確認門號有效。' },
    ],
  },
  {
    id: 'member-reminders',
    question: '給會員的提醒',
    answers: [
      '請以真實身份完成平台驗證，確保整體服務水準。',
      '您應對所張貼的內容負責；如遇檢調機關調查，平台將依法配合。',
      '建議在租約備註：「發生爭議時，可將事件與資料上傳至網路相關平台」。',
      '切勿縱容慣犯，及時紀錄並分享案例，可降低其他人受害風險。',
    ],
  },
  {
    id: 'before-register',
    question: '註冊前須知',
    answers: ['已依會員意見大幅優化介面及資料安全。', '因後續資訊較為敏感，註冊時需先完成手機驗證程序。', '平台規範將不定期調整，請以官網最新公告為準。'],
  },
  {
    id: 'judgment-source',
    question: '判決資料從哪裡來？',
    answers: ['判決資料整理自司法院公開的裁判書，以租賃相關的民事判決為主。', '判決內容與結果以司法院公告為準；同名同姓者眾，請搭配地區、租金與判決內容判斷。'],
  },
  {
    id: 'community-trust',
    question: '網友回報可信嗎？',
    answers: ['網友回報由會員自行提供，平台未經查證，頁面上會標示「網友回報・未經查證」。', '請把回報當作參考線索，並搭配判決資料與當面核對證件來判斷。'],
  },
  {
    id: 'search-login',
    question: '為什麼搜尋網友回報需要登入？',
    answers: ['為保護當事人隱私並防止濫用，以姓名、電話或身分證精確搜尋網友回報需要登入，且只會顯示完全相符的結果。'],
  },
  {
    id: 'report-content',
    question: '發現不實或不當內容怎麼辦？',
    answers: ['請透過粉絲專頁私訊我們，附上回報連結與說明，我們會盡快處理。'],
  },
];
