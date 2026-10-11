"use client"
import { useState } from 'react'

export default function PlanePUBG() {
  const [mode, setMode] = useState('inside') // inside | outside
  return (
    <div style={{height:'60vh', background: mode==='inside'?'#222':'#87CEEB', color:'#fff', padding:20}}>
      <button onClick={()=>setMode(mode==='inside'?'outside':'inside')} style={{padding:15}}>
        {mode==='inside'? 'OUTSIDE VIEW ✈️' : 'INSIDE VIEW 💺'}
      </button>
      {mode==='inside'? (
        <div>INSIDE: Seat 12B — Window [Africa below] — Passenger next to you: "Going to Beijing?" — [Play Dice] [Sleep]</div>
      ) : (
        <div>OUTSIDE: PUBG CAM — Plane over real Earth — Sahara → Ocean → China — Rotate camera 360 — Other planes in sky</div>
      )}
      <p>Flight: 8 mins — Economy R8k — You can toggle anytime to avoid boredom</p>
    </div>
  )
}
