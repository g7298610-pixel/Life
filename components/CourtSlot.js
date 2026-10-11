"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'

export default function CourtSlot(){
  return (
    <div style={{width:'100%',height:'100vh',background:'#0e0e0e'}}>
      <Canvas camera={{position:[0,3,6]}}>
        <ambientLight intensity={0.8}/>
        <directionalLight position={[5,10,5]} intensity={1.2} castShadow/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[20,20]}/><meshStandardMaterial color="#5a3a20"/></mesh>
        <mesh position={[0,1,-4]}><boxGeometry args={[7,2,1]}/><meshStandardMaterial color="#3e2723"/></mesh>
        <mesh position={[0,2.2,-4]}><boxGeometry args={[2,0.8,1.2]}/><meshStandardMaterial color="#FFD700"/></mesh>
        <ContactShadows opacity={0.5} scale={20}/>
        <OrbitControls/>
      </Canvas>
      <div style={{position:'absolute',top:20,left:20,color:'#fff'}}>⚖️ GA-RANKUWA HIGH COURT - A22936 CASE</div>
    </div>
  )
  }
