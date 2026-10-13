"use client"
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WORLD, getNearbyTrigger, generateKasiHouses, keepInsideWorld } from '../lib/protocol'
import * as THREE from 'three'

function House({ pos, side, neighborhood, isHome }){
  const rot = side===-1? Math.PI/2 : -Math.PI/2
  return (
    <group position={[pos[0],0,pos[1]]} rotation={[0,rot,0]}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[6,6]}/><meshStandardMaterial color={isHome?"#00ff88":"#aed581"}/></mesh>
      <mesh position={[0,1.1,0]} castShadow><boxGeometry args={[4.2,2.2,4.2]}/><meshStandardMaterial color={isHome?"#00e676":"#e0e0e0"}/></mesh>
      <mesh position={[0,2.4,0]} castShadow><boxGeometry args={[5,0.4,5]}/><meshStandardMaterial color="#b71c1c"/></mesh>
    </group>
  )
}
function Spaza({ pos }){ return <group position={[pos[0],0,pos[1]]}><mesh position={[0,1,0]} castShadow><boxGeometry args={[4,2,4]}/><meshStandardMaterial color="#ff9800"/></mesh></group> }
function School({ pos }){ return <group position={[pos[0],0,pos[1]]}><mesh position={[0,1.5,0]} castShadow><boxGeometry args={[12,3,6]}/><meshStandardMaterial color="#fafafa"/></mesh></group> }

function Scene({houses, places}){
  return (
    <>
      <ambientLight intensity={1.1}/><directionalLight castShadow position={[15,20,10]} intensity={1.4}/>
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[800,800]}/><meshStandardMaterial color="#d7ccc8"/></mesh>
      <mesh position={[0,0.02,-42]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[260,9]}/><meshStandardMaterial color="#212121"/></mesh>
      {houses.map(h=><House key={h.id} pos={h.pos} side={h.side} neighborhood={h.neighborhood} isHome={h.id==='me-house' || (h.pos[0]===-62 && h.pos[1]===-32)} />)}
      {places.map(p=>{ if(p.type==='spaza') return <Spaza key={p.id} pos={p.pos}/>; if(p.type==='school') return <School key={p.id} pos={p.pos}/>; if(p.type==='mall') return <School key={p.id} pos={p.pos}/>; return null })}
    </>
  )
}

function Player({ places, setTrigger, controlsRef }){
  const g = useRef(); const t=useRef(0)
  useFrame((s,dt)=>{
    if(!g.current) return;
    const mv=controlsRef.current.move;
    const sp=6; const np={x:g.current.position.x+mv.x*sp*dt, z:g.current.position.z - mv.z*sp*dt}; keepInsideWorld(np); g.current.position.x=np.x; g.current.position.z=np.z;
    if(Math.abs(mv.x)>0.02||Math.abs(mv.z)>0.02) g.current.rotation.y=Math.atan2(mv.x,mv.z);
    const trig = getNearbyTrigger({x:g.current.position.x,z:g.current.position.z}, places, 9); setTrigger(trig||null);

    // YAW + PITCH CAMERA
    const yaw=controlsRef.current.yaw; const pitch=controlsRef.current.pitch;
    const dist=6.5; const height=1.2 + pitch*4;
    const cx=g.current.position.x + Math.sin(yaw)*dist; const cz=g.current.position.z + Math.cos(yaw)*dist;
    s.camera.position.lerp(new THREE.Vector3(cx,height,cz),0.18); s.camera.lookAt(g.current.position.x,1,g.current.position.z)
  })
  return (<group ref={g} position={[-62,0,-32]}><mesh castShadow><boxGeometry args={[0.5,0.6,0.28]}/><meshStandardMaterial color="#ff3d00"/></mesh><mesh position={[0,0.5,0]}><sphereGeometry args={[0.24,10,10]}/><meshStandardMaterial color="#ffcc99"/></mesh></group>)
}

export default function KasiRPG(){
  const [trigger,setTrigger]=useState(null);
  const controlsRef=useRef({move:{x:0,z:0},yaw:0,pitch:0.4});
  const houses=useMemo(()=>generateKasiHouses(),[]); const places=useMemo(()=>[...(WORLD.kasi?.places||[]),...houses],[houses]);
  const joy=useRef(), inner=useRef(), look=useRef(), lookInner=useRef()

  // LEFT - MOVE
  useEffect(()=>{
    const j=joy.current, inn=inner.current; if(!j||!inn) return; let active=false;
    const move=(cx,cy)=>{ const r=j.getBoundingClientRect(); const mx=r.left+r.width/2, my=r.top+r.height/2; const dx=cx-mx, dy=cy-my; const d=Math.hypot(dx,dy), max=42, cl=Math.min(d,max), ang=Math.atan2(dy,dx); const x=Math.cos(ang)*cl, y=Math.sin(ang)*cl; inn.style.transform=`translate(${x}px,${y}px)`; controlsRef.current.move={x:x/max, z:y/max}; }
    const start=e=>{active=true; const t=e.touches?e.touches[0]:e; move(t.clientX,t.clientY)}; const onMove=e=>{if(!active) return; const t=e.touches?e.touches[0]:e; move(t.clientX,t.clientY)}; const end=()=>{active=false; inn.style.transform=`translate(0px,0px)`; controlsRef.current.move={x:0,z:0}};
    j.addEventListener('touchstart',start,{passive:false}); window.addEventListener('touchmove',onMove,{passive:false}); window.addEventListener('touchend',end);
    j.addEventListener('mousedown',start); window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',end);
  },[])

  // RIGHT - ROTATE + UP/DOWN
  useEffect(()=>{
    const l=look.current, inn=lookInner.current; if(!l||!inn) return; let active=false, lastX=0, lastY=0;
    const get=e=>{ const t=e.touches?e.touches[0]:e; return {x:t.clientX, y:t.clientY} };
    const start=e=>{active=true; const {x,y}=get(e); lastX=x; lastY=y; e.preventDefault() };
    const onMove=e=>{ if(!active) return; const {x,y}=get(e); const dx=x-lastX, dy=y-lastY; controlsRef.current.yaw -= dx*0.02; controlsRef.current.pitch += dy*0.01; controlsRef.current.pitch=Math.max(0,Math.min(1.5,controlsRef.current.pitch)); lastX=x; lastY=y; const r=l.getBoundingClientRect(); inn.style.transform=`translate(${Math.max(-30,Math.min(30,x-(r.left+r.width/2)))}px,${Math.max(-30,Math.min(30,y-(r.top+r.height/2)))}px)`; };
    const end=()=>{active=false; inn.style.transform=`translate(0px,0px)`};
    l.addEventListener('touchstart',start,{passive:false}); window.addEventListener('touchmove',onMove,{passive:false}); window.addEventListener('touchend',end);
    l.addEventListener('mousedown',start); window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',end);
  },[])

  return (
  <div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative',overflow:'hidden'}}>
    <Canvas shadows camera={{fov:62}} style={{background:'#87CEEB'}}><Scene houses={houses} places={places}/><Player places={places} setTrigger={setTrigger} controlsRef={controlsRef}/></Canvas>
    <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.75)',color:'#fff',padding:'6px 12px',borderRadius:10,fontSize:11}}>{trigger?`Near: ${trigger.id}`:'LEFT=Move | RIGHT=Drag to Look Around + Up/Down'}</div>
    <div ref={joy} style={{position:'absolute',bottom:18,left:18,width:120,height:120,borderRadius:'50%',border:'2px solid #fff',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none'}}><div ref={inner} style={{width:42,height:42,background:'#fff',borderRadius:'50%'}}/></div>
    <div ref={look} style={{position:'absolute',bottom:18,right:18,width:120,height:120,borderRadius:'50%',border:'2px solid #fff',background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none'}}><div ref={lookInner} style={{width:50,height:50,background:'#00e676',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:10}}>LOOK</div></div>
  </div>
  )
    }
