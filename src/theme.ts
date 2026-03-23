export const T = {
  bg:'#07090f',card:'#0d1117',card2:'#101720',card3:'#0a1020',
  border:'0.5px solid #1a2535',borderB:'0.5px solid #0f1a28',
  txt:'#c9d8e8',txt2:'#5e7a96',txt3:'#304050',
  purple:'#8b7de8',purpleBg:'#15103a',purpleBr:'#2a1f5a',
  green:'#34d399',greenBg:'#052216',
  blue:'#60a5fa',blueBg:'#061528',
  amber:'#fbbf24',amberBg:'#201200',
  red:'#f87171',redBg:'#200606',
  teal:'#2dd4bf',tealBg:'#042018',
} as const
export type ThemeKey = keyof typeof T