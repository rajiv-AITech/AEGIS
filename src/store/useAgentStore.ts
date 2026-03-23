import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent } from '../types'

const INIT:Agent[]=[
  {id:'ai-deter',name:'AI Deterrence Agent',desc:'Adaptive verbal warnings.',status:'active',triggers:47,last:'2m ago'},
  {id:'perimeter',name:'Perimeter Guard',desc:'Monitors outdoor sensors 24/7.',status:'active',triggers:182,last:'2m ago'},
  {id:'access',name:'Smart Access Controller',desc:'Manages locks and visitor codes.',status:'active',triggers:91,last:'3h ago'},
  {id:'energy',name:'Energy Optimizer PEMS',desc:'Grid-interactive TOU optimization.',status:'active',triggers:33,last:'1h ago'},
  {id:'rvms',name:'Remote Video Monitor',desc:'24/7 AI video review.',status:'active',triggers:214,last:'14m ago'},
  {id:'wellness',name:'Wellness Sentinel',desc:'Tracks occupancy patterns.',status:'paused',triggers:8,last:'2d ago'},
]

type S={agents:Agent[];toggleAgent(id:string):void;incrementTrigger(id:string):void}

export const useAgentStore=create<S>()(persist((set)=>({
  agents:INIT,
  toggleAgent:(id)=>set((s:S)=>({
    agents:s.agents.map((a:Agent)=>a.id!==id?a:{...a,status:a.status==='active'?'paused':'active'})
  })),
  incrementTrigger:(id)=>set((s:S)=>({
    agents:s.agents.map((a:Agent)=>a.id!==id?a:{...a,triggers:a.triggers+1,last:'just now'})
  })),
}),{name:'sentinel-agents'}))