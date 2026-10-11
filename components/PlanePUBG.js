"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useState, Suspense } from 'react'

function LuxuryCabinAAA(){
  return (
    <group>
      <Environment preset="city" />
      {/* Purple mood like your photo */}
      <pointLight intensity={2} color="#8a5cff" position={[0,2,0]} distance={12}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.2,0]}>
        <planeGeometry args={[8,40]} />
        <meshStandardMaterial color="#151525" roughness={0.2} metalness={0.6}/>
      </mesh>
      {/* Walls glossy */}
      <mesh position={[-3,1,0]}><boxGeometry args={[0.3,4.5,36]}/><meshStandardMaterial color="#f2f2f8" roughness={0.1} metalness={0.1}/></mesh>
      <mesh position={[3,1,0]}><boxGeometry args={[0.3,4.5,36]}/><meshStandardMaterial color="#f2f2f8" roughness={0.1} metalness={0.1}/></mesh>
      {/* 16 luxury pods - high detail */}
      {[...Array(12)].map((_,i)=>{
        const z=-14+i*2.8
        return (
          <group key={i} position={[0,0,z]}>
            <mesh position={[-1.4,0.5,0]} castShadow><boxGeometry args={[1.5,0.2,2.4]}/><meshStandardMaterial color="#e8e8f0" roughness={0.3} metalness={0.2}/></mesh>
            <mesh position={[-1.4,0.9,0]} castShadow><boxGeometry args={[1.3,0.8,2]}/><meshStandardMaterial color="#d4d4e0" roughness={0.4}/></mesh>
            <mesh position={[1.4,0.5,0]} castShadow><boxGeometry args={[1.5,0.2,2.4]}/><meshStandardMaterial color="#e8e8f0" roughness={0.3}/></mesh>
            <mesh position={[1.4,0.9,0]} castShadow><boxGeometry args={[1.3,0.8,2]}/><meshStandardMaterial color="#d4d4e0" roughness={0.4}/></mesh>
            <mesh position={[-2.9,1.3,0]}><circleGeometry args={[0.25,16]}/><meshStandardMaterial color="#7ec8ff" emissive="#7ec8ff" emissiveIntensity={0.6}/></mesh>
          </group>
        )
      })}
      <ContactShadows position={[0,-1.19,0]} opacity={0.6} scale={10} blur={2}/>
    </group>
  )
}

function RealPlaneAAA(){
  return (
    <group>
      <Environment preset="sunset"/>
      <group scale={0.8} position={[0,0,0]}>
        <mesh castShadow position={[0,0,0]} rotation={[0,0,Math.PI/2]}>
          <capsuleGeometry args={[1.2,12,8,16]}/>
          <meshStandardMaterial color="white" roughness={0.1} metalness={0.2}/>
        </mesh>
        <mesh castShadow position={[0,0,-6.5]}><sphereGeometry args={[1.2,16,16,0,6.28,0,1.5]}/><meshStandardMaterial color="#111" roughness={0.2} metalness={0.8}/></mesh>
        <group position={[0,-0.3,0]}>
          <mesh castShadow><boxGeometry args={[16,0.3,3.8]}/><meshStandardMaterial color="white" roughness={0.2} metalness={0.3}/></mesh>
          <mesh position={[8,0.6,0]} rotation={[0,0,-0.6]}><boxGeometry args={[0.2,1.8,1.2]}/><meshStandardMaterial color="white"/></mesh>
          <mesh position={[-8,0.6,0]} rotation={[0,0,0.6]}><boxGeometry args={[0.2,1.8,1.2]}/><meshStandardMaterial color="white"/></mesh>
        </group>
        <mesh position={[2.2,-0.9,1]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.7,0.7,2.2,24]}/><meshStandardMaterial color="#222" metalness={0.7} roughness={0.2}/></mesh>
        <mesh position={[-2.2,-0.9,1]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.7,0.7,2.2,24]}/><meshStandardMaterial color="#222" metalness={0.7} roughness={0.2}/></mesh>
        <mesh position={[0,1.8,6.5]}><boxGeometry args={[0.3,3.5,2.8]}/><meshStandardMaterial color="white" roughness={0.2}/></mesh>
        <mesh position={[0,0.4,7.2]}><boxGeometry args={[6,0.25,1.8]}/><meshStandardMaterial color="white" roughness={0.2}/></mesh>
      </group>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-5,0]} receiveShadow><planeGeometry args={[500,500]}/><meshStandardMaterial color="#c9a86a" roughness={1}/></mesh>
      <ContactShadows position={[0,-4.9,0]} scale={50} blur={3} opacity={0.5}/>
    </group>
  )
}

export default function PlanePUBG(){
  const [mode,setMode]=useState('inside')
  return (
    <div style={{height:'85vh', background:'#000'}}>
      <div style={{padding:10,display:'flex',gap:8,background:'#0a0a0a',color:'#fff'}}>
        <button onClick={()=>setMode(m=>m==='inside'?'outside':'inside')} style={{background:'#fff',color:'#000',padding:'10px 16px',borderRadius:10,fontWeight:'bold'}}>
          {mode==='inside'?'✈️ SHOW REAL PLANE':'💺 SHOW LUXURY CABIN'}
        </button>
        <span style={{fontSize:11,paddingTop:8,opacity:0.7}}>{mode==='inside'?'AAA - glossy leather + purple light':'AAA - white gloss + metal engines'}</span>
      </div>
      <Canvas shadows camera={{position:mode==='inside'?[0,1.8,3.5]:[10,6,10], fov:50}}>
        <ambientLight intensity={0.6}/>
        <directionalLight position={[10,15,10]} intensity={1.5} castShadow shadow-mapSize={2048}/>
        <Suspense fallback={null}>{mode==='inside'?<LuxuryCabinAAA/>:<RealPlaneAAA/>}</Suspense>
        <OrbitControls enablePan={false} minDistance={2} maxDistance={40}/>
      </Canvas>
    </div>
  )
          }
