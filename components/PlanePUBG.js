"use client"
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Cabin(){
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1,0]}>
        <planeGeometry args={[6,20]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Seats */}
      {[...Array(6)].map((_,i)=>(
        <mesh key={i} position={[-1,0,-5+i*2]}>
          <boxGeometry args={[1,1,1]} />
          <meshStandardMaterial color="#4444ff" />
        </mesh>
      ))}
      {[...Array(6)].map((_,i)=>(
        <mesh key={i+'r'} position={[1,0,-5+i*2]}>
          <boxGeometry args={[1,1,1]} />
          <meshStandardMaterial color="#4444ff" />
        </mesh>
      ))}
    </>
  )
}

function OutsidePlane(){
  return (
    <>
      <mesh>
        <boxGeometry args={[3,0.8,12]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0,0,-8]}>
        <planeGeometry args={[50,50]} />
        <meshStandardMaterial color="#e0c080" />
      </mesh>
    </>
  )
}

export default function PlanePUBG(){
  const [mode,setMode]=useState('inside')
  return(
    <div style={{height:'75vh', width:'100%', background:'#000'}}>
      <div style={{padding:10, display:'flex', gap:10, background:'#111'}}>
        <button onClick={()=>setMode(mode==='inside'?'outside':'inside')} style={{background:'#fff', padding:12}}>
          {mode==='inside'?'OUTSIDE VIEW ✈️':'INSIDE VIEW 💺'}
        </button>
        <span style={{color:'#fff', padding:10}}>
          {mode==='inside'?'Seat 12B - Real passengers':'PUBG cam - Sahara → China'}
        </span>
      </div>

      <Canvas camera={{position:mode==='inside'?[0,3,5]:[10,8,10]}}>
        <ambientLight intensity={0.7}/>
        <directionalLight position={[5,10,5]} intensity={1}/>
        {mode==='inside'?<Cabin/>:<OutsidePlane/>}
        <OrbitControls />
      </Canvas>
      
      <p style={{textAlign:'center', color:'#aaa'}}>
        {mode==='inside'?'DRAG to look around cabin - 8 min flight':'DRAG to rotate like PUBG - Real Earth below'}
      </p>
    </div>
  )
        }
