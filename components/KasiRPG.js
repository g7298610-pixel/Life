"use client"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'

function HumanPlayer({pos, dir}){
  const ref=useRef()
  useFrame(()=>{
    if(ref.current){
      ref.current.position.x = pos.x
      ref.current.position.z = pos.z
      ref.current.rotation.y = dir
    }
  })
  return (
    <group ref={ref}>
      <mesh position={[-0.15,0.25,0]}><capsuleGeometry args={[0.12,0.5]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.15,0.25,0]}><capsuleGeometry args={[0.12,0.5]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0,0.95,0]}><capsuleGeometry args={[0.28,0.6]} /><meshStandardMaterial color="#1e90ff" /></mesh>
      <mesh position={[-0.4,0.9,0]}><capsuleGeometry args={[0.08,0.5]} /><meshStandardMaterial color="#ffdbac" /></mesh>
      <mesh position={[0.4,0.9,0]}><capsuleGeometry args={[0.08,0.5]} /><meshStandardMaterial color="#ffdbac" /></mesh>
      <mesh position={[0,1.55,0]}><sphereGeometry args={[0.32,16,16]} /><meshStandardMaterial color="#ffdbac" /></mesh>
      <mesh position={[0,1.75,0.1]}><cylinderGeometry args={[0.35,0.35,0.15,16]} /><meshStandardMaterial color="black" /></mesh>
    </group>
  )
}

function House({p, color}){
  return (
    <group position={p}>
      <mesh position={[0,0.9,0]} castShadow><boxGeometry args={[3,1.8,3.5]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0,2,0]}><coneGeometry args={[2.2,1.2,4]} rotation={[0,Math.PI/4,0]} /><meshStandardMaterial color="#6b3a1f" /></mesh>
      <mesh position={[0,0.5,1.76]}><planeGeometry args={[0.8,1.2]} /><meshStandardMaterial color="#2a1508" /></mesh>
    </group>
  )
}

export default function KasiRPG({zone, onGoPlane}){
  const [player,setPlayer]=useState({x:0,z:5})
  const [angle,setAngle]=useState(0)
  const [camAngle,setCamAngle]=useState(0)
  const controlsRef=useRef()
  const [inside,setInside]=useState(false)

  // PUBG LOGIC: move relative to camera
  const movePUBG = (forward, strafe) => {
    // get camera angle
    const cam = camAngle
    // forward direction = where camera looks
    const fx = Math.sin(cam) * forward
    const fz = Math.cos(cam) * forward
    // strafe direction = 90 deg to camera
    const sx = Math.sin(cam + Math.PI/2) * strafe
    const sz = Math.cos(cam + Math.PI/2) * strafe

    const newX = player.x + fx + sx
    const newZ = player.z + fz + sz

    if(Math.abs(newX)<1.5 && Math.abs(newZ)<1.5){ setInside(true); return }
    setPlayer({x:newX, z:newZ})
    // player faces movement direction
    if(forward!==0 || strafe!==0) setAngle(Math.atan2(fx+sx, fz+sz))
  }

  if(inside){
    return (
      <div style={{height:'85vh', background:'#2a1a0a', padding:20, color:'#fff'}}>
        <h2>🏠 Your House - {zone}</h2>
        <p>Mma says: Go school!</p>
        <button onClick={()=>setInside(false)} style={{padding:15, background:'#fff'}}>LEAVE</button>
        <button onClick={onGoPlane} style={{padding:15, background:'#FFD700', marginLeft:10}}>🚕 OR TAMBO R150</button>
      </div>
    )
  }

  return (
    <div style={{height:'88vh', width:'100%', position:'relative', background:'#87CEEB'}}>
      <Canvas shadows camera={{position:[6,5,8], fov:60}}>
        <ambientLight intensity={1.3}/><directionalLight position={[15,20,10]} intensity={1.2} castShadow/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[150,150]} /><meshStandardMaterial color="#cda86f" /></mesh>
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,0]}><planeGeometry args={[6,150]} /><meshStandardMaterial color="#222" /></mesh>
        <House p={[0,0,0]} color="#c97a3a" />
        <House p={[5,0,3]} color="#a05a2a" />
        <House p={[-5,0,2]} color="#8B4513" />
        <House p={[4,0,-5]} color="#b87a4a" />
        <House p={[-6,0,-4]} color="#9c5a2a" />
        <HumanPlayer pos={player} dir={angle} />
        <OrbitControls 
          ref={controlsRef}
          target={[player.x,1,player.z]}
          enablePan={false}
          maxPolarAngle={Math.PI/2.15}
          minDistance={2}
          maxDistance={20}
          onChange={()=>{
            if(controlsRef.current){
              setCamAngle(controlsRef.current.getAzimuthalAngle())
            }
          }}
        />
      </Canvas>

      <div style={{position:'absolute', top:10, left:10, background:'rgba(0,0,0,0.8)', padding:8, borderRadius:8, fontSize:11, color:'#fff'}}>
        PUBG MODE: Rotate screen → Press ▲ = go where you look
      </div>

      {/* PUBG JOYSTICK */}
      <div style={{position:'absolute', bottom:18, left:18, display:'grid', gridTemplateColumns:'repeat(3,64px)', gridTemplateRows:'repeat(3,50px)', gap:6}}>
        <div/><button onTouchStart={()=>movePUBG(-0.8,0)} onMouseDown={()=>movePUBG(-0.8,0)} style={{background:'#fff',borderRadius:14,fontSize:24,fontWeight:'bold'}}>▲<div style={{fontSize:8}}>FORWARD</div></button><div/>
        <button onTouchStart={()=>movePUBG(0,-0.7)} onMouseDown={()=>movePUBG(0,-0.7)} style={{background:'#fff',borderRadius:14,fontSize:20}}>◀</button>
        <button onTouchStart={()=>movePUBG(0.6,0)} onMouseDown={()=>movePUBG(0.6,0)} style={{background:'#333',borderRadius:14,color:'#fff'}}>●</button>
        <button onTouchStart={()=>movePUBG(0,0.7)} onMouseDown={()=>movePUBG(0,0.7)} style={{background:'#fff',borderRadius:14,fontSize:20}}>▶</button>
        <div/><button onTouchStart={()=>movePUBG(0.8,0)} onMouseDown={()=>movePUBG(0.8,0)} style={{background:'#ddd',borderRadius:14,fontSize:20}}>▼</button><div/>
      </div>

      <div style={{position:'absolute', bottom:22, right:15, display:'flex', flexDirection:'column', gap:8}}>
        <button onClick={onGoPlane} style={{background:'#FFD700',padding:'16px 20px',fontWeight:'bold',borderRadius:12}}>🚕 OR TAMBO</button>
        <button style={{background:'rgba(0,0,0,0.6)',color:'#fff',padding:'10px',borderRadius:8,fontSize:10}}>DRAG RIGHT SIDE TO LOOK</button>
      </div>

      <div style={{position:'absolute', top:10, right:10, width:90, height:90, background:'rgba(0,0,0,0.7)', border:'1px solid #fff', borderRadius:8}}>
        <div style={{position:'relative', width:'100%', height:'100%'}}>
          <div style={{position:'absolute', left:'50%', top:0, width:4, height:'100%', background:'#333'}}/>
          <div style={{position:'absolute', left:45+player.x*2, top:45+player.z*2, width:8, height:8, background:'#0f0', borderRadius:8, border:'1px solid #fff'}}/>
        </div>
      </div>
    </div>
  )
    }
