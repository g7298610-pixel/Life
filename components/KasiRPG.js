"use client"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { useRef, useState } from 'react'

function Player({pos}){
  const ref=useRef()
  useFrame(()=>{ if(ref.current){ ref.current.position.x=pos.x; ref.current.position.z=pos.z } })
  return (
    <mesh ref={ref} position={[0,0.8,0]}>
      <capsuleGeometry args={[0.4,1,4,8]} />
      <meshStandardMaterial color="#ffcc00" />
    </mesh>
  )
}

export default function KasiRPG({zone}){
  const [player,setPlayer]=useState({x:0,z:5})
  const move = (dx,dz) => setPlayer(v=>({x:v.x+dx, z:v.z+dz}))
  return (
    <div style={{height:'75vh', width:'100%', position:'relative', background:'#000'}}>
      <Canvas shadows camera={{position:[8,6,10], fov:60}}>
        <Sky sunPosition={[10,10,5]} />
        <ambientLight intensity={0.6}/><directionalLight position={[10,10,5]} intensity={1}/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[100,100]} /><meshStandardMaterial color="#3a3a3a" /></mesh>
        <mesh position={[0,1,0]}><boxGeometry args={[2.2,2,2.5]} /><meshStandardMaterial color="#8B4513" /></mesh>
        <mesh position={[5,1,2]}><boxGeometry args={[2,2,2]} /><meshStandardMaterial color="#654321" /></mesh>
        <mesh position={[-4,1,-3]}><boxGeometry args={[2,2,2]} /><meshStandardMaterial color="#7a5a3a" /></mesh>
        <mesh position={[8,0.5,8]}><boxGeometry args={[2,1,4]} /><meshStandardMaterial color="white" /></mesh>
        <Player pos={player}/>
        <OrbitControls target={[player.x,0,player.z]} maxPolarAngle={Math.PI/2.1}/>
      </Canvas>
      <div style={{position:'absolute', bottom:20, left:10, right:10, display:'flex', justifyContent:'space-between'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,50px)',gap:5}}>
          <div/><button onTouchStart={()=>move(0,-0.5)} onMouseDown={()=>move(0,-0.5)}>▲</button><div/>
          <button onTouchStart={()=>move(-0.5,0)} onMouseDown={()=>move(-0.5,0)}>◀</button>
          <button onTouchStart={()=>move(0,0.5)} onMouseDown={()=>move(0,0.5)}>▼</button>
          <button onTouchStart={()=>move(0.5,0)} onMouseDown={()=>move(0.5,0)}>▶</button>
        </div>
        <div><button style={{background:'#ff0'}}>🚕 TAXI TO OR TAMBO</button></div>
      </div>
      <div style={{position:'absolute', top:10, left:10, background:'rgba(0,0,0,0.7)', padding:8, borderRadius:8, fontSize:12}}>
        {zone} | Joystick to walk — GTA style
      </div>
    </div>
  )
  }
