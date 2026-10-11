"use client"
import { useState } from 'react'
export default function PlanePUBG({onLandChina}){
  const [jumped,setJumped]=useState(false)
  if(jumped) return (
    <div style={{height:'100vh',background:'linear-gradient(#87CEEB,#000)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff'}}>
      <h1 style={{fontSize:50}}>🪂 PARACHUTE</h1>
      <p>Falling to China...</p>
      <button onClick={onLandChina} style={{marginTop:20,padding:15,background:'#fff',color:'#000',borderRadius:10}}>LAND IN CHINA 🇨🇳</button>
    </div>
  )
  return (
    <div style={{height:'100vh',background:'#0a0a0a',color:'#fff',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,width:'100%',height:60,background:'#222',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px'}}>
        <span>HAL 9301 → ZHANGJIAJIE</span><span style={{color:'#0f0'}}>● LIVE</span>
      </div>
      <div style={{marginTop:80,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{width:'90%',maxWidth:500,height:300,background:'linear-gradient(#333,#111)',borderRadius:20,position:'relative',border:'2px solid #555'}}>
          <div style={{position:'absolute',left:10,top:20,width:20,height:260,background:'#444',borderRadius:10}}/>
          <div style={{position:'absolute',right:10,top:20,width:20,height:260,background:'#444',borderRadius:10}}/>
          <p style={{textAlign:'center',marginTop:120}}>✈️ Inside HAL - Cabin lights on</p>
        </div>
        <button onClick={()=>setJumped(true)} style={{marginTop:30,padding:'20px 40px',background:'#ff0000',color:'#fff',fontSize:20,borderRadius:12,fontWeight:'bold'}}>JUMP (F)</button>
      </div>
    </div>
  )
    }
