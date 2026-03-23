import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Automation } from '../types'

const INIT:Automation[]=[
  {name:'Goodnight Routine',trigger:'11 PM daily',actions:'Lock all - Arm perimeter - Deep Sleep',active:true},
  {name:'Arrival Mode',trigger:'Familiar face at door',actions:'Unlock - Disarm - HVAC Comfort',active:true},
  {name:'Peak Shedding',trigger:'Grid on-peak signal',actions:'Defer EV - HVAC setback - Cut loads',active:true},
  {name:'Departure Protocol',trigger:'Geofence exit locked',actions:'Deep Sleep - Shed comfort loads',active:true},
  {name:'Grid Down Shield',trigger:'Utility outage detected',actions:'Security Mesh only - UPS priority',active:true},
  {name:'Emergency Lockdown',trigger:'Threat score over 80',actions:'Lock all - Siren - Alert contacts',active:true},
]

type S={automations:Automation[];toggle(i:number):void;add(a:Automation):void;remove(i:number):void}

export const useAutomationStore=create<S>()(persist((set)=>({
  automations:INIT,
  toggle:(i)=>set((s:S)=>({automations:s.automations.map((a:Automation,j:number)=>j!==i?a:{...a,active:!a.active})})),
  add:(a)=>set((s:S)=>({automations:[...s.automations,a]})),
  remove:(i)=>set((s:S)=>({automations:s.automations.filter((_:Automation,j:number)=>j!==i)})),
}),{name:'sentinel-automations'}))