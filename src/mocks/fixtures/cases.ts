import { createEvidenceImage } from './images';

/** 網友回報模擬資料（人物、電話、身分證皆為虛構）。對外回傳前會遮罩。 */
export interface CaseRecord {
  id: number;
  title: string;
  content: string;
  location: string;
  district: string;
  rent: number;
  defendantName: string;
  defendantPhone: string;
  defendantIdNo: string;
  imageUrls: string[];
  authorDisplayName: string;
  baseLikeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CaseSeed {
  title: string;
  content: string;
  location: string;
  district: string;
  rent: number;
  defendantName: string;
  defendantPhone?: string;
  defendantIdNo?: string;
  author: string;
  images?: string[];
  hoursAgo: number;
  likes: number;
}

const MS_PER_HOUR = 3_600_000;
const PARAGRAPH_SEPARATOR = '\n\n';

const paragraphs = (...lines: string[]) => lines.join(PARAGRAPH_SEPARATOR);

const SEEDS: CaseSeed[] = [
  {
    title: '房客連續三個月沒繳房租，最後半夜搬走',
    content: paragraphs(
      '【租約期間】2024 年 3 月起，租期一年。',
      '【發生經過】前兩個月都正常匯款，第三個月開始說公司薪水延遲，請我寬限。之後電話不接、LINE 已讀不回，到第五個月我到現場才發現已經人去樓空，冷氣遙控器、鑰匙都沒還。',
      '【造成損失】積欠 3 個月租金共 54,000 元，押金只有兩個月，還要自己請人清運留下的家具。',
      '【處理過程】已寄存證信函，目前準備聲請支付命令。',
      '提醒各位房東：簽約時務必核對身分證正本，並當場撥打對方手機確認。',
    ),
    location: '台北市',
    district: '大安區',
    rent: 18000,
    defendantName: '王大明',
    defendantPhone: '0912345678',
    defendantIdNo: 'A123456789',
    author: '大安區包租公',
    images: ['租約影本', 'LINE 對話截圖', '房屋現況'],
    hoursAgo: 3,
    likes: 42,
  },
  {
    title: '押金拖了兩個月才退，還被扣「清潔費」8,000 元',
    content: paragraphs(
      '【租約期間】2023 年 9 月到 2024 年 8 月。',
      '【發生經過】退租時已經請專業清潔，也拍照錄影存證，房東當天點交說沒問題。結果一個月後才說牆面有釘孔、要重新油漆，要扣 8,000 元，而且押金一直拖著不退。',
      '【處理過程】我把點交影片和清潔收據傳給房東，對方就不讀不回。後來到區公所申請調解，房東才同意退還，但還是扣了 3,000 元。',
      '建議大家退租點交時一定要錄影，並請房東簽名確認。',
    ),
    location: '新北市',
    district: '板橋區',
    rent: 13500,
    defendantName: '劉文雄',
    defendantPhone: '0922789456',
    author: '板橋小資族',
    images: ['點交照片', '清潔收據'],
    hoursAgo: 9,
    likes: 27,
  },
  {
    title: '房東擅自進入房間，還說是「檢查設備」',
    content: paragraphs(
      '【發生經過】下班回家發現房間東西被移動過，問了房東才承認白天有進來「檢查冷氣」，事前完全沒有通知。之後又發生一次，我已經明確表示不同意未經通知進入。',
      '【目前狀況】已經找好新住處，準備提前解約。依契約提前解約要賠一個月租金，正在跟房東協商。',
      '提醒租屋族：簽約前可以在契約加註「出租人進入租賃處所需事先通知並經承租人同意」。',
    ),
    location: '台中市',
    district: '西屯區',
    rent: 9800,
    defendantName: '鄭國榮',
    author: '逢甲學生',
    hoursAgo: 20,
    likes: 18,
  },
  {
    title: '把套房改成民宿出租，還在房間抽菸被鄰居檢舉',
    content: paragraphs(
      '【租約期間】2024 年 1 月起，租給自稱上班族的房客。',
      '【發生經過】管委會通知我，房間每週都有不同的人拖著行李出入，懷疑在經營日租。進屋查看後發現房間有濃厚菸味、窗簾被燒出破洞。',
      '【造成損失】更換窗簾、除臭與重新油漆約 26,000 元。',
      '【處理過程】已依契約終止租約，並保留管委會紀錄與照片，準備求償。',
    ),
    location: '台北市',
    district: '中山區',
    rent: 22000,
    defendantName: '林美玲',
    defendantPhone: '0933111222',
    author: '中山區房東',
    images: ['燒破的窗簾', '管委會通知'],
    hoursAgo: 30,
    likes: 35,
  },
  {
    title: '頂樓加蓋漏水半年都不修，還要我自己找師傅',
    content: paragraphs(
      '【發生經過】入住第二個月下大雨開始漏水，床墊和筆電都泡水。通知房東後一直說會處理，拖了半年只來看過一次。',
      '【造成損失】床墊、筆電維修約 15,000 元。',
      '【處理過程】已寄存證信函要求修繕，並依民法第 430 條通知房東：若期限內未修繕，將自行修繕並從租金扣除。',
    ),
    location: '高雄市',
    district: '三民區',
    rent: 7500,
    defendantName: '張雅婷',
    author: '南部打工仔',
    images: ['天花板漏水'],
    hoursAgo: 52,
    likes: 21,
  },
  {
    title: '簽約後才發現房東不是屋主，二房東捲款跑了',
    content: paragraphs(
      '【發生經過】在網路上看到租屋資訊，自稱房東的人帶看後當場簽約，付了押金加一個月租金共 36,000 元。入住兩週後真正的屋主出現，才知道對方只是前房客，私自轉租。',
      '【處理過程】已報警並提告詐欺。',
      '提醒：簽約前一定要請對方出示房屋所有權狀或謄本，並核對身分證。',
    ),
    location: '桃園市',
    district: '中壢區',
    rent: 12000,
    defendantName: '吳家豪',
    defendantPhone: '0955666777',
    defendantIdNo: 'H120987654',
    author: '中壢上班族',
    images: ['匯款紀錄', '假租約'],
    hoursAgo: 75,
    likes: 64,
  },
  {
    title: '房客養貓不告知，退租時木地板全毀',
    content: paragraphs(
      '【租約期間】2022 年 10 月到 2024 年 10 月，契約明訂禁止飼養寵物。',
      '【發生經過】退租點交時發現房內有大量貓毛，木地板與門框都有抓痕，紗窗也被抓破。',
      '【造成損失】修繕估價約 42,000 元，押金只有 20,000 元。',
      '【目前狀況】已提出小額訴訟。',
    ),
    location: '台南市',
    district: '東區',
    rent: 10000,
    defendantName: '陳志明',
    author: '台南老屋房東',
    images: ['地板抓痕', '門框損壞', '修繕估價單'],
    hoursAgo: 120,
    likes: 16,
  },
  {
    title: '房東不讓報稅也不給租賃契約副本',
    content: paragraphs(
      '【發生經過】簽約時房東說不能報稅、不能申請租屋補助，否則租金要漲 2,000 元。合約只有一份，由房東保管，我要求影本也被拒絕。',
      '【目前狀況】已向縣市政府地政局諮詢，得知可依租賃住宅市場發展及管理條例檢舉。',
      '提醒：契約至少一式兩份，雙方各執一份。',
    ),
    location: '新北市',
    district: '新莊區',
    rent: 11000,
    defendantName: '黃建華',
    author: '新莊租屋族',
    hoursAgo: 160,
    likes: 39,
  },
  {
    title: '房客在社區公共區域堆放雜物，屢勸不聽',
    content: paragraphs(
      '【發生經過】房客把紙箱與舊家具堆在樓梯間，管委會多次張貼公告並罰款，最後罰單都寄到我這裡。',
      '【處理過程】與房客溝通三次無效，依契約終止租約，房客拒絕搬遷，目前已提起遷讓房屋訴訟。',
    ),
    location: '台北市',
    district: '文山區',
    rent: 16000,
    defendantName: '蔡美惠',
    defendantPhone: '0988123456',
    author: '木柵房東阿姨',
    images: ['樓梯間雜物'],
    hoursAgo: 200,
    likes: 12,
  },
  {
    title: '電費一度收 8 元，遠超過台電夏月電價',
    content: paragraphs(
      '【發生經過】入住後才發現獨立電表每度收 8 元，夏天一個月電費就 3,000 多元。詢問房東只說「大家都這樣收」。',
      '【處理過程】查詢後得知依規定，房東收取電費不得超過台電當期最高級距電價。已提出申訴，房東同意調降為每度 5 元。',
    ),
    location: '台中市',
    district: '北區',
    rent: 6500,
    defendantName: '李淑惠',
    author: '一中街學生',
    hoursAgo: 260,
    likes: 48,
  },
  {
    title: '房客以假名簽約，欠租後失聯',
    content: paragraphs(
      '【發生經過】房客簽約時說身分證遺失，只出示健保卡影本。欠租兩個月後失聯，才發現健保卡上的名字與本人不符。',
      '【造成損失】租金 24,000 元與門鎖更換費。',
      '教訓：一定要看身分證正本，並請對方當場撥打手機確認門號。',
    ),
    location: '高雄市',
    district: '苓雅區',
    rent: 12000,
    defendantName: '許哲維',
    defendantPhone: '0970555888',
    author: '高雄小房東',
    hoursAgo: 320,
    likes: 30,
  },
  {
    title: '退租前一個月房東突然要求漲租 3,000 元',
    content: paragraphs(
      '【發生經過】租約還有一個月到期，房東說續約要漲 3,000 元，不續約就要我提前搬走，否則要收違約金。',
      '【處理過程】查詢內政部定型化契約範本，租期屆滿前房東不能單方面要求提前終止，最後依約住到期滿。',
    ),
    location: '新竹市',
    district: '東區',
    rent: 14500,
    defendantName: '洪美華',
    author: '竹科工程師',
    hoursAgo: 410,
    likes: 9,
  },
  {
    title: '分租套房隔音極差，房東說是我太敏感',
    content: paragraphs(
      '【發生經過】看房時房東說是 RC 隔間，入住後才發現是木板隔間，隔壁講電話一清二楚。反映後房東說「不然你搬走」。',
      '【目前狀況】已找好新租處，雙方合意解約，押金如數退還。分享給大家參考，看房時可以敲敲牆壁確認隔間材質。',
    ),
    location: '台北市',
    district: '萬華區',
    rent: 8500,
    defendantName: '郭建志',
    author: '西門町上班族',
    hoursAgo: 520,
    likes: 7,
  },
  {
    title: '房客擅自轉租給朋友，還在房內經營網拍倉庫',
    content: paragraphs(
      '【發生經過】鄰居反映每天有大量貨物進出，查看後發現原房客已搬走，房內住的是他朋友，還堆滿網拍商品。',
      '【處理過程】依民法第 443 條，承租人非經出租人承諾不得轉租，已終止契約並要求遷讓。',
    ),
    location: '新北市',
    district: '三重區',
    rent: 15000,
    defendantName: '邱冠廷',
    author: '三重房東',
    images: ['堆滿貨物的房間'],
    hoursAgo: 700,
    likes: 14,
  },
];

export const createCaseFixtures = (now: Date = new Date()): CaseRecord[] =>
  SEEDS.map((seed, index) => {
    const createdAt = new Date(now.getTime() - seed.hoursAgo * MS_PER_HOUR).toISOString();
    return {
      id: SEEDS.length - index,
      title: seed.title,
      content: seed.content,
      location: seed.location,
      district: seed.district,
      rent: seed.rent,
      defendantName: seed.defendantName,
      defendantPhone: seed.defendantPhone ?? '',
      defendantIdNo: seed.defendantIdNo ?? '',
      imageUrls: (seed.images ?? []).map((label, imageIndex) => createEvidenceImage(label, index + imageIndex)),
      authorDisplayName: seed.author,
      baseLikeCount: seed.likes,
      createdAt,
      updatedAt: createdAt,
    };
  });
