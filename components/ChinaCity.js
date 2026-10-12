"use client"
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function Pagoda({ x, z }){
  return (
    <group position={[x,0,z]}>
      <mesh position={[0,1,0]} castShadow><boxGeometry args={[6,2,6]}/><meshStandardMaterial color="#c62828"/></mesh>
      <mesh position={[0,2.8,0]} castShadow><boxGeometry args={[5,1.5,5]}/><meshStandardMaterial color="#8d6e63"/></mesh>
      <mesh position={[0,4.2,0]} castShadow><coneGeometry args={[4,2,4]}/><meshStandardMaterial color="#ffb300"/></mesh>
      <mesh position={[0,5.5,0]}><coneGeometry args={[0.5,1,8]}/><meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5}/></mesh>
    </group>
  )
}

function DragonGate({ x, z }){
  return (
    <group position={[x,0,z]}>
      <mesh position={[-2,2,0]}><boxGeometry args={[0.5,4,0.5]}/><meshStandardMaterial color="#b71c1c"/></mesh>
      <mesh position={[2,2,0]}><boxGeometry args={[0.5,4,0.5]}/><meshStandardMaterial color="#b71c1c"/></mesh>
      <mesh position={[0,3.5,0]}><boxGeometry args={[5,0.5,0.5]}/><meshStandardMaterial color="#ffd700"/></mesh>
    </group>
  )
}

export default function ChinaCity({ onBack }){
  return (
    <div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative'}}>
      <Canvas shadows camera={{position:[0,8,12],fov:60}} style={{background:'linear-gradient(#87CEEB, #e0f6ff)'}}>
        <ambientLight intensity={1.2}/>
        <directionalLight castShadow position={[10,20,10]} intensity={2} />
        <directionalLight position={[-10,10,-10]} intensity={0.8} />
        
        {/* BRIGHT GROUND */}
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[200,200]}/>
          <meshStandardMaterial color="#a8d5a2"/>
        </mesh>

        {/* ROAD TO SHOP */}
        <mesh position={[0,0.02,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[8,100]}/>
          <meshStandardMaterial color="#d7ccc8"/>
        </mesh>

        {/* PAGODAS ALONG ROAD - like Kasi houses but China style */}
        <Pagoda x={-10} z={-10} />
        <Pagoda x={10} z={-5} />
        <Pagoda x={-12} z={10} />
        <Pagoda x={12} z={15} />
        <Pagoda x={-10} z={30} />
        <Pagoda x={10} z={35} />

        <DragonGate x={0} z={50} />

        {/* GREEN HOUSE = AIRPORT BACK */}
        <group position={[0,0,60]}>
          <mesh position={[0,1,0]} castShadow><boxGeometry args={[10,2,10]}/><meshStandardMaterial color="#2e7d32" emissive="#00ff00" emissiveIntensity={0.4}/></mesh>
          <mesh position={[0,3,0]}><boxGeometry args={[8,2,6]}/><meshStandardMaterial color="#1b5e20"/></mesh>
        </group>
      </Canvas>

      <div style={{position:'absolute',top:12,left:12,background:'rgba(0,0,0,0.7)',color:'white',padding:'10px 14px',borderRadius:12}}>
        <div style={{fontWeight:'900'}}>🏮 ZHANGJIAJIE - CHINA</div>
        <div style={{fontSize:12}}>Bright City V1 - Our China</div>
      </div>

      <button onClick={onBack} style={{position:'absolute',top:12,right:12,padding:'12px 20px',background:'white',color:'black',fontWeight:'900',borderRadius:12,border:'none',boxShadow:'0 4px 10px rgba(0,0,0,0.3)'}}>BACK TO KASI</button>
    </div>
  )
    }
