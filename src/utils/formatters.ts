export const fmtKW=(w:number)=>(w/1000).toFixed(2)+' kW'
export const fmtW=(w:number)=>w+'W'
export const fmtRate=(r:number)=>'+r.toFixed(2)+'/kWh'
export const fmtTime=(d=new Date())=>d.toLocaleTimeString('en-US',{hour12:false})
export const fmtPct=(n:number,d:number)=>d===0?'0%':Math.round((n/d)*100)+'%'