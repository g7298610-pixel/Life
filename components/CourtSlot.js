"use client"
import { useState } from 'react'

export default function CourtSlot() {
  const [judge, setJudge] = useState('Bot Judge Mahlangu')
  const queue = ['Thabo (25 wins)', 'Lerato (22 wins)', 'You (0 wins)']
  return (
    <div style={{padding:20, border:'2px solid white', marginTop:20}}>
      <h3>Court — 1 Chair Only</h3>
      <p>Current Judge: {judge}</p>
      <button onClick={()=>setJudge('You — Real Player')} style={{padding:10, marginRight:10}}>TAKE OVER (Bot stands up)</button>
      <button onClick={()=>setJudge('Bot Judge Mahlangu')} style={{padding:10}}>LOG OFF (Bot sits again)</button>
      <p>Queue (10 want judge): {queue.join(', ')} — Shifts: 08-10, 10-12, 12-14, 14-16</p>
    </div>
  )
  }
