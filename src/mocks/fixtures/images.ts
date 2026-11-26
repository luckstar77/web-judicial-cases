const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

const PALETTES = [
  ['#0E5E6F', '#3F8796'],
  ['#9A5B00', '#E9A23B'],
  ['#3B4A5A', '#7A8B9C'],
  ['#2E6B4F', '#5FA37E'],
] as const;

/** 產生離線可用的 SVG 假證據照片（data URI）。 */
export const createEvidenceImage = (label: string, variant: number): string => {
  const [from, to] = PALETTES[variant % PALETTES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<rect x="250" y="150" width="300" height="220" rx="24" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.5)" stroke-width="4"/>
<circle cx="330" cy="225" r="28" fill="rgba(255,255,255,0.6)"/>
<path d="M270 350 L370 260 L440 320 L480 285 L530 350 Z" fill="rgba(255,255,255,0.6)"/>
<text x="400" y="450" font-family="PingFang TC, Noto Sans TC, sans-serif" font-size="40" font-weight="700" fill="#fff" text-anchor="middle">${label}</text>
<text x="400" y="500" font-family="PingFang TC, Noto Sans TC, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">示意圖・模擬資料</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
