export type DeviceStatus = 'online'|'offline'|'locked'|'unlocked'|'open'|'closed'|string

export interface Device {
  id:number; name:string
  type:'camera'|'lock'|'door'|'sensor'|'climate'
  zone:'Entry'|'Perimeter'|'Garage'|'Interior'
  status:DeviceStatus; alert:boolean; icon:string
}
export interface Detection {
  t:'person'|'vehicle'|'motion'; x:number; y:number; w:number; h:number; lbl:string
}
export interface Camera {
  id:number; name:string; zone:string; outdoor:boolean; alert:boolean; dets:Detection[]
}
export interface Agent {
  id:string; name:string; desc:string; status:'active'|'paused'; triggers:number; last:string
}
export interface Automation { name:string; trigger:string; actions:string; active:boolean }
export interface ParsedAutomation { name:string; trigger:string; actions:string[] }
export interface Property {
  id:number; name:string; addr:string; icon:string
  threat:number; devices:number; alerts:number; armed:boolean; current:boolean
}
export interface ChatMessage { role:'user'|'ai'; text:string }
export interface LightZone {
  id:string; name:string; x:number; z:number
  fixY:number; floorY:number; radius:number
  watts:number; maxW:number; on:boolean; temp:number; zone:string; tip:string; optSave:number
}
export interface Load {
  id:string; name:string; draw:number; max:number
  shed:boolean; protected:boolean; icon:string; zone:'Critical'|'Comfort'|'Deferrable'
}
export type BadgeType='ok'|'warn'|'info'|'alert'|'purple'|'teal'