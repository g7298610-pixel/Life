"use client"
import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { WORLD, isColliding, getNearbyTrigger, generateKasiHouses, keepInsideWorld } from '../lib/protocol'

// HOUSES
function House({ pos }){
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh position={[0,1,0]} castShadow receiveShadow>
        <boxGeometry args={[4,2,4.5]}/><meshStandardMaterial color="#f5e6ca"/>
      </mesh>
      <mesh position={[0,2.4,0]} rotation={[0,0,0]} castShadow>
        <coneGeometry args={[3,1.5,4]} rotation={[0,Math.PI/4,0]}/><meshStandardMaterial color="#c62828"/>
      </mesh>
    </group>
  )
}
function Spaza({ pos }){
  return (
    <group position={[pos[0],0,pos[1]]}>
      <mesh position={[0,1.5,0]} castShadow><boxGeometry args={[7,3,5]}/><meshStandardMaterial color="#ffeb3b"/></mesh>
      <mesh position={[0,0.8,2.8]}><boxGeometry args={[1.2,2,0.2]}/><meshStandardMaterial color="#5d4037"/></mesh>
    </group>
  )
}
function Airport({ pos }){
  return (
    <group position={[pos[0],0,pos[1]]}>
      <mesh position={[0,1.5,0]} castShadow><boxGeometry args={[10,3,10]}/><meshStandardMaterial color="#4caf50"/></mesh>
    </group>
  )
}

// HUMAN PLAYER V1 - Legs Hands Face Body Movements
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
    const isMoving = mv.x!== 0 || mv.z!== 0

    if(isMoving){
      walkTime.current += dt * 8
      const swing = Math.sin(walkTime.current) * 0.8
      if(leftLeg.current) leftLeg.current.rotation.x = swing
      if(rightLeg.current) rightLeg.current.rotation.x = -swing
      if(leftArm.current) leftArm.current.rotation.x = -swing * 0.6
      if(rightArm.current) rightArm.current.rotation.x = swing * 0.6
      if(bodyRef.current) bodyRef.current.position.y = 1.1 + Math.abs(Math.sin(walkTime.current))*0.12
    } else {
      walkTime.current += dt * 2
      if(bodyRef.current) bodyRef.current.position.y = 1.1 + Math.sin(walkTime.current)*0.02
    }

    const speed = 4
    const nextPos = {
      x: group.current.position.x + mv.x*speed*dt,
      z: group.current.position.z - mv.z*speed*dt
    }
    keepInsideWorld(nextPos)
    let canMove = true
    for(const place of ALL_PLACES){
      if(place.solid && isColliding(nextPos, place)){ canMove = false; break }
    }
    if(canMove){
      group.current.position.x = nextPos.x
      group.current.position.z = nextPos.z
    }
    if(isMoving){
      const angle = Math.atan2(mv.x, mv.z)
      group.current.rotation.y = angle
    }
    const trig = getNearbyTrigger({x:group.current.position.x, z:group.current.position.z}, ALL_PLACES, 6)
    setTrigger(trig)
    state.camera.position.lerp({x:group.current.position.x, y:6, z:group.current.position.z+10}, 0.08)
    state.camera.lookAt(group.current.position.x, 1, group.current.position.z)
  })

  return (
    <group ref={group} position={[0,0,0]}>
      <mesh position={[0,0.01,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[0.5,16]}/><meshBasicMaterial color="black" transparent opacity={0.25}/></mesh>
      <group ref={leftLeg} position={[-0.15,0.4,0]}>
        <mesh position={[0,0.2,0]} castShadow><capsuleGeometry args={[0.12,0.5,4,8]}/><meshStandardMaterial color="#1a237e"/></mesh>
        <mesh position={[0,-0.2,0.05]}><boxGeometry args={[0.22,0.1,0.35]}/><meshStandardMaterial color="#111"/></mesh>
      </group>
      <group ref={rightLeg} position={[0.15,0.4,0]}>
        <mesh position={[0,0.2,0]} castShadow><capsuleGeometry args={[0.12,0.5,4,8]}/><meshStandardMaterial color="#1a237e"/></mesh>
        <mesh position={[0,-0.2,0.05]}><boxGeometry args={[0.22,0.1,0.35]}/><meshStandardMaterial color="#111"/></mesh>
      </group>
      <group ref={bodyRef} position={[0,1.1,0]}>
        <mesh castShadow><boxGeometry args={[0.6,0.7,0.35]}/><meshStandardMaterial color="#ff3d00"/></mesh>
        <group ref={leftArm} position={[-0.4,0.2,0]}>
          <mesh position={[0,-0.2,0]} castShadow><capsuleGeometry args={[0.08,0.4,4,8]}/><meshStandardMaterial color="#ffcc99"/></mesh>
        </group>
        <group ref={rightArm} position={[0.4,0.2,0]}>
          <mesh position={[0,-0.2,0]} castShadow><capsuleGeometry args={[0.08,0.4,4,8]}/><meshStandardMaterial color="#ffcc99"/></mesh>
        </group>
        <group position={[0,0.6,0]}>
          <mesh castShadow><sphereGeometry args={[0.28,16,16]}/><meshStandardMaterial color="#ffcc99"/></mesh>
          <mesh position={[-0.08,0.05,0.22]}><sphereGeometry args={[0.035]}/><meshStandardMaterial color="black"/></mesh>
          <mesh position={[0.08,0.05,0.22]}><sphereGeometry args={[0.035]}/><meshStandardMaterial color="black"/></mesh>
          <mesh position={[0,0.22,0]}><cylinderGeometry args={[0.3,0.3,0.12,16]}/><meshStandardMaterial color="#000"/></mesh>
        </group>
      </group>
    </group>
  )
}

export default function KasiRPG({ onTrigger }){
  const [trigger, setTrigger] = useState(null)
  const controlsRef = useRef({ move: {x:0,z:0} })
  const houses = useMemo(()=> generateKasiHouses(28), [])
  const ALL_PLACES = useMemo(()=> [...WORLD.kasi.places,...houses], [houses])

  return (
    <div style={{width:'100%',height:'100vh',background:'#87CEEB',position:'relative'}}>
      <Canvas shadows camera={{fov:60, position:[0,6,10]}} style={{background:'#87CEEB'}}>
        <ambientLight intensity={1.2}/>
        <directionalLight castShadow position={[15,20,10]} intensity={2}/>
        <fog attach="fog" args={['#87CEEB', 40, 120]}/>
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#d2b48c"/></mesh>
        <mesh position={[0,0.02,30]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[10,160]}/><meshStandardMaterial color="#222"/></mesh>

        {houses.map(h => <House key={h.id} pos={h.pos}/>)}
        {WORLD.kasi.places.map(p=>{
          if(p.type==='shop') return <Spaza key={p.id} pos={p.pos}/>
          if(p.type==='airport') return <Airport key={p.id} pos={p.pos}/>
          if(p.type==='house') return <House key={p.id} pos={p.pos}/>
          return null
        })}
        <Player ALL_PLACES={ALL_PLACES} setTrigger={setTrigger} controlsRef={controlsRef}/>
      </Canvas>

      <div style={{position:'absolute',top:10,left:10,right:10,display:'flex',justifyContent:'space-between',pointerEvents:'none'}}>
        <div style={{background:'rgba(0,0,0,0.7)',color:'white',padding:'6px 12px',borderRadius:20,fontSize:12}}>PROTOCOL V2: Can't walk through houses | Walk to buildings to trigger</div>
      </div>

      {trigger && (
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'black',color:'white',padding:'16px 24px',borderRadius:12,textAlign:'center'}}>
          <div style={{fontSize:18,marginBottom:8}}>{trigger.id.toUpperCase()} {trigger.trigger==='SHOP'?'ENTER SHOP':''} {trigger.trigger==='AIRPORT'?'✈️ BOARD PLANE':''}</div>
          <button onClick={()=> onTrigger && onTrigger(trigger)} style={{background:'#ff3d00',color:'white',border:'none',padding:'8px 16px',borderRadius:8,fontWeight:'bold'}}>ENTER</button>
        </div>
      )}

      <div style={{position:'absolute',bottom:20,left:20,width:120,height:120,borderRadius:'50%',border:'2px solid white',background:'rgba(255,255,255,0.15)'}}>
        <div id="joy" style={{position:'absolute',left:40,top:40,width:40,height:40,background:'white',borderRadius:'50%'}}/>
      </div>
      <div style={{position:'absolute',bottom:20,right:20,width:120,height:120,borderRadius:'50%',border:'2px dashed white',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'bold'}}>LOOK</div>
    </div>
  )
    }
