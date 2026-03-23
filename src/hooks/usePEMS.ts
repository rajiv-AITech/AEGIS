import { useMemo } from 'react'

export interface TOU{label:string;rate:number;isOnPeak:boolean;isMid:boolean;color:string;minsToNext:number}

export function useTOU():TOU{
  return useMemo(()=>{
    const h=new Date().getHours(),m=new Date().getMinutes()
    const isOnPeak=h>=18&&h<21
    const isMid=(h>=6&&h<9)||(h>=15&&h<18)
    const rate=isOnPeak?0.32:isMid?0.16:0.08
    const label=isOnPeak?'On-Peak':isMid?'Mid-Peak':'Off-Peak'
    const color=isOnPeak?'#f87171':isMid?'#fbbf24':'#34d399'
    const minsToNext=isOnPeak?(21-h)*60-m:isMid?(h<9?(9-h)*60-m:(18-h)*60-m):(6-h+24)*60%1440
    return{label,rate,isOnPeak,isMid,color,minsToNext}
  },[])
}