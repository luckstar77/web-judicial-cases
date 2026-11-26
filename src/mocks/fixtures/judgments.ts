import type { CityStat, JudgmentDetail, JudgmentWinner } from '@/shared/api/types';
import { createRandom } from '../utils';

/**
 * 模擬判決資料（姓名皆為虛構）。
 * 「王大明」在臺北有多筆敗訴紀錄，供 e2e 與高風險名單示範。
 */

interface Court {
  code: string;
  name: string;
  city: string;
  caseTypes: string[];
  districts: string[];
}

const COURTS: Court[] = [
  {
    code: 'TPEV',
    name: '臺灣臺北地方法院',
    city: '臺北',
    caseTypes: ['北簡', '北小'],
    districts: ['大安區', '中山區', '信義區', '文山區', '內湖區', '萬華區'],
  },
  {
    code: 'PCEV',
    name: '臺灣新北地方法院',
    city: '新北',
    caseTypes: ['板簡', '板小', '重簡'],
    districts: ['板橋區', '三重區', '新莊區', '中和區', '永和區', '新店區'],
  },
  { code: 'TYEV', name: '臺灣桃園地方法院', city: '桃園', caseTypes: ['桃簡', '壢簡'], districts: ['桃園區', '中壢區', '平鎮區', '八德區'] },
  { code: 'TCEV', name: '臺灣臺中地方法院', city: '臺中', caseTypes: ['中簡', '豐簡'], districts: ['西屯區', '北屯區', '南屯區', '北區'] },
  { code: 'TNEV', name: '臺灣臺南地方法院', city: '臺南', caseTypes: ['南簡', '新簡'], districts: ['東區', '北區', '永康區', '中西區'] },
  { code: 'KSEV', name: '臺灣高雄地方法院', city: '高雄', caseTypes: ['雄簡', '鳳簡'], districts: ['三民區', '苓雅區', '左營區', '鳳山區'] },
  { code: 'SCEV', name: '臺灣新竹地方法院', city: '新竹', caseTypes: ['竹簡'], districts: ['東區', '北區'] },
  { code: 'KLEV', name: '臺灣基隆地方法院', city: '基隆', caseTypes: ['基簡'], districts: ['仁愛區', '信義區'] },
  { code: 'ILEV', name: '臺灣宜蘭地方法院', city: '宜蘭', caseTypes: ['宜簡', '羅簡'], districts: ['宜蘭市', '羅東鎮'] },
  { code: 'CHEV', name: '臺灣彰化地方法院', city: '彰化', caseTypes: ['彰簡'], districts: ['彰化市', '員林市'] },
  { code: 'CYEV', name: '臺灣嘉義地方法院', city: '嘉義', caseTypes: ['嘉簡'], districts: ['東區', '西區'] },
  { code: 'PTEV', name: '臺灣屏東地方法院', city: '屏東', caseTypes: ['屏簡', '潮簡'], districts: ['屏東市', '潮州鎮'] },
];

const NAMES = [
  '陳俊宏',
  '林怡君',
  '張家豪',
  '李佩珊',
  '王志偉',
  '劉淑芬',
  '蔡明哲',
  '楊雅雯',
  '許哲維',
  '鄭惠如',
  '謝承翰',
  '洪美華',
  '郭建志',
  '曾郁婷',
  '邱冠廷',
  '廖思妤',
  '賴俊傑',
  '周欣怡',
  '徐子軒',
  '葉孟潔',
  '蘇柏翰',
  '莊佳玲',
  '呂冠宇',
  '江佩君',
  '何承恩',
  '羅雅琪',
  '高志豪',
  '潘怡婷',
  '簡志遠',
  '鍾惠雯',
];

type Scenario = 'unpaidRent' | 'evict' | 'deposit' | 'damage';

const SCENARIO_TITLES: Record<Scenario, string> = {
  unpaidRent: '給付租金',
  evict: '遷讓房屋等',
  deposit: '返還押租金',
  damage: '損害賠償',
};

interface Seed {
  court: Court;
  scenario: Scenario;
  landlord: string;
  tenant: string;
  /** 誰勝訴；undefined 表示判決結果未標示 */
  win?: JudgmentWinner;
  rent: number;
  date: Date;
}

/** 重複出現的虛構姓名：name 為敗訴方。 */
const REPEAT_OFFENDERS: { name: string; courtCode: string; count: number; role: 'tenant' | 'landlord'; rent: [number, number] }[] = [
  { name: '王大明', courtCode: 'TPEV', count: 5, role: 'tenant', rent: [16000, 28000] },
  { name: '林美玲', courtCode: 'PCEV', count: 4, role: 'tenant', rent: [9000, 15000] },
  { name: '劉文雄', courtCode: 'TPEV', count: 3, role: 'landlord', rent: [18000, 32000] },
  { name: '陳志明', courtCode: 'TCEV', count: 3, role: 'tenant', rent: [8000, 13000] },
  { name: '張雅婷', courtCode: 'KSEV', count: 3, role: 'tenant', rent: [7000, 12000] },
  { name: '黃建華', courtCode: 'TPEV', count: 2, role: 'tenant', rent: [12000, 20000] },
  { name: '李淑惠', courtCode: 'TNEV', count: 2, role: 'landlord', rent: [8000, 11000] },
  { name: '吳家豪', courtCode: 'TYEV', count: 2, role: 'tenant', rent: [10000, 14000] },
  { name: '鄭國榮', courtCode: 'TPEV', count: 2, role: 'landlord', rent: [22000, 35000] },
  { name: '蔡美惠', courtCode: 'TPEV', count: 2, role: 'tenant', rent: [11000, 16000] },
];

const RANDOM_JUDGMENT_COUNT = 70;
const ROC_YEAR_OFFSET = 1911;
const RENT_STEP = 500;
const MS_PER_DAY = 86_400_000;
const ARGUMENT_DAYS_BEFORE = 14;

const RANDOM_SEED = 20241126;

/** 每次建立 fixtures 時重設，確保資料完全一致。 */
let random = createRandom(RANDOM_SEED);

const roundRent = (value: number) => Math.round(value / RENT_STEP) * RENT_STEP;

const randomDate = (): Date => {
  const start = Date.UTC(2015, 0, 1);
  const end = Date.UTC(2025, 9, 31);
  return new Date(start + Math.floor(random.next() * (end - start)));
};

const pad = (value: number) => String(value).padStart(2, '0');
const toIsoDate = (date: Date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
const toCompactDate = (date: Date) => toIsoDate(date).replaceAll('-', '');
const toRocText = (date: Date) => `民國${date.getUTCFullYear() - ROC_YEAR_OFFSET}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
const money = (value: number) => `新臺幣${value.toLocaleString('zh-TW')}元`;

const buildSeeds = (): Seed[] => {
  const seeds: Seed[] = [];
  REPEAT_OFFENDERS.forEach((offender) => {
    const court = COURTS.find((item) => item.code === offender.courtCode) ?? COURTS[0];
    for (let index = 0; index < offender.count; index += 1) {
      const other = random.pick(NAMES);
      const rent = roundRent(random.int(offender.rent[0], offender.rent[1]));
      if (offender.role === 'tenant') {
        seeds.push({
          court,
          scenario: random.pick(['unpaidRent', 'evict', 'damage'] as const),
          landlord: other,
          tenant: offender.name,
          win: 'plaintiff',
          rent,
          date: randomDate(),
        });
      } else {
        seeds.push({ court, scenario: 'deposit', landlord: offender.name, tenant: other, win: 'plaintiff', rent, date: randomDate() });
      }
    }
  });
  for (let index = 0; index < RANDOM_JUDGMENT_COUNT; index += 1) {
    const court = random.pick(COURTS);
    const scenario = random.pick(['unpaidRent', 'unpaidRent', 'evict', 'deposit', 'damage'] as const);
    const landlord = random.pick(NAMES);
    const tenant = random.next() < 0.08 ? `${random.pick(NAMES).slice(0, 1)}○○` : random.pick(NAMES.filter((name) => name !== landlord));
    const roll = random.next();
    const win: JudgmentWinner | undefined = roll < 0.72 ? 'plaintiff' : roll < 0.92 ? 'defendant' : undefined;
    seeds.push({ court, scenario, landlord, tenant, win, rent: roundRent(random.int(6000, 30000)), date: randomDate() });
  }
  return seeds;
};

const buildFullText = (seed: Seed, plaintiff: string, defendant: string, caseNumber: string): string => {
  const { court, scenario, rent, date, win } = seed;
  const arguedAt = new Date(date.getTime() - ARGUMENT_DAYS_BEFORE * MS_PER_DAY);
  const months = random.int(2, 6);
  const claim = scenario === 'deposit' ? rent * 2 : rent * months;
  const loser = win === 'defendant' ? '原告' : '被告';
  const address = `${court.city}${random.pick(court.districts)}○○路○段○號○樓`;
  const mainText =
    win === 'defendant'
      ? '原告之訴駁回。'
      : `被告應給付原告${money(claim)}，及自起訴狀繕本送達翌日起至清償日止，按週年利率百分之五計算之利息。${scenario === 'evict' ? '\n被告應將門牌號碼' + address + '房屋騰空遷讓返還原告。' : ''}`;
  const claimText =
    scenario === 'deposit'
      ? [
          `原告於民國${date.getUTCFullYear() - ROC_YEAR_OFFSET - 2}年間向被告承租門牌號碼${address}之房屋，`,
          `每月租金${money(rent)}，並交付押租金${money(rent * 2)}。租期屆滿後原告已將房屋騰空返還，`,
          '被告卻以房屋需重新粉刷、清潔為由拒絕返還押租金，經原告多次催告仍置之不理，爰依租賃契約及民法第179條規定提起本訴。',
        ].join('')
      : [
          `被告於民國${date.getUTCFullYear() - ROC_YEAR_OFFSET - 1}年間向原告承租門牌號碼${address}之房屋，約定每月租金${money(rent)}，`,
          `應於每月5日前給付。詎被告自${months}個月前起即未依約給付租金，經原告以存證信函催告後仍未清償，共積欠${money(claim)}`,
          scenario === 'damage' ? '，且退租時房屋牆面、地板及設備多處毀損，原告支出修繕費用' : '',
          '，爰依租賃契約之法律關係提起本訴。',
        ].join('');
  const defenseText =
    win === 'defendant'
      ? '則以：原告所稱之損害係屬房屋自然耗損，被告已依約返還房屋並結清租金，原告之請求並無理由等語，資為抗辯。'
      : '經合法通知，未於言詞辯論期日到場，亦未提出書狀作任何聲明或陳述。';
  const reasoning =
    win === 'defendant'
      ? '原告就其主張之事實，未能提出租賃契約以外之具體證據證明，自難認其請求為有理由。'
      : '原告主張之事實，業據其提出房屋租賃契約書、存證信函及匯款紀錄等件為證，核屬相符，被告對原告主張之事實未爭執，依民事訴訟法第280條第3項準用第1項規定，視同自認，堪信原告之主張為真實。';
  return [
    `${court.name}民事簡易判決`,
    caseNumber,
    `原　　　告　${plaintiff}`,
    `被　　　告　${defendant}`,
    `上列當事人間請求${SCENARIO_TITLES[scenario]}事件，本院於${toRocText(arguedAt)}言詞辯論終結，判決如下：`,
    '',
    '　　主　　文',
    mainText,
    `訴訟費用由${loser}負擔。`,
    win === 'defendant' ? '' : '本判決得假執行。',
    '',
    '　　事實及理由',
    `一、原告主張：${claimText}`,
    `二、被告${defenseText}`,
    '三、本院之判斷：',
    `（一）${reasoning}`,
    '（二）按承租人應依約定日期支付租金；租賃關係終止後，承租人應返還租賃物，民法第439條、第455條分別定有明文。',
    `四、綜上所述，${win === 'defendant' ? '原告之請求為無理由，應予駁回。' : '原告依租賃契約之法律關係請求被告給付如主文所示，為有理由，應予准許。'}`,
    '',
    `中　　華　　民　　國　　${date.getUTCFullYear() - ROC_YEAR_OFFSET}　　年　　${date.getUTCMonth() + 1}　　月　　${date.getUTCDate()}　　日`,
    '　　　　　　　　　簡易庭　法　官　○○○',
    '以上正本係照原本作成。',
    '如不服本判決，應於判決送達後20日內向本院提出上訴狀。',
  ].join('\n');
};

export interface JudgmentRecord extends Omit<JudgmentDetail, 'likeCount' | 'commentCount'> {
  baseLikeCount: number;
}

export const createJudgmentFixtures = (): JudgmentRecord[] => {
  random = createRandom(RANDOM_SEED);
  return buildSeeds().map((seed, index) => {
    const isDeposit = seed.scenario === 'deposit';
    const plaintiff = isDeposit ? seed.tenant : seed.landlord;
    const defendant = isDeposit ? seed.landlord : seed.tenant;
    const jyear = String(seed.date.getUTCFullYear() - ROC_YEAR_OFFSET - (random.next() < 0.3 ? 1 : 0));
    const jcase = random.pick(seed.court.caseTypes);
    const jno = String(random.int(100, 4999));
    const caseNumber = `${jyear}年度${jcase}字第${jno}號`;
    const id = `${seed.court.code},${jyear},${jcase},${jno},${toCompactDate(seed.date)},1`;
    return {
      id,
      jyear,
      jcase,
      jno,
      jdate: toIsoDate(seed.date),
      jtitle: SCENARIO_TITLES[seed.scenario],
      plaintiff,
      defendant,
      rent: seed.rent,
      city: seed.court.city,
      district: random.pick(seed.court.districts),
      win: seed.win,
      jfull: buildFullText(seed, plaintiff, defendant, caseNumber),
      jpdf: index % 3 === 0 ? undefined : `https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=${encodeURIComponent(id)}`,
      baseLikeCount: random.int(0, 36),
    };
  });
};

/** 各縣市判決數（模擬實際資料規模，供地圖使用）。 */
export const CITY_STATS_FIXTURE: CityStat[] = [
  { city: '臺北', judgmentCount: 3125 },
  { city: '新北', judgmentCount: 3870 },
  { city: '桃園', judgmentCount: 1980 },
  { city: '臺中', judgmentCount: 2460 },
  { city: '臺南', judgmentCount: 1235 },
  { city: '高雄', judgmentCount: 2105 },
  { city: '基隆', judgmentCount: 312 },
  { city: '新竹', judgmentCount: 688 },
  { city: '苗栗', judgmentCount: 241 },
  { city: '彰化', judgmentCount: 596 },
  { city: '南投', judgmentCount: 188 },
  { city: '雲林', judgmentCount: 203 },
  { city: '嘉義', judgmentCount: 377 },
  { city: '屏東', judgmentCount: 402 },
  { city: '宜蘭', judgmentCount: 296 },
  { city: '花蓮', judgmentCount: 254 },
  { city: '臺東', judgmentCount: 98 },
  { city: '澎湖', judgmentCount: 41 },
  { city: '金門', judgmentCount: 37 },
  { city: '連江', judgmentCount: 6 },
];
