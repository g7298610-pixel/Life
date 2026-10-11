"use client"
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'

function RealExterior(){
  return (
    <group>
      {/* Fuselage */}
      <mesh position={[0,0,2]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[1,1.1,14,32]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      <mesh position={[0,0,9]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.2,1,2,32]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      {/* Cockpit / Nose */}
      <mesh position={[0,0,-5.5]}>
        <sphereGeometry args={[1.1,32,16,0,Math.PI*2,0,Math.PI/2]} />
        <meshStandardMaterial color="#d0e8ff" />
      </mesh>
      {/* Wing - with winglet like diagram */}
      <group position={[0,-0.5,0]}>
        <mesh position={[0,0,0]} rotation={[0,0,0.1]}>
          <boxGeometry args={[12,0.25,3.5]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>
        {/* Winglet */}
        <mesh position={[6,0.8,0]} rotation={[0,0,-0.4]}>
          <boxGeometry args={[0.15,1.5,1]} />
          <meshStandardMaterial color="#a0c8e0" />
        </mesh>
        <mesh position={[-6,0.8,0]} rotation={[0,0,0.4]}>
          <boxGeometry args={[0.15,1.5,1]} />
          <meshStandardMaterial color="#a0c8e0" />
        </mesh>
      </group>
      {/* Engines */}
      <mesh position={[2.5,-0.8,1]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.6,0.6,2,24]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-2.5,-0.8,1]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.6,0.6,2,24]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Vertical Stabilizer + Rudder */}
      <mesh position={[0,1.5,6.5]} rotation={[0,0,0]}>
        <boxGeometry args={[0.2,3,2.5]} />
        <meshStandardMaterial color="#a0c8e0" />
      </mesh>
      {/* Horizontal Stabilizer + Elevator - Empennage */}
      <group position={[0,0.3,7]}>
        <mesh><boxGeometry args={[5,0.15,1.2]} /><meshStandardMaterial color="#c0c0c0" /></mesh>
      </group>
      {/* Ground - Sahara to China */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-4,0]}>
        <planeGeometry args={[300,300]} />
        <meshStandardMaterial color="#d8b88a" />
      </mesh>
    </group>
  )
}

function LuxuryCabin(){
  return (
    <group>
      {/* Purple ambient like 2nd photo */}
      <ambientLight intensity={0.8} color="#9b59ff" />
      <pointLight position={[0,3,0]} intensity={2} color="#9b59ff" distance={20} />
      <pointLight position={[0,3,-10]} intensity={1.5} color="#6a5cff" distance={15} />

      {/* Floor dark */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.2,0]}>
        <planeGeometry args={[8,35]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Ceiling with star lights like photo */}
      <mesh rotation={[Math.PI/2,0,0]} position={[0,3.2,0]}>
        <planeGeometry args={[6,30]} />
        <meshStandardMaterial color="#2a2a4a" emissive="#6a5cff" emissiveIntensity={0.3} />
      </mesh>
      {/* Side walls with windows */}
      <mesh position={[-2.8,0.5,0]}><boxGeometry args={[0.2,4,32]} /><meshStandardMaterial color="#e6e6f0" /></mesh>
      <mesh position={[2.8,0.5,0]}><boxGeometry args={[0.2,4,32]} /><meshStandardMaterial color="#e6e6f0" /></mesh>

      {/* Business class seats - like 2nd image - gray purple luxury */}
      {[...Array(8)].map((_,i)=>{
        const z = -12 + i*3.2
        return (
          <group key={i}>
            {/* Left pod */}
            <group position={[-1.5,0,z]}>
              <mesh position={[0,0.4,0]}><boxGeometry args={[1.4,1.1,2.2]} /><meshStandardMaterial color="#d8d8e0" /></mesh>
              <mesh position={[0,1.1,0]}><boxGeometry args={[1.2,0.4,1]} /><meshStandardMaterial color="#e8e8ee" /></mesh>
              {/* side wall */}
              <mesh position={[-0.8,0.6,0]}><boxGeometry args={[0.1,1.2,2.2]} /><meshStandardMaterial color="#b8b8c8" /></mesh>
            </group>
            {/* Right pod */}
            <group position={[1.5,0,z]}>
              <mesh position={[0,0.4,0]}><boxGeometry args={[1.4,1.1,2.2]} /><meshStandardMaterial color="#d8d8e0" /></mesh>
              <mesh position={[0,1.1,0]}><boxGeometry args={[1.2,0.4,1]} /><meshStandardMaterial color="#e8e8ee" /></mesh>
              <mesh position={[0.8,0.6,0]}><boxGeometry args={[0.1,1.2,2.2]} /><meshStandardMaterial color="#b8b8c8" /></mesh>
            </group>
            {/* Windows */}
            <mesh position={[-2.7,1.2,z]}><planeGeometry args={[0.3,0.4]} /><meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} /></mesh>
            <mesh position={[2.7,1.2,z]}><planeGeometry args={[0.3,0.4]} /><meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} /></mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function PlanePUBG(){
  const [mode,setMode]=useState('inside')
  return(
    <div style={{height:'82vh', width:'100%', background:'#000'}}>
      <div style={{padding:10, display:'flex', gap:8, background:'#111', alignItems:'center'}}>
        <button onClick={()=>setMode(mode==='inside'?'outside':'inside')} style={{background:'#fff', padding:'10px 16px', borderRadius:8, fontWeight:'bold'}}>
          {mode==='inside'?'✈️ EXTERIOR - See Parts':'💺 LUXURY CABIN - Purple'}
        </button>
        <span style={{color:'#aaa', fontSize:11}}>
          {mode==='inside'?'Business class - star ceiling - like your photo':'Winglet | Fuselage | Engine | Empennage - HAL diagram'}
        </span>
      </div>

      <Canvas camera={{position:mode==='inside'?[0,2,4]:[14,7,8], fov:55}}>
        <ambientLight intensity={0.9}/>
        <directionalLight position={[10,15,10]} intensity={1.2}/>
        {mode==='inside'?<LuxuryCabin/>:<RealExterior/>}
        <OrbitControls enablePan={false} minDistance={2} maxDistance={30} />
      </Canvas>
      
      <div style={{textAlign:'center', color:'#888', fontSize:11, padding:6}}>
        {mode==='inside'?'DRAG to look - purple business cabin - 8 min to China':'DRAG to rotate - Real Boeing - Winglet + Empennage + Engine visible'}
      </div>
    </div>
  )
        }
