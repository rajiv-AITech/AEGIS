/* eslint-disable @typescript-eslint/no-explicit-any */
const MODEL   = (import.meta as any).env?.VITE_CLAUDE_MODEL ?? 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

export interface ClaudeMessage { role:'user'|'assistant'; content:string }
export interface ClaudeOptions { system:string; messages:ClaudeMessage[]; maxTokens?:number }

export async function callClaude({ system, messages, maxTokens=1000 }:ClaudeOptions):Promise<string> {
  const res = await fetch(API_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ model:MODEL, max_tokens:maxTokens, system, messages }),
  })
  if(!res.ok) throw new Error('Claude API error '+res.status)
  const d = await res.json()
  return d.content?.[0]?.text ?? ''
}

export const buildSecurityContext=(
  devices:{name:string;status:string}[],
  agents:{name:string;status:string}[],
  threat:number, loc='Great Falls, VA'
)=>
  'You are Sentinel AI, an autonomous smart home security assistant. '+
  'Property: '+loc+'. '+
  'Devices: '+devices.map(d=>d.name+': '+d.status).join(', ')+'. '+
  'Agents: '+agents.map(a=>a.name+' ('+a.status+')').join(', ')+'. '+
  'Threat: '+threat+'/100. Reply in 1-3 sentences.'

export const buildPEMSContext=(
  persona:string,load:number,rate:number,
  tou:string,battery:number,autonomy:string,mode:string
)=>
  'You are Sentinel PEMS AI. Persona: '+persona+'. Load: '+load.toFixed(2)+'kW. '+
  'TOU: '+rate.toFixed(2)+'/kWh ('+tou+'). Battery: '+battery+'%. Mode: '+mode+'. '+
  'Priority: Safety > Security > Energy. Reply 2-3 sentences.'