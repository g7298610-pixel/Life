"use client"
import { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WORLD, getNearbyTrigger, generateKasiHouses, keepInsideWorld } from '../lib/protocol'
import * as THREE from 'three'

function House({ pos, side, neighborhood }){
  const rot = side===-1? Math.PI/2 : -Math.PI/2
  const yardColor = neighborhood==='unit20'? '#aed581' : neighborhood==='unit16'? '#c5e1a5' : '#81c784'
  return (
    <group position={[pos[0],0,pos[1]]} rotation={[0,rot,0]}>
      {/* Yard */}
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[6,6]}/>
        <meshStandardMaterial color={yardColor}/>
      </mesh>
      {/* House base */}
      <mesh position={[0,1.1,0]} castShadow>
        <boxGeometry args={[4.2,2.2,4.2]}/>
        <meshStandardMaterial color="#e0e0e0"/>
      </mesh>
      {/* Roof */}
      <mesh position={[0,2.4,0]} castShadow>
        <boxGeometry args={[5,0.4,5]}/>
        <meshStandardMaterial color="#b71c1c"/>
      </mesh>
      {/* Door */}
      <mesh position={[0,0.7,2.11]}>
        <boxGeometry args={[0.7,1.3,0.05]}/>
        <meshStandardMaterial color="#5d4037"/>
      </mesh>
    </group>
  )
}

function Spaza({ pos }){
  return (
    <group position={[pos[0],0,pos[1]]}>
      <mesh position={[0,1,0]} castShadow><boxGeometry args={[4,2,4]}/><meshStandardMaterial color="#ff9800"/></mesh>
      <mesh position={[0,2.2,0]}><boxGeometry args={[4.5,0.3,4.5]}/><meshStandardMaterial color="#d32f2f"/></mesh>
    </group>
  )
}

function School({ pos }){
  return (
    <group position={[pos[0],0,pos[1]]}>
      <mesh position={[0,0.05,0]} receiveShadow><boxGeometry args={[12,0.1,12]}/><meshStandardMaterial color="#90a4ae"/></mesh>
      <mesh position={[0,1.5,0]} castShadow><boxGeometry args={[12,3,6]}/><meshStandardMaterial color="#fafafa"/></mesh>
    </group>
  )
}

function Scene({houses, places}){
  return (
    <>
      <ambientLight intensity={1.1}/>
      <directionalLight castShadow position={[15,20,10]} intensity={1.4}/>
      {/* Ground */}
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[800,800]}/><meshStandardMaterial color="#d7ccc8"/></mesh>
      {/* Main St - top */}
      <mesh position={[0,0.02,-42]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[260,9]}/><meshStandardMaterial color="#212121"/></mesh>
      <mesh position={[0,0.03,-42]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[260,0.3]}/><meshStandardMaterial color="white"/></mesh>
      {/* Orange border - Unit20/Unit16 */}
      <mesh position={[-60,0.025,5]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[5,90]}/><meshStandardMaterial color="#8d6e63"/></mesh>
      {/* Small bush */}
      <mesh position={[42,0.04,-12]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[14,16]}/><meshStandardMaterial color="#2e7d32"/></mesh>
      {/* Tsunami veld north */}
      <mesh position={[0,0.04,-62]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[300,35]}/><meshStandardMaterial color="#a1887f"/></mesh>

      {houses.map((h,i)=><House key={h.id} pos={h.pos} side={h.side} neighborhood={h.neighborhood}/>)}
      {places.map(p=>{
        if(p.type==='spaza') return <Spaza key={p.id} pos={p.pos}/>
        if(p.type==='school') return <School key={p.id} pos={p.pos}/>
        if(p.type==='mall') return <School key={p.id} pos={p.pos}/>
        return null
      })}
    </>
  )
}

function Player({ places, setTrigger, controlsRef }){
  const g = useRef(); const lLeg=useRef(), rLeg=useRef(), lArm=useRef(), rArm=useRef(), body=useRef(); const t=useRef(0)
  useFrame((s,dt)=>{
    if(!g.current) return;
    const mv=controlsRef.current.move;
    const moving=Math.abs(mv.x)>0.02||Math.abs(mv.z)>0.02;
    if(moving){ t.current+=dt*9; const sw=Math.sin(t.current)*0.8; if(lLeg.current){lLeg.current.rotation.x=sw; rLeg.current.rotation.x=-sw; lArm.current.rotation.x=-sw*0.6; rArm.current.rotation.x=sw*0.6; body.current.position.y=1.1+Math.abs(Math.sin(t.current))*0.08} }
    const sp=6; const np={x:g.current.position.x+mv.x*sp*dt, z:g.current.position.z - mv.z*sp*dt}; keepInsideWorld(np); g.current.position.x=np.x; g.current.position.z=np.z;
    if(moving) g.current.rotation.y=Math.atan2(mv.x,mv.z);
    const trig = getNearbyTrigger({x:g.current.position.x,z:g.current.position.z}, places, 9);
    if(trig) setTrigger(trig);
    const yaw=controlsRef.current.yaw; const cx=g.current.position.x + Math.sin(yaw)*6.5; const cz=g.current.position.z + Math.cos(yaw)*6.5; s.camera.position.lerp(new THREE.Vector3(cx,2.8,cz),0.18); s.camera.lookAt(g.current.position.x,1,g.current.position.z)
  })
  return (<group ref={g} position={[-62,0,-32]}><mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.4,10]}/><meshBasicMaterial color="black" transparent opacity={0.2}/></mesh><group ref={lLeg} position={[-0.15,0.4,0]}><mesh castShadow><capsuleGeometry args={[0.1,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh></group><group ref={rLeg} position={[0.15,0.4,0]}><mesh castShadow><capsuleGeometry args={[0.1,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh></group><group ref={body} position={[0,1.05,0]}><mesh castShadow><boxGeometry args={[0.5,0.6,0.28]}/><meshStandardMaterial color="#ff3d00"/></mesh><group ref={lArm} position={[-0.35,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.35,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group><group ref={rArm} position={[0.35,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.35,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group><group position={[0,0.5,0]}><mesh castShadow><sphereGeometry args={[0.24,10,10]}/><meshStandardMaterial color="#ffcc99"/></mesh></group></group></group>)
}

export default function KasiRPG(){
  const [trigger,setTrigger]=useState(null); const controlsRef=useRef({move:{x:0,z:0},yaw:0});
  const houses=useMemo(()=>generateKasiHouses(),[]);
  const places=useMemo(()=>[...(WORLD.kasi?.places||[]),...houses],[houses]);
  const joy=useRef(), inner=useRef(), look=useRef()
  useEffect(()=>{ const j=joy.current, inn=inner.current; if(!j||!inn) return; let ja=false; const jm=e=>{ if(!ja) return; const r=j.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2; const t=e.touches?e.touches[0]:e; const dx=t.clientX-cx, dy=t.clientY-cy; const d=Math.hypot(dx,dy), max=42, cl=Math.min(d,max), ang=Math.atan2(dy,dx); const x=Math.cos(ang)*cl, y=Math.sin(ang)*cl; inn.style.transform=`translate(${x}px,${y}px)`; controlsRef.current.move={x:x/max,z:y/max}}; const js=e=>{ja=true; e.preventDefault()}; const je=()=>{ja=false; inn.style.transform=`translate(0px,0px)`; controlsRef.current.move={x:0,z:0}}; j.addEventListener('touchstart',js,{passive:false}); window.addEventListener('touchmove',jm,{passive:false}); window.addEventListener('touchend',je); return()=>{j.removeEventListener('touchstart',js); window.removeEventListener('touchmove',jm); window.removeEventListener('touchend',je)} },[])
  useEffect(()=>{ const onMove=e=>{controlsRef.current.yaw -= e.movementX*0.01}; window.addEventListener('mousemove',onMove); return()=>window.removeEventListener('mousemove',onMove)},[])
  return (
  <div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative',overflow:'hidden'}}>
    <Canvas shadows camera={{fov:62}} style={{background:'#87CEEB'}}>
      <Scene houses={houses} places={places}/>
      <Player places={places} setTrigger={setTrigger} controlsRef={controlsRef}/>
    </Canvas>
    <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.75)',color:'#fff',padding:'6px 12px',borderRadius:10,fontSize:11,lineHeight:'14px'}}>
      V6.1 FIXED - Unit20 ME [-62,-32] | Unit16 {houses.filter(h=>h.neighborhood==='unit16').length} houses | {trigger? `Near: ${trigger.id}` : 'Walk north to Main St → Spaza'}<br/>
      -25.585114,27.972712
    </div>
    <div ref={joy} style={{position:'absolute',bottom:18,left:18,width:120,height:120,borderRadius:'50%',border:'2px solid #fff',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}><div ref={inner} style={{width:42,height:42,background:'#fff',borderRadius:'50%'}}/></div>
    <div style={{position:'absolute',bottom:18,right:18,width:120,height:120,borderRadius:'50%',border:'2px dashed #fff',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'bold'}}>LOOK</div>
  </div>
  )
        }
