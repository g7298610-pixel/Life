"use client"
import { useState } from 'react'
import PlanePUBG from '../components/PlanePUBG'
import CourtSlot from '../components/CourtSlot'
import Funeral from '../components/Funeral'
import { rollFamily } from '../lib/familyLottery'

export default function Home() {
  const [family, setFamily] = useState(null)
  const [view, setView] = useState('kasi') // kasi | plane | court | funeral

  const startLife = () => {
    const f = rollFamily() // 60% RDP, 30% Flats, 8% Estate, 2% Islands
    setFamily(f)
  }

  if (!family) return (
    <div style={{padding:20, textAlign:'center'}}>
      <h1>KASI LIFE 0288 V1</h1>
      <p>Blind Birth — You don't know rich or poor</p>
      <button onClick={startLife} style={{padding:20, fontSize:20}}>BORN IN GA-RANKUWA</button>
    </div>
  )

  return (
    <div>
      <h3>Born: {family.zone} | Parents: Bot {family.surname} | Age: 16</h3>
      <div style={{display:'flex', gap:10}}>
        <button onClick={()=>setView('kasi')}>KASI</button>
        <button onClick={()=>setView('court')}>COURT</button>
        <button onClick={()=>setView('plane')}>PLANE O.R → CHINA</button>
        <button onClick={()=>setView('funeral')}>DIE (Test Funeral)</button>
      </div>
      {view==='plane' && <PlanePUBG />}
      {view==='court' && <CourtSlot />}
      {view==='funeral' && <Funeral family={family} />}
      {view==='kasi' && <div>Your shack in {family.zone} — parents say "Go school!"</div>}
    </div>
  )
    }
