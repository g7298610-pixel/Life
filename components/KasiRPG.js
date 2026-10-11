
"use client"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
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
      {/* Legs */}
      <mesh position={[-0.15,0.25,0]}><capsuleGeometry args={[0.12,0.5]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0.15,0.25,0]}><capsuleGeometry args={[0.12,0.5]} /><meshStandardMaterial color="#222" /></mesh>
      {/* Body - shirt */}
      <mesh position={[0,0.95,0]}><capsuleGeometry args={[0.28,0.6]} /><meshStandardMaterial color="#1e90ff" /></mesh>
      {/* Arms */}
      <mesh position={[-0.4,0.9,0]}><capsuleGeometry args={[0.08,0.5]} /><meshStandardMaterial color="#ffdbac" /></mesh>
      <mesh position={[0.4,0.9,0]}><capsuleGeometry args={[0.08,0.5]} /><meshStandardMaterial color="#ffdbac" /></mesh>
      {/* Head */}
      <mesh position={[0,1.55,0]}><sphereGeometry args={[0.32,16,16]} /><meshStandardMaterial color="#ffdbac" /></mesh>
      {/* Cap */}
      <mesh position={[0,1.75,0.1]}><cylinderGeometry args={[0.35,0.35,0.15,16]} /><meshStandardMaterial color="black" /></mesh>
    </group>
  )
}

function House({p, color='#8B4513', hasDoor}){
  return (
    <group position={p}>
      <mesh position={[0,0.9,0]} castShadow receiveShadow><boxGeometry args={[3,1.8,3.5]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0,2,0]} castShadow><coneGeometry args={[2.2,1.2,4]} rotation={[0,Math.PI/4,0]} /><meshStandardMaterial color="#6b3a1f" /></mesh>
      {hasDoor && <mesh position={[0,0.5,1.76]}><planeGeometry args={[0.8,1.2]} /><meshStandardMaterial color="#3d1f0f" /></mesh>}
      <mesh position={[-0.8,0.9,1.76]}><planeGeometry args={[0.5,0.5]} /><meshStandardMaterial color="#87CEEB" /></mesh>
    </group>
  )
}

export default function KasiRPG({zone}){
  const [player,setPlayer]=useState({x:0,z:5})
  const [angle,setAngle]=useState(0)

  // FIXED JOYSTICK: now correct GTA style
  const move = (dx,dz) => {
    setPlayer(v=>({x:v.x+dx, z:v.z+dz}))
    if(dx!==0 || dz!==0) setAngle(Math.atan2(dx, dz))
  }

  return (
    <div style={{height:'85vh', width:'100%', position:'relative', background:'#87CEEB'}}>
      <Canvas shadows camera={{position:[8,6,10], fov:60}}>
        <Sky sunPosition={[100,20,100]} />
        <ambientLight intensity={1.3}/>
        <directionalLight position={[15,20,10]} intensity={1.2} castShadow shadow-mapSize={2048}/>
        
        {/* MAP GROUND - sand + tar road */}
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[150,150]} /><meshStandardMaterial color="#cda86f" /></mesh>
        {/* Road */}
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,0]} receiveShadow><planeGeometry args={[6,150]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.03,0]}><planeGeometry args={[0.3,150]} /><meshStandardMaterial color="#fff" /></mesh>

        {/* KASI HOUSES - like real RDP */}
        <House p={[0,0,0]} color="#c97a3a" hasDoor />
        <House p={[5,0,3]} color="#a05a2a" />
        <House p={[-5,0,2]} color="#8B4513" hasDoor />
        <House p={[4,0,-5]} color="#b87a4a" />
        <House p={[-6,0,-4]} color="#9c5a2a" />
        <House p={[0,0,-8]} color="#d09050" hasDoor />
        <House p={[9,0,-2]} color="#7a4a2a" />
        {/* Spaza shop */}
        <group position={[12,0,8]}>
          <mesh castShadow><boxGeometry args={[3,2,4]} /><meshStandardMaterial color="#ff4444" /></mesh>
          <mesh position={[0,0.5,2.01]}><planeGeometry args={[2.5,0.8]} /><meshStandardMaterial color="#fff" /></mesh>
        </group>

        <HumanPlayer pos={player} dir={angle} />
        <OrbitControls target={[player.x,1,player.z]} enablePan={false} maxPolarAngle={Math.PI/2.15} minDistance={2.5} maxDistance={18}/>
      </Canvas>

      {/* MINI MAP */}
      <div style={{position:'absolute', top:10, right:10, width:110, height:110, background:'rgba(0,0,0,0.7)', border:'2px solid #fff', borderRadius:10, overflow:'hidden'}}>
        <div style={{position:'relative', width:'100%', height:'100%', background:'#cda86f'}}>
          <div style={{position:'absolute', left:'50%', top:0, width:6, height:'100%', background:'#333', transform:'translateX(-50%)'}}/>
          {/* houses dot */}
          <div style={{position:'absolute', left:50, top:50, width:6, height:6, background:'#8B4513', borderRadius:2}}/>
          <div style={{position:'absolute', left:70, top:60, width:6, height:6, background:'#8B4513', borderRadius:2}}/>
          <div style={{position:'absolute', left:20, top:40, width:6, height:6, background:'#8B4513', borderRadius:2}}/>
          {/* player dot */}
          <div style={{position:'absolute', left:50+player.x*3, top:50+player.z*3, width:10, height:10, background:'#00ff00', borderRadius:10, border:'2px solid #fff', transform:'translate(-50%,-50%)'}}/>
        </div>
        <div style={{fontSize:9, textAlign:'center', color:'#fff'}}>MAP - {zone}</div>
      </div>

      {/* FIXED JOYSTICK - NOW CORRECT DIRECTION */}
      <div style={{position:'absolute', bottom:15, left:15, display:'grid', gridTemplateColumns:'repeat(3,62px)', gridTemplateRows:'repeat(3,48px)', gap:6}}>
        <div/><button onTouchStart={()=>move(0,-0.7)} onMouseDown={()=>move(0,-0.7)} style={{background:'#fff',borderRadius:12,fontSize:22,fontWeight:'bold'}}>▲</button><div/>
        <button onTouchStart={()=>move(-0.7,0)} onMouseDown={()=>move(-0.7,0)} style={{background:'#fff',borderRadius:12,fontSize:22,fontWeight:'bold'}}>◀</button>
        <button style={{background:'rgba(0,0,0,0.6)',borderRadius:12,color:'#fff'}}>●</button>
        <button onTouchStart={()=>move(0.7,0)} onMouseDown={()=>move(0.7,0)} style={{background:'#fff',borderRadius:12,fontSize:22,fontWeight:'bold'}}>▶</button>
        <div/><button onTouchStart={()=>move(0,0.7)} onMouseDown={()=>move(0,0.7)} style={{background:'#fff',borderRadius:12,fontSize:22,fontWeight:'bold'}}>▼</button><div/>
      </div>

      <div style={{position:'absolute', bottom:20, right:15}}>
        <button style={{background:'#FFD700',padding:'16px 22px',fontWeight:'bold',borderRadius:12}}>🚕 OR TAMBO</button>
      </div>

      <div style={{position:'absolute', top:10, left:10, background:'rgba(0,0,0,0.8)', padding:'6px 12px', borderRadius:8, fontSize:11, color:'#fff'}}>
        RDP Zone 16 | HUMAN PLAYER | Joystick Fixed
      </div>
    </div>
  )
        }
