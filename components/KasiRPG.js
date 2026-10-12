"use client"
import { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { WORLD, getNearbyTrigger, generateKasiHouses, keepInsideWorld } from '../lib/protocol'
import * as THREE from 'three'

function TexturedWorld(){
  const [sand, asphalt, plaster, roof] = useTexture([
    '/textures/Ground007_1K_JPG_Color.jpg',
    '/textures/1C-asphalt_1K_Color.jpg',
    '/textures/Plaster002_1K_JPG_Color.jpg',
    '/textures/RoofingTiles002_1K_JPG_Color.jpg'
  ])

  useMemo(()=>{
    sand.wrapS = sand.wrapT = THREE.RepeatWrapping
    asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping
    roof.wrapS = roof.wrapT = THREE.RepeatWrapping
    sand.repeat.set(80,80)
    asphalt.repeat.set(1,80)
    plaster.repeat.set(1,1)
    roof.repeat.set(2,2)
  },[sand, asphalt, plaster, roof])

  return {sand, asphalt, plaster, roof}
}

function House({ pos, seed, side, textures }){
  const rot = side===-1? Math.PI/2 : -Math.PI/2
  return (
    <group position={[pos[0],0,pos[1]]} rotation={[0,rot,0]}>
      <mesh position={[0,0.05,0]} receiveShadow><boxGeometry args={[5,0.1,5]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[0,1.1,-2.4]} castShadow><boxGeometry args={[5,2.2,0.2]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[-2.4,1.1,0]}><boxGeometry args={[0.2,2.2,5]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[2.4,1.1,0]}><boxGeometry args={[0.2,2.2,5]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[-1.6,1.1,2.4]}><boxGeometry args={[1.6,2.2,0.2]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[0,1.6,2.4]}><boxGeometry args={[1.2,1.2,0.2]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[1.6,1.35,2.4]}><boxGeometry args={[1.6,1.7,0.2]}/><meshStandardMaterial map={textures.plaster}/></mesh>
      <mesh position={[0,2.4,0]} castShadow><boxGeometry args={[5.6,0.35,5.6]}/><meshStandardMaterial map={textures.roof}/></mesh>
      <mesh position={[0,0.7,2.5]}><boxGeometry args={[0.7,1.4,0.05]}/><meshStandardMaterial color="#5d4037"/></mesh>
      <mesh position={[-1.6,1.1,2.5]}><boxGeometry args={[0.8,0.7,0.05]}/><meshStandardMaterial color="#81d4fa" transparent opacity={0.6}/></mesh>
      <mesh position={[1.6,0.7,2.55]}><boxGeometry args={[1.3,1.2,0.05]}/><meshStandardMaterial color="#616161"/></mesh>
    </group>
  )
}

function Scene({houses, places, setTrigger, controlsRef}){
  const tex = TexturedWorld()
  return (
    <>
      <ambientLight intensity={1.1}/><directionalLight castShadow position={[15,20,10]} intensity={1.6}/>
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[800,800]}/><meshStandardMaterial map={tex.sand}/></mesh>
      <mesh position={[0,0.02,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[8,800]}/><meshStandardMaterial map={tex.asphalt}/></mesh>
      <mesh position={[0,0.03,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[0.3,800]}/><meshStandardMaterial color="white"/></mesh>
      <mesh position={[-6,0.025,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.5,800]}/><meshStandardMaterial color="#9e9e9e"/></mesh>
      <mesh position={[6,0.025,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.5,800]}/><meshStandardMaterial color="#9e9e9e"/></mesh>
      {houses.map((h,i)=><House key={h.id} pos={h.pos} seed={i} side={h.side} textures={tex}/>)}
    </>
  )
}

// KEEP YOUR Player and ChinaMall SAME AS BEFORE - paste below

function ChinaMall({ pos }){
  return (<group position={[pos[0],0,pos[1]]}><mesh position={[0,0.05,0]} receiveShadow><boxGeometry args={[14,0.1,14]}/><meshStandardMaterial color="#eceff1"/></mesh><mesh position={[0,1.5,-6.85]}><boxGeometry args={[14,3,0.3]}/><meshStandardMaterial color="#b0bec5"/></mesh><mesh position={[-6.85,1.5,0]}><boxGeometry args={[0.3,3,14]}/><meshStandardMaterial color="#b0bec5"/></mesh><mesh position={[6.85,1.5,0]}><boxGeometry args={[0.3,3,14]}/><meshStandardMaterial color="#b0bec5"/></mesh><mesh position={[-5,1.5,6.85]}><boxGeometry args={[4,3,0.3]}/><meshStandardMaterial color="#b0bec5"/></mesh><mesh position={[5,1.5,6.85]}><boxGeometry args={[4,3,0.3]}/><meshStandardMaterial color="#b0bec5"/></mesh><mesh position={[0,3.2,0]}><boxGeometry args={[15,0.5,15]}/><meshStandardMaterial color="#263238"/></mesh></group>)
}
function Player({ places, setTrigger, controlsRef }){
  const g = useRef(); const lLeg=useRef(), rLeg=useRef(), lArm=useRef(), rArm=useRef(), body=useRef(); const t=useRef(0)
  useFrame((s,dt)=>{ if(!g.current) return; const mv=controlsRef.current.move; const moving=Math.abs(mv.x)>0.02||Math.abs(mv.z)>0.02; if(moving){ t.current+=dt*9; const sw=Math.sin(t.current)*0.8; lLeg.current.rotation.x=sw; rLeg.current.rotation.x=-sw; lArm.current.rotation.x=-sw*0.6; rArm.current.rotation.x=sw*0.6; body.current.position.y=1.1+Math.abs(Math.sin(t.current))*0.08 } const sp=6; const np={x:g.current.position.x+mv.x*sp*dt, z:g.current.position.z - mv.z*sp*dt}; keepInsideWorld(np); g.current.position.x=np.x; g.current.position.z=np.z; if(moving) g.current.rotation.y=Math.atan2(mv.x,mv.z); setTrigger(getNearbyTrigger({x:g.current.position.x,z:g.current.position.z}, places, 8)); const yaw=controlsRef.current.yaw; const cx=g.current.position.x + Math.sin(yaw)*6.5; const cz=g.current.position.z + Math.cos(yaw)*6.5; s.camera.position.lerp({x:cx,y:2.4,z:cz},0.18); s.camera.lookAt(g.current.position.x,1,g.current.position.z) })
  return (<group ref={g} position={[0,0,15]}><mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.4,10]}/><meshBasicMaterial color="black" transparent opacity={0.2}/></mesh><group ref={lLeg} position={[-0.15,0.4,0]}><mesh castShadow><capsuleGeometry args={[0.1,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh></group><group ref={rLeg} position={[0.15,0.4,0]}><mesh castShadow><capsuleGeometry args={[0.1,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh></group><group ref={body} position={[0,1.05,0]}><mesh castShadow><boxGeometry args={[0.5,0.6,0.28]}/><meshStandardMaterial color="#ff3d00"/></mesh><group ref={lArm} position={[-0.35,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.35,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group><group ref={rArm} position={[0.35,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.35,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group><group position={[0,0.5,0]}><mesh castShadow><sphereGeometry args={[0.24,10,10]}/><meshStandardMaterial color="#ffcc99"/></mesh><mesh position={[0,0.16,0]}><cylinderGeometry args={[0.26,0.26,0.1,10]}/><meshStandardMaterial color="#111"/></mesh></group></group></group>)
}
export default function KasiRPG({ onTrigger }){
  const [trigger,setTrigger]=useState(null); const controlsRef=useRef({move:{x:0,z:0},yaw:0}); const houses=useMemo(()=>generateKasiHouses(70),[]); const places=useMemo(()=>[...WORLD.kasi.places,...houses],[houses]); const joy=useRef(), inner=useRef(), look=useRef()
  useEffect(()=>{ const j=joy.current, inn=inner.current, l=look.current; if(!j||!inn||!l) return; let ja=false, la=false, sx=0, sy=0; const js=e=>{ja=true; e.preventDefault()}; const jm=e=>{ if(!ja) return; const r=j.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2; const t=e.touches?e.touches[0]:e, dx=t.clientX-cx, dy=t.clientY-cy; const d=Math.hypot(dx,dy), max=42, cl=Math.min(d,max), ang=Math.atan2(dy,dx); const x=Math.cos(ang)*cl, y=Math.sin(ang)*cl; inn.style.transform=`translate(${x}px,${y}px)`; controlsRef.current.move={x:x/max,z:y/max} }; const je=()=>{ja=false; inn.style.transform=`translate(0px,0px)`; controlsRef.current.move={x:0,z:0}}; const ls=e=>{la=true; const t=e.touches?e.touches[0]:e; sx=t.clientX; sy=controlsRef.current.yaw}; const lm=e=>{if(!la) return; const t=e.touches?e.touches[0]:e; controlsRef.current.yaw=sy - (t.clientX-sx)*0.012}; const le=()=>{la=false}; j.addEventListener('touchstart',js,{passive:false}); window.addEventListener('touchmove',jm,{passive:false}); window.addEventListener('touchend',je); l.addEventListener('touchstart',ls,{passive:false}); window.addEventListener('touchmove',lm,{passive:false}); window.addEventListener('touchend',le) },[])
  return (<div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative',overflow:'hidden'}}><Canvas shadows camera={{fov:62}} style={{background:'#87CEEB'}}><Suspense fallback={null}><Scene houses={houses} places={places} setTrigger={setTrigger} controlsRef={controlsRef}/><ChinaMall pos={[0,0,-80]}/><Player places={places} setTrigger={setTrigger} controlsRef={controlsRef}/></Suspense></Canvas><div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.6)',color:'#fff',padding:'5px 10px',borderRadius:10,fontSize:11}}>V5: REAL SKINS - Sand/Tar/Wall/Roof</div><div ref={joy} style={{position:'absolute',bottom:18,left:18,width:120,height:120,borderRadius:'50%',border:'2px solid #fff',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}><div ref={inner} style={{width:42,height:42,background:'#fff',borderRadius:'50%'}}/></div><div ref={look} style={{position:'absolute',bottom:18,right:18,width:120,height:120,borderRadius:'50%',border:'2px dashed #fff',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'bold'}}>LOOK</div></div>)
    }
