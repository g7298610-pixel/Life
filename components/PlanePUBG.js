"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useState } from 'react'

function PlaneFixed(){
  return (
    <group position={[0,0,0]}>
      {/* FUSELAGE - solid one piece */}
      <group>
        <mesh position={[0,0,0]} rotation={[0,0,0]}>
          <capsuleGeometry args={[0.9,6.5,4,16]} />
          <meshStandardMaterial color="white" roughness={0.15} metalness={0.3} />
        </mesh>
        {/* NOSE black */}
        <mesh position={[0,0,-3.8]} rotation={[Math.PI/2,0,0]}>
          <sphereGeometry args={[0.9,16,16,0,6.28,0,1.57]} />
          <meshStandardMaterial color="black" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* WINGS - attached to body */}
        <mesh position={[0,-0.5,0]}>
          <boxGeometry args={[10,0.2,2.2]} />
          <meshStandardMaterial color="white" roughness={0.2} />
        </mesh>
        {/* ENGINES under wings */}
        <mesh position={[2.2,-0.9,0]} rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.4,0.4,1.5,16]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        <mesh position={[-2.2,-0.9,0]} rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.4,0.4,1.5,16]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        {/* TAIL FIN - attached to back, not floating */}
        <mesh position={[0,1.2,3.2]}>
          <boxGeometry args={[0.2,1.8,1.6]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
      <ContactShadows position={[0,-1.5,0]} scale={20} opacity={0.6} blur={2} />
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
      <Canvas shadows camera={{position:[5,3,5],fov:50}}><ambientLight intensity={1}/><directionalLight position={[5,10,5]} intensity={2} castShadow/><Environment preset="city"/><group position={[0,0.5,0]}>{mode==='plane'?<PlaneFixed/>:<CabinFixed/>}</group><OrbitControls/></Canvas>
    </div>
  )
          }
