"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useState } from 'react'

function Cabin(){
  return (
    <group>
      <pointLight color="#8a5cff" intensity={2} position={[0,2,0]} distance={15}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1,0]}><planeGeometry args={[6,30]}/><meshStandardMaterial color="#151528"/></mesh>
      {[...Array(8)].map((_,i)=>(
        <mesh key={i} position={[-1.2,0.4,-10+i*2.8]}><boxGeometry args={[1.2,1,2]}/><meshStandardMaterial color="#e0e0ee" roughness={0.2}/></mesh>
      ))}
      {[...Array(8)].map((_,i)=>(
        <mesh key={i} position={[1.2,0.4,-10+i*2.8]}><boxGeometry args={[1.2,1,2]}/><meshStandardMaterial color="#e0e0ee" roughness={0.2}/></mesh>
      ))}
    </group>
  )
}
function Plane(){
  return (
    <group>
      <mesh rotation={[0,0,Math.PI/2]}><capsuleGeometry args={[1,6,8,16]}/><meshStandardMaterial color="white" roughness={0.1}/></mesh>
      <mesh position={[0,-0.3,0]}><boxGeometry args={[14,0.3,3]}/><meshStandardMaterial color="white"/></mesh>
      <mesh position={[2,-0.7,0]} rotation={[0,0,1.57]}><cylinderGeometry args={[0.6,0.6,1.8]}/><meshStandardMaterial color="#222"/></mesh>
      <mesh position={[-2,-0.7,0]} rotation={[0,0,1.57]}><cylinderGeometry args={[0.6,0.6,1.8]}/><meshStandardMaterial color="#222"/></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-4,0]}><planeGeometry args={[200,200]}/><meshStandardMaterial color="#c9a86a"/></mesh>
      <ContactShadows position={[0,-3.9,0]} scale={20} blur={2} opacity={0.5}/>
    </group>
  )
}
export default function PlanePUBG(){
  const [m,setM]=useState('outside')
  return(
    <div style={{height:'80vh',background:'#000'}}>
      <button onClick={()=>setM(m==='outside'?'inside':'outside')} style={{margin:10,padding:10,borderRadius:8,background:'#fff'}}>{m==='outside'?'SHOW CABIN':'SHOW PLANE'}</button>
      <Canvas shadows camera={{position:[8,5,8]}}><ambientLight intensity={0.8}/><directionalLight position={[10,10,5]} intensity={1.5} castShadow/><Environment preset="sunset"/>{m==='outside'?<Plane/>:<Cabin/>}<OrbitControls/></Canvas>
    </div>
  )
    }
