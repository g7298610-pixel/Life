"use client"
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, ContactShadows } from '@react-three/drei'

function RealRDP({pos}){
  return (
    <group position={pos}>
      <mesh position={[0,0.1,0]} receiveShadow><boxGeometry args={[5,0.2,6]}/><meshStandardMaterial color="#222"/></mesh>
      <mesh position={[0,1.1,0]} castShadow receiveShadow><boxGeometry args={[4.8,2.2,5.5]}/><meshStandardMaterial color="#d8c9b0" roughness={0.9}/></mesh>
      <mesh position={[0,2.45,0]} castShadow><boxGeometry args={[5.3,0.2,6.2]}/><meshStandardMaterial color="#b71c1c" metalness={0.3} roughness={0.4}/></mesh>
      <mesh position={[0,0.9,2.76]}><boxGeometry args={[1,1.8,0.1]}/><meshStandardMaterial color="#3e2723"/></mesh>
      <mesh position={[-1.2,1.2,2.77]}><boxGeometry args={[0.9,0.9,0.05]}/><meshStandardMaterial color="#90caf9" metalness={0.9}/></mesh>
    </group>
  )
}

function Player({move, yaw}){
  const ref=useRef()
  useFrame((_,d)=>{
    if(!ref.current) return
    const s=4
    // move relative to yaw
    const fx = Math.sin(yaw) * move.y + Math.cos(yaw) * move.x
    const fz = Math.cos(yaw) * move.y - Math.sin(yaw) * move.x
    ref.current.position.x += fx * s * d
    ref.current.position.z += fz * s * d
    ref.current.rotation.y = yaw
  })
  return <mesh ref={ref} position={[0,1,0]} castShadow><capsuleGeometry args={[0.35,1,4,8]}/><meshStandardMaterial color="#111"/></mesh>
}

export default function KasiRPG({zone, onGoPlane}){
  const [move,setMove]=useState({x:0,y:0})
  const [yaw,setYaw]=useState(0)

  useEffect(()=>{
    const L=document.getElementById('joyL'), R=document.getElementById('joyR')
    let sx=0,sy=0, lx=0
    const ls=(e)=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY }
    const lm=(e)=>{
      let dx=(e.touches[0].clientX-sx)/40, dy=(e.touches[0].clientY-sy)/40
      dx=Math.max(-1,Math.min(1,dx)); dy=Math.max(-1,Math.min(1,dy))
      setMove({x:dx,y:-dy})
    }
    const le=()=>setMove({x:0,y:0})
    const rs=(e)=>{ lx=e.touches[0].clientX }
    const rm=(e)=>{ const dx=e.touches[0].clientX-lx; setYaw(y=>y - dx*0.02); lx=e.touches[0].clientX }
    L.addEventListener('touchstart',ls); L.addEventListener('touchmove',lm); L.addEventListener('touchend',le)
    R.addEventListener('touchstart',rs); R.addEventListener('touchmove',rm)
    return()=>{ L.removeEventListener('touchstart',ls); L.removeEventListener('touchmove',lm); L.removeEventListener('touchend',le); R.removeEventListener('touchstart',rs); R.removeEventListener('touchmove',rm) }
  },[])

  return (
    <div style={{width:'100%',height:'100vh',position:'relative'}}>
      <Canvas shadows camera={{position:[0,8,10],fov:55}}>
        <Sky sunPosition={[100,20,50]} />
        <ambientLight intensity={0.7}/>
        <directionalLight castShadow position={[10,20,10]} intensity={1.3} shadow-mapSize={[2048,2048]}/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#4a3c2a"/></mesh>
        <RealRDP pos={[0,0,-10]}/><RealRDP pos={[8,0,-10]}/><RealRDP pos={[-8,0,-10]}/><RealRDP pos={[0,0,-18]}/><RealRDP pos={[8,0,-18]}/>
        <Player move={move} yaw={yaw}/>
        <ContactShadows scale={40} blur={2} opacity={0.6}/>
      </Canvas>
      <div id="joyL" style={{position:'absolute',left:15,bottom:25,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.15)',border:'2px solid rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:50,height:50,borderRadius:25,background:'#fff',transform:`translate(${move.x*30}px, ${-move.y*30}px)`}}/>
      </div>
      <div id="joyR" style={{position:'absolute',right:15,bottom:25,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.08)',border:'2px dashed rgba(255,255,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:10}}>ROTATE</div>
      <button onClick={onGoPlane} style={{position:'absolute',top:20,right:20,padding:14,background:'#fff',color:'#000',borderRadius:12,fontWeight:'bold'}}>✈️ AIRPORT</button>
    </div>
  )
    }
