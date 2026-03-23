import { useState, useEffect } from 'react'
import { useThreatScore } from './useThreatScore'

export function useEscalation(){
  const score=useThreatScore()
  const [show,setShow]=useState(false)
  const [dismissed,setDismissed]=useState(false)
  useEffect(()=>{ if(score>=60&&!dismissed) setShow(true) },[score,dismissed])
  return{
    showModal:show,
    dismiss:()=>{ setShow(false); setDismissed(true) },
    trigger:()=>{ setShow(true); setDismissed(false) },
    score
  }
}