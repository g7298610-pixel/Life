"use client"
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WORLD, isColliding, getNearbyTrigger, generateKasiHouses, keepInsideWorld } from '../lib/protocol'

const WALLS = ["#f5e6ca","#ffe0b2","#e1bee7","#b2dfdb","#ffccbc","#dcedc8","#fff9c4"]
const ROOFS = ["#c62828","#2e7d32","#1565c0","#4e342e","#37474f","#ef6c00"]

function TownshipHouse({ pos, seed, side }){
  const wall = WALLS[seed % WALLS.length]
  const roof = ROOFS[seed % ROOFS.length]
  const big = seed % 2 === 0
  // side = -1 left of road, 1 right of road -> rotate to face road
  const rotY = side === -1? Math.PI/2 : -Math.PI/2

  return (
    <group position={[pos[0],0,pos[1]]} rotation={[0,rotY,0]}>
      {/* Floor inside */}
      <mesh position={[0,0.05,0]} receiveShadow><boxGeometry args={[5,0.1,5]}/><meshStandardMaterial color="#e0d3b8"/></mesh>

      {/* Walls - with doorway open so you can enter */}
      {/* Back wall */}
      <mesh position={[0,1,-2.4]} castShadow><boxGeometry args={[5,2.2,0.2]}/><meshStandardMaterial color={wall}/></mesh>
      {/* Left wall */}
      <mesh position={[-2.4,1,0]} castShadow><boxGeometry args={[0.2,2.2,5]}/><meshStandardMaterial color={wall}/></mesh>
      {/* Right wall */}
      <mesh position={[2.4,1,0]} castShadow><boxGeometry args={[0.2,2.2,5]}/><meshStandardMaterial color={wall}/></mesh>
      {/* Front wall - split for door and garage */}
      <mesh position={[-1.5,1,2.4]} castShadow><boxGeometry args={[1.8,2.2,0.2]}/><meshStandardMaterial color={wall}/></mesh>
      <mesh position={[1.5,0.7,2.4]} castShadow><boxGeometry args={[1.8,1.5,0.2]}/><meshStandardMaterial color={wall}/></mesh> {/* Garage lower */}
      <mesh position={[1.5,1.85,2.4]}><boxGeometry args={[1.8,0.3,0.2]}/><meshStandardMaterial color={wall}/></mesh>

      {/* Roof */}
      <mesh position={[0,2.5,0]} castShadow><boxGeometry args={[5.4,0.3,5.4]}/><meshStandardMaterial color={roof}/></mesh>

      {/* DOOR FRAME - open gap you walk through */}
      <mesh position={[-1.5,1,2.5]}><boxGeometry args={[0.9,1.6,0.05]}/><meshStandardMaterial color="#5d4037"/></mesh>

      {/* WINDOWS - real holes */}
      <mesh position={[0,1.1,2.5]}><boxGeometry args={[0.8,0.8,0.05]}/><meshStandardMaterial color="#81d4fa" transparent opacity={0.7}/></mesh>
      {/* Garage door */}
      <mesh position={[1.5,0.7,2.55]}><boxGeometry args={[1.4,1.2,0.05]}/><meshStandardMaterial color="#616161"/></mesh>
    </group>
  )
}

function ChinaMallInside({ pos }){
  return (
    <group position={[pos[0],0,pos[1]]}>
      <mesh position={[0,0.05,0]}><boxGeometry args={[14,0.1,14]}/><meshStandardMaterial color="#eeeeee"/></mesh>
      {/* Walls with big entrance so camera goes in */}
      <mesh position={[0,1.5,-7]}><boxGeometry args={[14,3,0.3]}/><meshStandardMaterial color="#bdbdbd"/></mesh>
      <mesh position={[-6.85,1.5,0]}><boxGeometry args={[0.3,3,14]}/><meshStandardMaterial color="#bdbdbd"/></mesh>
      <mesh position={[6.85,1.5,0]}><boxGeometry args={[0.3,3,14]}/><meshStandardMaterial color="#bdbdbd"/></mesh>
      <mesh position={[-4,1.5,7]}><boxGeometry args={[6,3,0.3]}/><meshStandardMaterial color="#bdbdbd"/></mesh>
      <mesh position={[4,1.5,7]}><boxGeometry args={[6,3,0.3]}/><meshStandardMaterial color="#bdbdbd"/></mesh>
      {/* Roof */}
      <mesh position={[0,3.2,0]}><boxGeometry args={[15,0.4,15]}/><meshStandardMaterial color="#263238"/></mesh>
      <mesh position={[0,1.5,0]}><boxGeometry args={[2,2,2]}/><meshStandardMaterial color="#ffeb3b"/></mesh>
    </group>
  )
}

//... Player code same as V3 (speed 5)...

function Player({ ALL_PLACES, setTrigger, controlsRef }){
  const group = useRef()
  const leftLeg = useRef(); const rightLeg = useRef(); const leftArm = useRef(); const rightArm = useRef(); const bodyRef = useRef()
  const walkTime = useRef(0)
  useFrame((state, dt)=>{
    if(!group.current) return
    const mv = controlsRef.current.move
    const isMoving = Math.abs(mv.x)>0.05 || Math.abs(mv.z)>0.05
    if(isMoving){
      walkTime.current+=dt*9
      const swing=Math.sin(walkTime.current)*0.9
      if(leftLeg.current) leftLeg.current.rotation.x=swing
      if(rightLeg.current) rightLeg.current.rotation.x=-swing
      if(leftArm.current) leftArm.current.rotation.x=-swing*0.7
      if(rightArm.current) rightArm.current.rotation.x=swing*0.7
      if(bodyRef.current) bodyRef.current.position.y=1.1+Math.abs(Math.sin(walkTime.current))*0.1
    }
    const speed=5
    const nextPos={ x: group.current.position.x + mv.x*speed*dt, z: group.current.position.z - mv.z*speed*dt }
    keepInsideWorld(nextPos)
    // Only collide with back walls, not front - so you CAN enter houses
    let canMove=true
    for(const p of ALL_PLACES){ if(p.solid && p.id.includes('back') && isColliding(nextPos,p)){canMove=false;break} }
    if(canMove){ group.current.position.x=nextPos.x; group.current.position.z=nextPos.z }
    if(isMoving) group.current.rotation.y=Math.atan2(mv.x, mv.z)
    setTrigger(getNearbyTrigger({x:group.current.position.x, z:group.current.position.z}, ALL_PLACES, 7))
    const yaw=controlsRef.current.yaw
    const camX=group.current.position.x + Math.sin(yaw)*7
    const camZ=group.current.position.z + Math.cos(yaw)*7
    state.camera.position.lerp({x:camX, y:2.2, z:camZ}, 0.15) // Lower cam so it enters houses
    state.camera.lookAt(group.current.position.x, 1, group.current.position.z)
  })
  return (
    <group ref={group} position={[0,0,15]}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.45,12]}/><meshBasicMaterial color="black" transparent opacity={0.25}/></mesh>
      <group ref={leftLeg} position={[-0.16,0.4,0]}><mesh position={[0,0.15,0]} castShadow><capsuleGeometry args={[0.11,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh></group>
      <group ref={rightLeg} position={[0.16,0.4,0]}><mesh position={[0,0.15,0]} castShadow><capsuleGeometry args={[0.11,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh></group>
      <group ref={bodyRef} position={[0,1.05,0]}>
        <mesh castShadow><boxGeometry args={[0.55,0.65,0.32]}/><meshStandardMaterial color="#ff3d00"/></mesh>
        <group ref={leftArm} position={[-0.38,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.38,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group>
        <group ref={rightArm} position={[0.38,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.38,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group>
        <group position={[0,0.55,0]}><mesh castShadow><sphereGeometry args={[0.26,12,12]}/><meshStandardMaterial color="#ffcc99"/></mesh><mesh position={[0,0.18,0]}><cylinderGeometry args={[0.28,0.28,0.1,12]}/><meshStandardMaterial color="#111"/></mesh></group>
      </group>
    </group>
  )
}

export default function KasiRPG({ onTrigger }){
  const [trigger,setTrigger]=useState(null)
  const controlsRef=useRef({ move:{x:0,z:0}, yaw:0 })
  const houses=useMemo(()=>generateKasiHouses(60),[])
  const ALL_PLACES=useMemo(()=>[...WORLD.kasi.places,...houses],[houses])
  const joyRef=useRef(); const joyInnerRef=useRef(); const lookRef=useRef()
  useEffect(()=>{
    const joy=joyRef.current, inner=joyInnerRef.current, look=lookRef.current
    if(!joy||!inner||!look) return
    let joyActive=false, lookActive=false, lookStartX=0, startYaw=0
    const onJoyStart=e=>{joyActive=true; e.preventDefault()}
    const onJoyMove=e=>{
      if(!joyActive) return
      const rect=joy.getBoundingClientRect(); const cx=rect.left+rect.width/2, cy=rect.top+rect.height/2
      const t=e.touches?e.touches[0]:e; const dx=t.clientX-cx, dy=t.clientY-cy
      const dist=Math.sqrt(dx*dx+dy*dy), max=45; const clamped=Math.min(dist,max), ang=Math.atan2(dy,dx)
      const x=Math.cos(ang)*clamped, y=Math.sin(ang)*clamped
      inner.style.transform=`translate(${x}px, ${y}px)`
      controlsRef.current.move={x:x/max, z:y/max}
    }
    const onJoyEnd=()=>{joyActive=false; inner.style.transform=`translate(0px,0px)`; controlsRef.current.move={x:0,z:0}}
    const onLookStart=e=>{lookActive=true; const t=e.touches?e.touches[0]:e; lookStartX=t.clientX; startYaw=controlsRef.current.yaw}
    const onLookMove=e=>{if(!lookActive) return; const t=e.touches?e.touches[0]:e; controlsRef.current.yaw=startYaw - (t.clientX-lookStartX)*0.01}
    const onLookEnd=()=>{lookActive=false}
    joy.addEventListener('touchstart',onJoyStart,{passive:false})
    window.addEventListener('touchmove',onJoyMove,{passive:false})
    window.addEventListener('touchend',onJoyEnd)
    look.addEventListener('touchstart',onLookStart,{passive:false})
    window.addEventListener('touchmove',onLookMove,{passive:false})
    window.addEventListener('touchend',onLookEnd)
    return ()=>{ joy.removeEventListener('touchstart',onJoyStart); window.removeEventListener('touchmove',onJoyMove); window.removeEventListener('touchend',onJoyEnd); }
  },[])

  return (
    <div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative',overflow:'hidden'}}>
      <Canvas shadows camera={{fov:60}} style={{background:'#87CEEB'}}>
        <ambientLight intensity={1.1}/><directionalLight castShadow position={[10,18,8]} intensity={1.8}/>
        {/* SAND EVERYWHERE */}
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[600,600]}/><meshStandardMaterial color="#c2b280"/></mesh>
        {/* TAR ROAD */}
        <mesh position={[0,0.03,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[10,600]}/><meshStandardMaterial color="#212121"/></mesh>
        {/* CONCRETE PAVEMENT */}
        <mesh position={[-6.5,0.04,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3,600]}/><meshStandardMaterial color="#9e9e9e"/></mesh>
        <mesh position={[6.5,0.04,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3,600]}/><meshStandardMaterial color="#9e9e9e"/></mesh>

        {houses.map((h,i)=>{
          const side = h.pos[0] < 0? -1 : 1
          return <TownshipHouse key={h.id} pos={h.pos} seed={i} side={side}/>
        })}
        <ChinaMallInside pos={[0,0,-80]}/>
        <Player ALL_PLACES={ALL_PLACES} setTrigger={setTrigger} controlsRef={controlsRef}/>
      </Canvas>
      <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.6)',color:'white',padding:'4px 10px',borderRadius:12,fontSize:11}}>V4: Sand + Tar + Pavement + Enterable Houses</div>
      {trigger && (<div style={{position:'absolute',top:'45%',left:'50%',transform:'translate(-50%,-50%)',background:'black',color:'white',padding:'14px 22px',borderRadius:12}}><div style={{marginBottom:8}}>{trigger.id}</div><button onClick={()=>onTrigger&&onTrigger(trigger)} style={{background:'#ff3d00',color:'white',border:'none',padding:'8px 16px',borderRadius:8}}>ENTER</button></div>)}
      <div ref={joyRef} style={{position:'absolute',bottom:18,left:18,width:120,height:120,borderRadius:'50%',border:'2px solid white',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}><div ref={joyInnerRef} style={{width:44,height:44,background:'white',borderRadius:'50%'}}/></div>
      <div ref={lookRef} style={{position:'absolute',bottom:18,right:18,width:120,height:120,borderRadius:'50%',border:'2px dashed white',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'bold'}}>LOOK</div>
    </div>
  )
}
