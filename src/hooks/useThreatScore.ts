import { useMemo } from 'react'
import { useDeviceStore } from '../store/useDeviceStore'
import { useAgentStore } from '../store/useAgentStore'
import type { Device } from '../types'
import type { Agent } from '../types'

export function useThreatScore():number {
  const devices=useDeviceStore((s:any)=>s.devices) as Device[]
  const agents=useAgentStore((s:any)=>s.agents) as Agent[]
  return useMemo(()=>{
    let score=0
    score+=devices.filter((d)=>d.alert).length*15
    score+=agents.filter((a)=>a.status==='paused').length*5
    score+=devices.filter((d)=>d.zone==='Entry'&&d.status==='unlocked').length*10
    return Math.min(score,100)
  },[devices,agents])
}