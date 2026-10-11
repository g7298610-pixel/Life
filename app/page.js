"use client"
import { useState } from 'react'
import CourtSlot from '../components/CourtSlot'
import PlanePUBG from '../components/PlanePUBG'
import { rollFamily } from '../lib/familyLottery'

export default function Home(){
  const [family,setFamily]=useState(null)
  const [view,setView]=useState('kasi')

  if(!family){
    return(
      <div style={{padding:30,textAlign:'center',minHeight:'100vh',background:'#000',color:'#fff'}}>
        <h1>KASI LIFE 0288 V1</h1>
        <p>Blind Birth - You dont know rich or poor</p>
        <button onClick={()=>setFamily(rollFamily())} style={{padding:20,fontSize:20,background:'#fff',color:'#000',borderRadius:12}}>
          BORN IN GA-RANKUWA
        </button>
      </div>
    )
  }

  return(
    <div style={{padding:15,background:'#0a0a0a',color:'#fff',minHeight:'100vh'}}>
      <h3>Born: {family.zone} | {family.surname} | {family.buff}</h3>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:15}}>
        <button onClick={()=>setView('kasi')} style={{padding:10}}>KASI</button>
        <button onClick={()=>setView('court')} style={{padding:10}}>COURT</button>
        <button onClick={()=>setView('plane')} style={{padding:10}}>PLANE OR → CHINA</button>
      </div>
      {view==='plane' && <PlanePUBG/>}
      {view==='court' && <CourtSlot/>}
      {view==='kasi' && <div style={{marginTop:20,border:'1px solid #333',padding:20}}>Your shack in {family.zone} - parents bot says: Go school!</div>}
    </div>
  )
    }
