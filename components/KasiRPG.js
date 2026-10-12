"use client"
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WORLD, isColliding, getNearbyTrigger, generateKasiHouses } from '@/lib/protocol'

const EXTRA_HOUSES = generateKasiHouses(25)
const ALL_PLACES = [...WORLD.kasi.places.filter(p=>p.type==='house'),...EXTRA_HOUSES, WORLD.kasi.places.find(p=>p.id==='spaza'), WORLD.kasi.places.find(p=>p.id==='airport')]

function House({ p }){
  const isShop = p.type==='shop'
  const isAirport = p.type==='airport'
  const color = isShop? "#ffeb3b" : isAirport? "#2e7d32" : "#d9c8a8"
  const roof = isShop? "#c62828" : isAirport? "#111" : "#b71c1c"
  return (
    <group position={[p.pos[0],0,p.pos[1]]}>
      <mesh position={[0,0.15,0]} receiveShadow><boxGeometry args={[5,0.3,6]}/><meshStandardMaterial color="#333"/></mesh>
      <mesh position={[0,1.2,0]} castShadow receiveShadow><boxGeometry args={[4.6,2,5.2]}/><meshStandardMaterial color={color} emissive={isAirport?"#00ff00":null} emissiveIntensity={isAirport?0.3:0}/></mesh>
      <mesh position={[0,2.4,0]}><boxGeometry args={[5.1,0.3,5.7]}/><meshStandardMaterial color={roof}/></mesh>
    </group>
  )
}

function Player({ joy, yawRef, posRef, onTrigger }){
  const ref = useRef()
  useFrame((_, dt)=>{
    if(!ref.current) return
    const speed = 7
    const yaw = yawRef.current
    let mx = Math.sin(yaw)*joy.y + Math.cos(yaw)*joy.x
    let mz = Math.cos(yaw)*joy.y - Math.sin(yaw)*joy.x

    const nextPos = {
      x: ref.current.position.x + mx*speed*dt,
      z: ref.current.position.z - mz*speed*dt
    }

    // PROTOCOL: Check collision before moving
    let canMove = true
    for(const place of ALL_PLACES){
      if(place.solid && isColliding(nextPos, place)){
        canMove = false
        break
      }
    }

    if(canMove){
      ref.current.position.x = nextPos.x
      ref.current.position.z = nextPos.z
    }

    posRef.current = ref.current.position.clone()
    ref.current.rotation.y = yaw

    // PROTOCOL: Check triggers
    const trigger = getNearbyTrigger(posRef.current, ALL_PLACES)
    onTrigger(trigger)
  })
  return <mesh ref={ref} position={[0,0.9,0]} castShadow><capsuleGeometry args={[0.4,1,4,8]}/><meshStandardMaterial color="#111"/></mesh>
}

function Cam({ posRef, yawRef }){
  useFrame((s)=>{
    const t = posRef.current
    if(!t) return
    const yaw = yawRef.current
    const x = t.x - Math.sin(yaw)*9
    const z = t.z + Math.cos(yaw)*9
    s.camera.position.lerp({x, y:t.y+4.5, z}, 0.09)
    s.camera.lookAt(t.x, 1, t.z)
  })
  return null
}

export default function KasiRPG({ onGoPlane, onGoShop }){
  const [joy,setJoy]=useState({x:0,y:0})
  const yawRef=useRef(0), posRef=useRef({x:0,y:0.9,z:0})
  const [activeTrigger, setActiveTrigger]=useState(null)
  const startX=useRef(0)

  useEffect(()=>{
    const L=document.getElementById('joyL'), R=document.getElementById('joyR')
    let sx=0, sy=0
    const ls=(e)=>{sx=e.touches[0].clientX; sy=e.touches[0].clientY}
    const lm=(e)=>{e.preventDefault(); let dx=(e.touches[0].clientX-sx)/40, dy=(e.touches[0].clientY-sy)/40; dx=Math.max(-1,Math.min(1,dx)); dy=Math.max(-1,Math.min(1,dy)); setJoy({x:dx, y:-dy})}
    const le=()=>setJoy({x:0,y:0})
    const rs=(e)=>startX.current=e.touches[0].clientX
    const rm=(e)=>{e.preventDefault(); const dx=e.touches[0].clientX-startX.current; yawRef.current-=dx*0.02; startX.current=e.touches[0].clientX}
    L.addEventListener('touchstart',ls,{passive:false}); L.addEventListener('touchmove',lm,{passive:false}); L.addEventListener('touchend',le)
    R.addEventListener('touchstart',rs,{passive:false}); R.addEventListener('touchmove',rm,{passive:false})
    return()=>{L.removeEventListener('touchstart',ls); L.removeEventListener('touchmove',lm); L.removeEventListener('touchend',le); R.removeEventListener('touchstart',rs); R.removeEventListener('touchmove',rm)}
  },[])

  return (
    <div style={{width:'100%',height:'100vh',background:'#1a1207',position:'relative'}}>
      <Canvas shadows camera={{fov:60}}>
        <ambientLight intensity={0.8}/>
        <directionalLight castShadow position={[15,20,10]} intensity={1.8}/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#3a2a15"/></mesh>
        {/* ROAD */}
        <mesh position={[0,0.02,30]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[8,140]}/><meshStandardMaterial color="#2b2b2b"/></mesh>
        {ALL_PLACES.map(p=><House key={p.id} p={p}/>)}
        <Player joy={joy} yawRef={yawRef} posRef={posRef} onTrigger={setActiveTrigger}/>
        <Cam posRef={posRef} yawRef={yawRef}/>
      </Canvas>

      <div id="joyL" style={{position:'absolute',left:20,bottom:30,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.15)',border:'2px solid #fff'}}>
        <div style={{width:50,height:50,borderRadius:25,background:'#fff',position:'absolute',left:`calc(50% + ${joy.x*35}px - 25px)`,top:`calc(50% + ${-joy.y*35}px - 25px)`}}/>
      </div>
      <div id="joyR" style={{position:'absolute',right:20,bottom:30,width:130,height:130,borderRadius:65,border:'2px dashed rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'bold'}}>LOOK</div>

      {/* PROTOCOL TRIGGER UI - only shows when near place */}
      {activeTrigger && (
        <div style={{position:'absolute',top:'45%',left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,0.85)',color:'#fff',padding:'12px 20px',borderRadius:14,textAlign:'center',border:activeTrigger.type==='airport'?'2px solid #00ff00':'2px solid #ffeb3b'}}>
          <div style={{fontWeight:'900'}}>{activeTrigger.type==='shop'?'🛒 SPAZA SHOP': activeTrigger.type==='airport'?'✈️ AIRPORT': activeTrigger.id}</div>
          <button onClick={()=> activeTrigger.type==='airport'? onGoPlane() : onGoShop? onGoShop() : alert('Shop coming soon')} style={{marginTop:8,padding:'10px 20px',background:activeTrigger.type==='airport'?'#00ff00':'#ffeb3b',color:'#000',fontWeight:'900',borderRadius:10,border:'none'}}>
            {activeTrigger.type==='airport'?'FLY TO CHINA (F)':'ENTER SHOP'}
          </button>
        </div>
      )}

      <div style={{position:'absolute',top:10,left:10,background:'rgba(0,0,0,0.6)',color:'#fff',padding:'6px 10px',borderRadius:8,fontSize:11}}>
        PROTOCOL V1: Can't walk through houses | Walk to buildings to trigger
      </div>
    </div>
  )
}
