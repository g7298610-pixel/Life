"use client"
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// ===== MAP DATA - GA-RANKUWA STYLE STREETS =====
const MAP = [
  // Main road with houses left/right
  { x: 0, z: -5, type: 'road' },
  { x: 0, z: 10, type: 'road' },
  { x: 0, z: 25, type: 'road' },
  { x: 0, z: 40, type: 'road' },
  { x: 0, z: 55, type: 'shop' }, // SPAR at end
]

const HOUSES = []
// Generate houses along the road like real kasi
for(let i=0; i<20; i++){
  const z = -20 + i*8
  // Left side of road
  HOUSES.push({ x: -10 + (Math.random()*2), z, rot: 0 })
  // Right side
  HOUSES.push({ x: 10 + (Math.random()*2), z, rot: 0 })
}
// Add corners / cross streets
for(let i=0; i<6; i++){
  const z = i*15 - 10
  HOUSES.push({ x: -25, z, rot: Math.PI/2 })
  HOUSES.push({ x: 25, z, rot: Math.PI/2 })
}

function RDP({ x, z, rot=0 }){
  return (
    <group position={[x,0,z]} rotation={[0,rot,0]}>
      <mesh position={[0,0.2,0]} receiveShadow><boxGeometry args={[5,0.3,6]}/><meshStandardMaterial color="#444"/></mesh>
      <mesh position={[0,1.2,0]} castShadow receiveShadow><boxGeometry args={[4.6,2,5.2]}/><meshStandardMaterial color="#d9c8a8"/></mesh>
      <mesh position={[0,2.4,0]} castShadow><boxGeometry args={[5.2,0.3,5.8]}/><meshStandardMaterial color="#b71c1c"/></mesh>
      {/* small fence */}
      <mesh position={[0,0.6,3]}><boxGeometry args={[4,0.6,0.1]}/><meshStandardMaterial color="#222"/></mesh>
    </group>
  )
}

function Road({ x, z }){
  return (
    <mesh position={[x,0.02,z]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[8,16]}/>
      <meshStandardMaterial color="#2b2b2b"/>
    </mesh>
  )
}

function Shop({ x, z, onEnter }){
  return (
    <group position={[x,0,z]}>
      <mesh position={[0,0.02,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[10,10]}/><meshStandardMaterial color="#2b2b2b"/></mesh>
      <mesh position={[0,1.5,0]} castShadow><boxGeometry args={[8,3,6]}/><meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.2}/></mesh>
      <mesh position={[0,3.2,0]}><boxGeometry args={[8.5,0.5,6.5]}/><meshStandardMaterial color="#c62828"/></mesh>
      <mesh position={[0,1.5,3.2]}><planeGeometry args={[2,2]}/><meshStandardMaterial color="#000" transparent opacity={0.8}/></mesh>
    </group>
  )
}

function Player({ joystick, yawRef, posRef }){
  const meshRef = useRef()
  useFrame((_, dt)=>{
    if(!meshRef.current) return
    const speed = 6
    const forward = joystick.y
    const strafe = joystick.x
    const yaw = yawRef.current

    // Move in direction of camera
    const moveX = Math.sin(yaw)*forward + Math.cos(yaw)*strafe
    const moveZ = Math.cos(yaw)*forward - Math.sin(yaw)*strafe

    meshRef.current.position.x += moveX * speed * dt
    meshRef.current.position.z -= moveZ * speed * dt

    // Save pos for camera
    posRef.current = meshRef.current.position.clone()
    meshRef.current.rotation.y = yaw
  })
  return (
    <mesh ref={meshRef} position={[0,0.9,0]} castShadow>
      <capsuleGeometry args={[0.4,1,4,8]}/>
      <meshStandardMaterial color="#111"/>
    </mesh>
  )
}

function GTACamera({ posRef, yawRef }){
  useFrame((state)=>{
    const target = posRef.current
    if(!target) return
    const yaw = yawRef.current
    const distance = 9
    const height = 4.5

    // Camera behind player, like GTA
    const camX = target.x - Math.sin(yaw)*distance
    const camZ = target.z + Math.cos(yaw)*distance

    state.camera.position.lerp({x: camX, y: target.y + height, z: camZ}, 0.08)
    state.camera.lookAt(target.x, 1, target.z)
  })
  return null
}

export default function KasiRPG({ onGoPlane }){
  const [joystick, setJoystick] = useState({x:0,y:0})
  const yawRef = useRef(0)
  const posRef = useRef({x:0,y:0.9,z:0})
  const touchStartX = useRef(0)

  useEffect(()=>{
    const left = document.getElementById('joyL')
    const right = document.getElementById('joyR')
    if(!left ||!right) return

    let sx=0, sy=0
    const onLeftStart = (e)=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY }
    const onLeftMove = (e)=>{
      e.preventDefault()
      const t=e.touches[0]
      let dx=(t.clientX-sx)/40, dy=(t.clientY-sy)/40
      dx=Math.max(-1,Math.min(1,dx)); dy=Math.max(-1,Math.min(1,dy))
      setJoystick({x:dx, y:-dy}) // up = forward
    }
    const onLeftEnd = ()=> setJoystick({x:0,y:0})

    const onRightStart = (e)=>{ touchStartX.current = e.touches[0].clientX }
    const onRightMove = (e)=>{
      e.preventDefault()
      const dx = e.touches[0].clientX - touchStartX.current
      yawRef.current -= dx*0.02
      touchStartX.current = e.touches[0].clientX
    }

    left.addEventListener('touchstart', onLeftStart, {passive:false})
    left.addEventListener('touchmove', onLeftMove, {passive:false})
    left.addEventListener('touchend', onLeftEnd)
    right.addEventListener('touchstart', onRightStart, {passive:false})
    right.addEventListener('touchmove', onRightMove, {passive:false})

    return()=>{
      left.removeEventListener('touchstart', onLeftStart)
      left.removeEventListener('touchmove', onLeftMove)
      left.removeEventListener('touchend', onLeftEnd)
      right.removeEventListener('touchstart', onRightStart)
      right.removeEventListener('touchmove', onRightMove)
    }
  },[])

  return (
    <div style={{width:'100%',height:'100vh',background:'#1a1207',position:'relative'}}>
      <Canvas shadows camera={{position:[0,5,10],fov:60}}>
        <ambientLight intensity={0.7}/>
        <directionalLight castShadow position={[15,20,10]} intensity={1.8} shadow-mapSize={[2048,2048]}/>
        <fog attach="fog" args={['#1a1207', 30, 90]}/>

        {/* Ground */}
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow position={[0,-0.1,0]}>
          <planeGeometry args={[200,200]}/>
          <meshStandardMaterial color="#3a2a15"/>
        </mesh>

        {/* ROADS */}
        {MAP.map((m,i)=> m.type==='road'? <Road key={i} x={m.x} z={m.z}/> : <Shop key={i} x={m.x} z={m.z}/> )}

        {/* HOUSES LINING THE STREETS */}
        {HOUSES.map((h,i)=><RDP key={i} x={h.x} z={h.z} rot={h.rot}/>)}

        {/* AIRPORT AT FAR END */}
        <group position={[0,0,70]}>
          <mesh position={[0,0.1,0]}><boxGeometry args={[12,0.2,12]}/><meshStandardMaterial color="#222"/></mesh>
          <mesh position={[0,2,0]}><boxGeometry args={[10,4,8]}/><meshStandardMaterial color="#2e7d32" emissive="#00ff00" emissiveIntensity={0.3}/></mesh>
        </group>

        <Player joystick={joystick} yawRef={yawRef} posRef={posRef}/>
        <GTACamera posRef={posRef} yawRef={yawRef}/>
      </Canvas>

      {/* GTA JOYSTICKS */}
      <div id="joyL" style={{position:'absolute',left:20,bottom:30,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.15)',border:'2px solid rgba(255,255,255,0.5)',touchAction:'none'}}>
        <div style={{width:50,height:50,borderRadius:25,background:'#fff',position:'absolute',left:`calc(50% + ${joystick.x*35}px - 25px)`,top:`calc(50% + ${-joystick.y*35}px - 25px)`,boxShadow:'0 2px 8px rgba(0,0,0,0.5)'}}/>
      </div>
      <div id="joyR" style={{position:'absolute',right:20,bottom:30,width:130,height:130,borderRadius:65,background:'rgba(255,255,255,0.08)',border:'2px dashed rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'bold',touchAction:'none'}}>LOOK</div>

      <div style={{position:'absolute',top:60,left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,0.7)',color:'#fff',padding:'6px 14px',borderRadius:20,fontSize:12}}>
        Walk to green building = AIRPORT ✈️ — Yellow building = SHOP
      </div>

      <button onClick={onGoPlane} style={{position:'absolute',top:10,right:10,padding:'10px 16px',background:'#00ff00',color:'#000',fontWeight:'900',borderRadius:12,border:'none'}}>✈️ AIRPORT</button>
    </div>
  )
    }
