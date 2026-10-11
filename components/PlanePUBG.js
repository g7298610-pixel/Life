"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useState } from 'react'

function RealPlane(){
  return (
    <group>
      {/* Body glossy white */}
      <mesh position={[0,0,0]} rotation={[0,0,Math.PI/2]} castShadow>
        <capsuleGeometry args={[1.1,7,12,24]}/>
        <meshStandardMaterial color="white" metalness={0.2} roughness={0.1}/>
      </mesh>
      {/* Nose black */}
      <mesh position={[0,0,-4]}><sphereGeometry args={[1.1,16,16,0,6.28,0,1.5]}/><meshStandardMaterial color="black" metalness={0.8} roughness={0.1}/></mesh>
      {/* Wings */}
      <mesh position={[0,-0.2,0]} castShadow><boxGeometry args={[16,0.25,3.5]}/><meshStandardMaterial color="white" metalness={0.2} roughness={0.1}/></mesh>
      {/* 2 Engines metal */}
      <mesh position={[2.5,-0.8,0.3]} rotation={[0,0,1.57]} castShadow><cylinderGeometry args={[0.65,0.65,2]}/><meshStandardMaterial color="#222" metalness={0.9} roughness={0.2}/></mesh>
      <mesh position={[-2.5,-0.8,0.3]} rotation={[0,0,1.57]} castShadow><cylinderGeometry args={[0.65,0.65,2]}/><meshStandardMaterial color="#222" metalness={0.9} roughness={0.2}/></mesh>
      {/* Tail */}
      <mesh position={[0,1.5,4]} castShadow><boxGeometry args={[0.25,3,2.5]}/><meshStandardMaterial color="white"/></mesh>
    </group>
  )
}
function RealCabin(){
  return(
    <group>
      <pointLight color="#8a5cff" intensity={2.5} position={[0,2,-2]} distance={12}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1,0]}><planeGeometry args={[5,28]}/><meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.2}/></mesh>
      {[...Array(10)].map((_,i)=>{
        const z=-10+i*2.4
        return <group key={i} position={[0,0,z]}>
          <mesh position={[-1,0.4,0]}><boxGeometry args={[1,0.15,1.8]}/><meshStandardMaterial color="#e8e0d0" roughness={0.3}/></mesh>
          <mesh position={[1,0.4,0]}><boxGeometry args={[1,0.15,1.8]}/><meshStandardMaterial color="#e8e0d0" roughness={0.3}/></mesh>
        </group>
      })}
    </group>
  )
}
export default function PlanePUBG(){
  const [mode,setMode]=useState('plane')
  return(
    <div style={{height:'85vh',background:'#000'}}>
      <button onClick={()=>setMode(mode==='plane'?'cabin':'plane')} style={{margin:10,padding:'12px 18px',borderRadius:12,background:'#fff',fontWeight:'bold'}}>{mode==='plane'?'SHOW PURPLE CABIN':'SHOW REAL PLANE'}</button>
      <Canvas shadows camera={{position:[7,4,7],fov:50}}><ambientLight intensity={0.7}/><directionalLight position={[10,10,5]} intensity={2} castShadow/><Environment preset="city"/>{mode==='plane'?<RealPlane/>:<RealCabin/>}<OrbitControls/></Canvas>
    </div>
  )
        }
