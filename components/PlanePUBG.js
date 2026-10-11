"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useState } from 'react'

function PlaneFixed(){
  return (
    <group position={[0,0.5,0]}>
      {/* FUSELAGE - now lying flat, not standing */}
      <mesh position={[0,0,0]} rotation={[Math.PI/2,0,0]} castShadow>
        <capsuleGeometry args={[0.9,6.5,4,24]} />
        <meshStandardMaterial color="white" roughness={0.15} metalness={0.3} />
      </mesh>
      {/* NOSE */}
      <mesh position={[0,0,-4]} castShadow>
        <sphereGeometry args={[0.9,16,16]} />
        <meshStandardMaterial color="black" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* WINGS attached */}
      <mesh position={[0,-0.4,0]} castShadow>
        <boxGeometry args={[11,0.2,2.5]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      {/* ENGINES */}
      <mesh position={[2.3,-0.8,0]} rotation={[0,0,Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.45,0.45,1.6,20]} />
        <meshStandardMaterial color="#111" metalness={0.9} />
      </mesh>
      <mesh position={[-2.3,-0.8,0]} rotation={[0,0,Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.45,0.45,1.6,20]} />
        <meshStandardMaterial color="#111" metalness={0.9} />
      </mesh>
      {/* TAIL */}
      <mesh position={[0,0.8,3.5]} castShadow>
        <boxGeometry args={[0.2,1.8,1.6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <ContactShadows position={[0,-1.5,0]} scale={15} opacity={0.6} blur={2} />
    </group>
  )
}

function CabinFixed(){
  return(
    <group>
      <pointLight color="#9d5cff" intensity={4} distance={10} position={[0,2,0]}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1,0]}><planeGeometry args={[4.5,22]}/><meshStandardMaterial color="#10102a" metalness={0.8} roughness={0.2}/></mesh>
      {[...Array(10)].map((_,i)=><mesh key={i} position={[-0.9,0.2,-8+i*1.8]}><boxGeometry args={[0.9,0.3,1.4]}/><meshStandardMaterial color="#e6e0d5"/></mesh>)}
      {[...Array(10)].map((_,i)=><mesh key={i} position={[0.9,0.2,-8+i*1.8]}><boxGeometry args={[0.9,0.3,1.4]}/><meshStandardMaterial color="#e6e0d5"/></mesh>)}
    </group>
  )
}

export default function PlanePUBG(){
  const [mode,setMode]=useState('plane')
  return(
    <div style={{height:'85vh',background:'#000'}}>
      <button onClick={()=>setMode(mode==='plane'?'cabin':'plane')} style={{margin:12,padding:12,borderRadius:12,background:'#fff',fontWeight:'bold'}}>{mode==='plane'?'SHOW PURPLE CABIN':'SHOW REAL PLANE'}</button>
      <Canvas shadows camera={{position:[6,3,6],fov:50}}><ambientLight intensity={1}/><directionalLight position={[5,10,5]} intensity={2} castShadow/><Environment preset="city"/>{mode==='plane'?<PlaneFixed/>:<CabinFixed/>}<OrbitControls/></Canvas>
    </div>
  )
        }
