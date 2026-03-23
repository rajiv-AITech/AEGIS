import { callClaude } from './claude'
import type { ParsedAutomation } from '../types'

const SYS='Parse into JSON only. Fields: name(4 words max), trigger(string), actions(string[] max 4). Raw JSON, no markdown.'

export async function parseAutomation(desc:string):Promise<ParsedAutomation> {
  const raw=await callClaude({ system:SYS, messages:[{role:'user',content:desc}], maxTokens:300 })
  const s=raw.indexOf('{'), e=raw.lastIndexOf('}')+1
  return JSON.parse(s>=0 ? raw.slice(s,e) : raw) as ParsedAutomation
}