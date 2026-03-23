import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Device } from '../types'

const INIT:Device[]=[
  {id:1,name:'Front Door Camera',type:'camera',zone:'Entry',status:'online',alert:false,icon:'📷'},
  {id:2,name:'Back Yard Camera',type:'camera',zone:'Perimeter',status:'online',alert:true,icon:'📷'},
  {id:3,name:'Front Door Lock',type:'lock',zone:'Entry',status:'locked',alert:false,icon:'🔒'},
  {id:4,name:'Garage Door',type:'door',zone:'Garage',status:'closed',alert:false,icon:'🚪'},
  {id:5,name:'Motion Living Rm',type:'sensor',zone:'Interior',status:'online',alert:false,icon:'👁'},
  {id:6,name:'Thermostat',type:'climate',zone:'Interior',status:'72F',alert:false,icon:'🌡'},
  {id:7,name:'Smoke Kitchen',type:'sensor',zone:'Interior',status:'online',alert:false,icon:'🔥'},
  {id:8,name:'Driveway Sensor',type:'sensor',zone:'Perimeter',status:'online',alert:false,icon:'📡'},
  {id:9,name:'Side Gate Lock',type:'lock',zone:'Perimeter',status:'locked',alert:false,icon:'🔒'},
  {id:10,name:'Video Doorbell',type:'camera',zone:'Entry',status:'online',alert:false,icon:'🔔'},
]

type S={devices:Device[];toggleDevice(id:number):void;setAlert(id:number,a:boolean):void;reset():void}

export const useDeviceStore=create<S>()(persist((set)=>({
  devices:INIT,
  toggleDevice:(id)=>set((s:S)=>({
    devices:s.devices.map((d:Device)=>{
      if(d.id!==id) return d
      const nxt=d.status==='locked'?'unlocked':d.status==='unlocked'?'locked':d.status==='closed'?'open':'closed'
      return{...d,status:nxt}
    })
  })),
  setAlert:(id,a)=>set((s:S)=>({devices:s.devices.map((d:Device)=>d.id===id?{...d,alert:a}:d)})),
  reset:()=>set({devices:INIT}),
}),{name:'sentinel-devices'}))