"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'

function Shack({pos}){
  return (
    <mesh position={pos}>
      <boxGeometry args={[2,2,2]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  )
}

export default function KasiRPG(){
  const [walking,setWalking]=useState(false)
  return (
    <div style={{height:'70vh', width:'100%'}}>
      <Canvas camera={{position:[5,5,10]}}>
        <ambientLight intensity={0.5}/>
        <directionalLight position={[10,10,5]}/>
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1,0]}>
          <planeGeometry args={[50,50]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <Shack pos={[0,0,0]} />
        <Shack pos={[4,0,2]} />
        <Shack pos={[-3,0,-2]} />
        <mesh position={[0,0.5,5]}>
          <capsuleGeometry args={[0.5,1,4,8]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
        <OrbitControls />
      </Canvas>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:10}}>
        <button onTouchStart={()=>setWalking(true)} onTouchEnd={()=>setWalking(false)} style={{padding:20,background:'#fff',borderRadius:50}}>🕹️ HOLD TO WALK</button>
        <button style={{padding:15}}>ENTER COURT 🏛️</button>
        <button style={{padding:15}}>TAXI TO OR TAMBO ✈️</button>
      </div>
      <p style={{textAlign:'center'}}>{walking?'Walking in Zone 16...':'Idle - you in RDP'}</p>
    </div>
  )
  }
