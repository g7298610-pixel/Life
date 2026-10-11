"use client"
import { useState } from 'react'
import CourtSlot from '../components/CourtSlot'
import PlanePUBG from '../components/PlanePUBG'
import KasiRPG from '../components/KasiRPG'
import { rollFamily } from '../lib/familyLottery'

export default function Home(){
  const [family,setFamily]=useState(null)
  const [view,setView]=useState('kasi')

  if(!family){
    return(
      <div style={{padding:30,textAlign:'center',minHeight:'100vh',background:'#000',color:'#fff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <h1 style={{fontSize:40}}>KASI LIFE 0288 V2</h1>
        <p>Blind Birth - Real RPG GTA x PUBG</p>
        <button onClick={()=>setFamily(rollFamily())} style={{padding:20,fontSize:20,background:'#fff',color:'#000',borderRadius:12,margin:'20px auto',width:'90%',maxWidth:400}}>
          BORN IN GA-RANKUWA
        </button>
      </div>
    )
  }

  return(
    <div style={{background:'#0a0a0a',color:'#fff',minHeight:'100vh'}}>
      <div style={{padding:10,display:'flex',gap:8,flexWrap:'wrap',background:'#111',alignItems:'center'}}>
        <span style={{fontSize:12}}>Born: {family.zone} | {family.surname}</span>
        <button onClick={()=>setView('kasi')} style={{background:view==='kasi'?'#fff':'#333',color:view==='kasi'?'#000':'#fff'}}>KASI 3D</button>
        <button onClick={()=>setView('court')} style={{background:view==='court'?'#fff':'#333',color:view==='court'?'#000':'#fff'}}>COURT</button>
        <button onClick={()=>setView('plane')} style={{background:view==='plane'?'#fff':'#333',color:view==='plane'?'#000':'#fff'}}>PLANE → CHINA</button>
      </div>
      {view==='plane' && <PlanePUBG/>}
      {view==='court' && <CourtSlot/>}
      {view==='kasi' && <KasiRPG zone={family.zone}/>}
    </div>
  )
    }
