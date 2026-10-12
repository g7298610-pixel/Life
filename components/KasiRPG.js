"use client"
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function RDP({pos, isAirport=false}){
  return (
    <group position={pos}>
      <mesh position={[0,0.1,0]} receiveShadow><boxGeometry args={[5,0.2,6]}/><meshStandardMaterial color="#222"/></mesh>
      <mesh position={[0,1.1,0]} castShadow receiveShadow>
        <boxGeometry args={[4.8,2.2,5.5]}/>
        <meshStandardMaterial color={isAirport? "#2e7d32" : "#d8c9b0"}/>
      </mesh>
      <mesh position={[0,2.45,0]} castShadow>
        <boxGeometry args={[5.3,0.2,6.2]}/>
        <meshStandardMaterial color={isAirport? "#111" : "#b71c1c"}/>
      </mesh>
      {isAirport && <mesh position={[0,4,0]}><boxGeometry args={[1,3,1]}/><meshStandardMaterial color="#fff" emissive="#00ff00" emissiveIntensity={2}/></mesh>}
    </group>
  )
}

function Player({move, yaw}){
  const ref=useRef()
  useFrame((_,dt)=>{
    if(!ref.current) return
    // FIXED: forward is -Y on joystick = forward in world
    const speed=5
    const forward = move.y // up on stick = +1 = forward
    const strafe = move.x // right = +1
    // move relative to yaw
    const fx = Math.sin(yaw)*forward + Math.cos(yaw)*strafe
    const fz = Math.cos(yaw)*forward - Math.sin(yaw)*strafe
    ref.current.position.x += fx * speed * dt
    ref.current.position.z -= fz * speed * dt // minus = fixed inversion
    ref.current.rotation.y = yaw
  })
  return <mesh ref={ref} position={[0,0.9,0]} castShadow><capsuleGeometry args={[0.4,1,4,8]}/><meshStandardMaterial color="#111"/></mesh>
}

function CameraFollow({playerPos, yaw}){
  useFrame((state)=>{
    const cam = state.camera
    // camera behind player, follows yaw
    const dist=8, height=5
    const x = playerPos.x - Math.sin(yaw)*dist
    const z = playerPos.z + Math.cos(yaw)*dist
    cam.position.lerp({x, y:height, z}, 0.1)
    cam.lookAt(playerPos.x, 1, playerPos.z)
  })
  return null
}

export default function KasiRPG({onGoPlane}){
  const [move,setMove]=useState({x:0,y:0})
  const [yaw,setYaw]=useState(0)
  const playerPosRef=useRef({x:0,y:0,z:0})
  const [camPos,setCamPos]=useState({x:0,z:0})

  // track player for camera
  useEffect(()=>{
    const id=setInterval(()=>{
      const el=document.querySelector('canvas')
      // dummy tracking - actual pos from Player ref would need context, for now use state
    },100)
    return()=>clearInterval(id)
  },[])

  useEffect(()=>{
    const L=document.getElementById('joyL'), R=document.getElementById('joyR')
    let sx=0,sy=0, lx=0
    const ls=(e)=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY }
    const lm=(e)=>{
      const t=e.touches[0]
      let dx=(t.clientX-sx)/40, dy=(t.clientY-sy)/40
      dx=Math.max(-1,Math.min(1,dx)); dy=Math.max(-1,Math.min(1,dy))
      // FIX: up = forward (negative screen Y = positive forward)
      setMove({x:dx, y:-dy})
    }
    const le=()=>setMove({x:0,y:0})
    const rs=(e)=>{ lx=e.touches[0].clientX }
    const rm=(e)=>{ const dx=e.touches[0].clientX-lx; setYaw(y=>y - dx*0.015); lx=e.touches[0].clientX }
    L.addEventListener('touchstart',ls,{passive:false}); L.addEventListener('touchmove',lm,{passive:false}); L.addEventListener('touchend',le)
    R.addEventListener('touchstart',rs,{passive:false}); R.addEventListener('touchmove',rm,{passive:false})
    return()=>{
      L.removeEventListener('touchstart',ls); L.removeEventListener('touchmove',lm); L.removeEventListener('touchend',le)
      R.removeEventListener('touchstart',rs); R.removeEventListener('touchmove',rm)
    }
  },[])

  return (
    <div style={{width:'100%',height:'100vh',position:'relative',background:'#2a1f0f'}}>
      <Canvas shadows camera={{position:[0,6,10],fov:60}}>
        <ambientLight intensity={0.8}/>
        <directionalLight castShadow position={[10,15,5]} intensity={1.5}/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#3d2f1a"/></mesh>
        {/* Kasi layout + AIRPORT is green house with beacon */}
        <RDP pos={[0,0,-10]}/><RDP pos={[8,0,-10]}/><RDP pos={[-8,0,-10]}/>
        <RDP pos={[0,0,-20]}/><RDP pos={[20,0,0]} isAirport={true}/>
        <Player move={move} yaw={yaw}/>
      </Canvas>

      {/* FIXED ANALOG */}
      <div id="joyL" style={{position:'absolute',left:15,bottom:20,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.2)',border:'2px solid #fff'}}>
        <div style={{width:50,height:50,borderRadius:25,background:'#fff',position:'absolute',left:`calc(50% + ${move.x*35}px - 25px)`,top:`calc(50% + ${-move.y*35}px - 25px)`}}/>
      </div>
      <div id="joyR" style={{position:'absolute',right:15,bottom:20,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.1)',border:'2px dashed #fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>ROTATE</div>

      <button onClick={onGoPlane} style={{position:'absolute',top:60,right:10,padding:12,background:'#00ff00',color:'#000',fontWeight:'bold',borderRadius:10}}>✈️ AIRPORT (GREEN HOUSE)</button>
      <div style={{position:'absolute',top:10,left:10,color:'#fff',fontSize:11,background:'rgba(0,0,0,0.7)',padding:6,borderRadius:6}}>
        Up = Forward | Down = Back | Right stick = Look | Green = Airport
      </div>
    </div>
  )
    }
