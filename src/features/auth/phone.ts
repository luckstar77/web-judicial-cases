const TW_COUNTRY_CODE = '+886';
const LOCAL_MOBILE_PATTERN = /^09\d{8}$/;
const E164_MOBILE_PATTERN = /^\+8869\d{8}$/;
const NON_DIGIT_PATTERN = /[\s-]/g;
const LEADING_ZERO_LENGTH = 1;

export const stripPhone = (phone: string): string => phone.replace(NON_DIGIT_PATTERN, '');

/** 接受 `0912345678`、`0912-345-678`、`+886912345678`。 */
export const isValidTaiwanMobile = (phone: string): boolean => {
  const stripped = stripPhone(phone);
  return LOCAL_MOBILE_PATTERN.test(stripped) || E164_MOBILE_PATTERN.test(stripped);
};

/** 轉為 Firebase 需要的 E.164：`0912345678` → `+886912345678`。 */
export const toE164 = (phone: string): string => {
  const stripped = stripPhone(phone);
  if (stripped.startsWith(TW_COUNTRY_CODE)) {
    return stripped;
  }
  return `${TW_COUNTRY_CODE}${stripped.slice(LEADING_ZERO_LENGTH)}`;
};

/** 顯示用：`+886912345678` → `0912-345-678`。 */
export const formatPhoneForDisplay = (phone: string): string => {
  const stripped = stripPhone(phone);
  const local = stripped.startsWith(TW_COUNTRY_CODE) ? `0${stripped.slice(TW_COUNTRY_CODE.length)}` : stripped;
  if (!LOCAL_MOBILE_PATTERN.test(local)) {
    return phone;
  }
  return `${local.slice(0, 4)}-${local.slice(4, 7)}-${local.slice(7)}`;
};
