"use client"
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WORLD, isColliding, getNearbyTrigger, generateKasiHouses, keepInsideWorld } from '../lib/protocol'

function House({ pos }){
  return (
    <group position={[pos[0],0,pos[1]]}>
      <mesh position={[0,1,0]} castShadow><boxGeometry args={[4,2,4.5]}/><meshStandardMaterial color="#f5e6ca"/></mesh>
      <mesh position={[0,2.5,0]} castShadow><coneGeometry args={[3,1.2,4]} rotation={[0,0.785,0]}/><meshStandardMaterial color="#c62828"/></mesh>
    </group>
  )
}
function Spaza({ pos }){
  return <group position={[pos[0],0,pos[1]]}><mesh position={[0,1.5,0]} castShadow><boxGeometry args={[7,3,5]}/><meshStandardMaterial color="#ffeb3b"/></mesh></group>
}
function Airport({ pos }){
  return <group position={[pos[0],0,pos[1]]}><mesh position={[0,1.5,0]} castShadow><boxGeometry args={[10,3,10]}/><meshStandardMaterial color="#4caf50"/></mesh></group>
}

function Player({ ALL_PLACES, setTrigger, controlsRef }){
  const group = useRef()
  const leftLeg = useRef()
  const rightLeg = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const bodyRef = useRef()
  const walkTime = useRef(0)

  useFrame((state, dt)=>{
    if(!group.current) return
    const mv = controlsRef.current.move
    const isMoving = Math.abs(mv.x) > 0.05 || Math.abs(mv.z) > 0.05

    if(isMoving){
      walkTime.current += dt * 9
      const swing = Math.sin(walkTime.current) * 0.9
      if(leftLeg.current) leftLeg.current.rotation.x = swing
      if(rightLeg.current) rightLeg.current.rotation.x = -swing
      if(leftArm.current) leftArm.current.rotation.x = -swing*0.7
      if(rightArm.current) rightArm.current.rotation.x = swing*0.7
      if(bodyRef.current) bodyRef.current.position.y = 1.1 + Math.abs(Math.sin(walkTime.current))*0.12
    }

    const speed = 3.5
    const nextPos = {
      x: group.current.position.x + mv.x*speed*dt,
      z: group.current.position.z - mv.z*speed*dt
    }
    keepInsideWorld(nextPos)
    let canMove = true
    for(const p of ALL_PLACES){ if(p.solid && isColliding(nextPos,p)){canMove=false;break} }
    if(canMove){ group.current.position.x=nextPos.x; group.current.position.z=nextPos.z }

    if(isMoving){ group.current.rotation.y = Math.atan2(mv.x, mv.z) }

    const trig = getNearbyTrigger({x:group.current.position.x, z:group.current.position.z}, ALL_PLACES, 7)
    setTrigger(trig)

    const camYaw = controlsRef.current.yaw
    const camDist = 9
    const camX = group.current.position.x + Math.sin(camYaw)*camDist
    const camZ = group.current.position.z + Math.cos(camYaw)*camDist
    state.camera.position.lerp({x:camX, y:5.5, z:camZ}, 0.12)
    state.camera.lookAt(group.current.position.x, 1, group.current.position.z)
  })

  return (
    <group ref={group} position={[0,0,0]}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.45,12]}/><meshBasicMaterial color="black" transparent opacity={0.25}/></mesh>
      <group ref={leftLeg} position={[-0.16,0.4,0]}><mesh position={[0,0.15,0]} castShadow><capsuleGeometry args={[0.11,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh><mesh position={[0,-0.25,0.05]}><boxGeometry args={[0.2,0.1,0.3]}/><meshStandardMaterial color="#111"/></mesh></group>
      <group ref={rightLeg} position={[0.16,0.4,0]}><mesh position={[0,0.15,0]} castShadow><capsuleGeometry args={[0.11,0.45,4,6]}/><meshStandardMaterial color="#1a237e"/></mesh><mesh position={[0,-0.25,0.05]}><boxGeometry args={[0.2,0.1,0.3]}/><meshStandardMaterial color="#111"/></mesh></group>
      <group ref={bodyRef} position={[0,1.05,0]}>
        <mesh castShadow><boxGeometry args={[0.55,0.65,0.32]}/><meshStandardMaterial color="#ff3d00"/></mesh>
        <group ref={leftArm} position={[-0.38,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.38,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group>
        <group ref={rightArm} position={[0.38,0.15,0]}><mesh castShadow><capsuleGeometry args={[0.07,0.38,4,6]}/><meshStandardMaterial color="#ffcc99"/></mesh></group>
        <group position={[0,0.55,0]}>
          <mesh castShadow><sphereGeometry args={[0.26,12,12]}/><meshStandardMaterial color="#ffcc99"/></mesh>
          <mesh position={[0,0.18,0]}><cylinderGeometry args={[0.28,0.28,0.1,12]}/><meshStandardMaterial color="#111"/></mesh>
        </group>
      </group>
    </group>
  )
}

export default function KasiRPG({ onTrigger }){
  const [trigger,setTrigger]=useState(null)
  const controlsRef = useRef({ move:{x:0,z:0}, yaw: 0 })
  const houses = useMemo(()=>generateKasiHouses(28),[])
  const ALL_PLACES = useMemo(()=>[...WORLD.kasi.places,...houses],[houses])
  const joyRef = useRef()
  const joyInnerRef = useRef()
  const lookRef = useRef()

  useEffect(()=>{
    const joy = joyRef.current
    const inner = joyInnerRef.current
    const look = lookRef.current
    if(!joy ||!inner ||!look) return

    let joyActive=false
    let lookActive=false
    let lookStartX=0
    let startYaw=0

    const onJoyStart=(e)=>{
      joyActive=true
      e.preventDefault()
    }
    const onJoyMove=(e)=>{
      if(!joyActive) return
      const rect = joy.getBoundingClientRect()
      const cx = rect.left + rect.width/2
      const cy = rect.top + rect.height/2
      const touch = e.touches? e.touches[0] : e
      const dx = touch.clientX - cx
      const dy = touch.clientY - cy
      const dist = Math.sqrt(dx*dx+dy*dy)
      const max = 45
      const clampedDist = Math.min(dist, max)
      const angle = Math.atan2(dy,dx)
      const x = Math.cos(angle)*clampedDist
      const y = Math.sin(angle)*clampedDist
      inner.style.transform = `translate(${x}px, ${y}px)`
      controlsRef.current.move = { x: x/max, z: y/max }
    }
    const onJoyEnd=()=>{
      joyActive=false
      inner.style.transform = `translate(0px, 0px)`
      controlsRef.current.move = {x:0,z:0}
    }

    const onLookStart=(e)=>{
      lookActive=true
      const t = e.touches? e.touches[0] : e
      lookStartX = t.clientX
      startYaw = controlsRef.current.yaw
    }
    const onLookMove=(e)=>{
      if(!lookActive) return
      const t = e.touches? e.touches[0] : e
      const dx = t.clientX - lookStartX
      controlsRef.current.yaw = startYaw - dx*0.01
    }
    const onLookEnd=()=>{ lookActive=false }

    joy.addEventListener('touchstart', onJoyStart, {passive:false})
    window.addEventListener('touchmove', onJoyMove, {passive:false})
    window.addEventListener('touchend', onJoyEnd)
    joy.addEventListener('mousedown', onJoyStart)
    window.addEventListener('mousemove', onJoyMove)
    window.addEventListener('mouseup', onJoyEnd)

    look.addEventListener('touchstart', onLookStart, {passive:false})
    window.addEventListener('touchmove', onLookMove, {passive:false})
    window.addEventListener('touchend', onLookEnd)
    look.addEventListener('mousedown', onLookStart)
    window.addEventListener('mousemove', onLookMove)
    window.addEventListener('mouseup', onLookEnd)

    return ()=>{
      joy.removeEventListener('touchstart', onJoyStart)
      window.removeEventListener('touchmove', onJoyMove)
      window.removeEventListener('touchend', onJoyEnd)
      joy.removeEventListener('mousedown', onJoyStart)
      window.removeEventListener('mousemove', onJoyMove)
      window.removeEventListener('mouseup', onJoyEnd)
      look.removeEventListener('touchstart', onLookStart)
      window.removeEventListener('touchmove', onLookMove)
      window.removeEventListener('touchend', onLookEnd)
      look.removeEventListener('mousedown', onLookStart)
      window.removeEventListener('mousemove', onLookMove)
      window.removeEventListener('mouseup', onLookEnd)
    }
  },[])

  return (
    <div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative',overflow:'hidden'}}>
      <Canvas shadows camera={{fov:60}} style={{background:'#87CEEB'}}>
        <ambientLight intensity={1.1}/><directionalLight castShadow position={[10,18,8]} intensity={1.8}/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#d2b48c"/></mesh>
        <mesh position={[0,0.02,30]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[10,180]}/><meshStandardMaterial color="#212121"/></mesh>
        {houses.map(h=><House key={h.id} pos={h.pos}/>)}
        {WORLD.kasi.places.map(p=>{ if(p.type==='shop') return <Spaza key={p.id} pos={p.pos}/>; if(p.type==='airport') return <Airport key={p.id} pos={p.pos}/>; if(p.type==='house') return <House key={p.id} pos={p.pos}/>; return null })}
        <Player ALL_PLACES={ALL_PLACES} setTrigger={setTrigger} controlsRef={controlsRef}/>
      </Canvas>

      <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.6)',color:'white',padding:'4px 10px',borderRadius:12,fontSize:11}}>HUMAN V1: Legs + Arms Moving</div>

      {trigger && (<div style={{position:'absolute',top:'45%',left:'50%',transform:'translate(-50%,-50%)',background:'black',color:'white',padding:'14px 22px',borderRadius:12,textAlign:'center'}}><div style={{marginBottom:8,fontWeight:'bold'}}>{trigger.id} {trigger.trigger}</div><button onClick={()=>onTrigger&&onTrigger(trigger)} style={{background:'#ff3d00',color:'white',border:'none',padding:'8px 16px',borderRadius:8}}>ENTER</button></div>)}

      {/* JOYSTICK */}
      <div ref={joyRef} style={{position:'absolute',bottom:18,left:18,width:120,height:120,borderRadius:'50%',border:'2px solid white',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none'}}>
        <div ref={joyInnerRef} style={{width:44,height:44,background:'white',borderRadius:'50%',transition:'transform 0.05s'}}/>
      </div>
      {/* LOOK */}
      <div ref={lookRef} style={{position:'absolute',bottom:18,right:18,width:120,height:120,borderRadius:'50%',border:'2px dashed white',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'bold',touchAction:'none'}}>LOOK</div>
    </div>
  )
    }
