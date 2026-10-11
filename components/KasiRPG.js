"use client"
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function Human({pos, rot}){
  const ref=useRef()
  useFrame(()=>{ if(ref.current){ ref.current.position.x=pos.x; ref.current.position.z=pos.z; ref.current.rotation.y=rot } })
  return (
    <group ref={ref}>
      <mesh position={[0,0.9,0]}><capsuleGeometry args={[0.28,0.55]}/><meshStandardMaterial color="#1e90ff"/></mesh>
      <mesh position={[0,1.55,0]}><sphereGeometry args={[0.32,16,16]}/><meshStandardMaterial color="#ffdbac"/></mesh>
      <mesh position={[0,1.75,0.1]}><cylinderGeometry args={[0.35,0.35,0.14,16]}/><meshStandardMaterial color="black"/></mesh>
      <mesh position={[-0.15,0.2,0]}><capsuleGeometry args={[0.11,0.45]}/><meshStandardMaterial color="#111"/></mesh>
      <mesh position={[0.15,0.2,0]}><capsuleGeometry args={[0.11,0.45]}/><meshStandardMaterial color="#111"/></mesh>
    </group>
  )
}

function House({p,c}){
  return <group position={p}><mesh position={[0,0.9,0]}><boxGeometry args={[3,1.8,3.5]}/><meshStandardMaterial color={c}/></mesh><mesh position={[0,2,0]}><coneGeometry args={[2.2,1.1,4]} rotation={[0,0.78,0]}/><meshStandardMaterial color="#5a2f18"/></mesh></group>
}

function CameraRig({player, yaw}){
  useFrame(({camera})=>{
    const dist=7
    const x = player.x + Math.sin(yaw)*dist
    const z = player.z + Math.cos(yaw)*dist
    camera.position.lerp(new THREE.Vector3(x, 3.5, z), 0.12)
    camera.lookAt(player.x, 1, player.z)
  })
  return null
}

export default function KasiRPG({zone, onGoPlane}){
  const [player,setPlayer]=useState({x:0,z:6})
  const [rot,setRot]=useState(0)
  const [yaw,setYaw]=useState(0)
  const [inside,setInside]=useState(false)
  const [showMap,setShowMap]=useState(false)

  const move=(f,s)=>{
    const fx=Math.sin(yaw)*f
    const fz=Math.cos(yaw)*f
    const sx=Math.sin(yaw+Math.PI/2)*s
    const sz=Math.cos(yaw+Math.PI/2)*s
    const nx=player.x+fx+sx
    const nz=player.z+fz+sz
    if(Math.abs(nx)<1.3 && Math.abs(nz)<1.3){ setInside(true); return }
    setPlayer({x:nx,z:nz})
    if(f||s) setRot(Math.atan2(fx+sx,fz+sz))
  }

  if(inside) return (
    <div style={{height:'85vh',background:'#201506',padding:20,color:'#fff'}}>
      <h2>🏠 RDP {zone}</h2><button onClick={()=>setInside(false)} style={{padding:12,background:'#fff',borderRadius:8}}>LEAVE</button>
      <button onClick={onGoPlane} style={{padding:12,background:'#FFD700',marginLeft:10,borderRadius:8}}>🚕 OR TAMBO R150</button>
    </div>
  )

  return (
    <div style={{height:'88vh',width:'100%',position:'relative',background:'#87CEEB',overflow:'hidden'}}>
      <Canvas>
        <ambientLight intensity={1.3}/><directionalLight position={[10,15,8]} intensity={1}/>
        <mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[200,200]}/><meshStandardMaterial color="#d2a679"/></mesh>
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,0]}><planeGeometry args={[8,200]}/><meshStandardMaterial color="#222"/></mesh>
        <House p={[0,0,0]} c="#c97a3a"/><House p={[5,0,3]} c="#a05a2a"/><House p={[-5,0,2]} c="#8B4513"/><House p={[4,0,-5]} c="#b87a4a"/><House p={[-6,0,-4]} c="#9c5a2a"/><House p={[9,0,-1]} c="#7a4a2a"/>
        <Human pos={player} rot={rot}/>
        <CameraRig player={player} yaw={yaw}/>
      </Canvas>

      {showMap && (
        <div style={{position:'absolute',inset:0,zIndex:30,background:'#000'}}>
          <iframe title="Ga-Rankuwa Map" width="100%" height="100%" frameBorder="0" style={{border:0}} src="https://www.openstreetmap.org/export/embed.html?bbox=27.94%2C-25.64%2C28.03%2C-25.58&layer=mapnik&marker=-25.61%2C27.985" />
          <button onClick={()=>setShowMap(false)} style={{position:'absolute',top:10,left:10,padding:12,background:'#fff',borderRadius:8,fontWeight:'bold'}}>✕ CLOSE REAL MAP</button>
          <a href="https://www.google.com/maps/search/Ga-Rankuwa/" target="_blank" style={{position:'absolute',bottom:20,left:10,background:'#4285F4',color:'#fff',padding:12,borderRadius:8,textDecoration:'none'}}>Open in Google Maps</a>
        </div>
      )}

      <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.75)',color:'#fff',padding:6,borderRadius:6,fontSize:10}}>PUBG: ▲ goes where camera looks | Drag right to rotate</div>
      <button onClick={()=>setShowMap(true)} style={{position:'absolute',top:8,right:8,background:'#4285F4',color:'#fff',padding:8,borderRadius:8,fontSize:11,fontWeight:'bold'}}>🗺️ REAL Ga-Rankuwa Map</button>

      <div style={{position:'absolute',bottom:14,left:14,display:'grid',gridTemplateColumns:'repeat(3,60px)',gridTemplateRows:'repeat(3,46px)',gap:6}}>
        <div/><button onTouchStart={e=>{e.preventDefault(); move(-0.9,0)}} onMouseDown={()=>move(-0.9,0)} style={{background:'#fff',borderRadius:12,fontWeight:'bold'}}>▲</button><div/>
        <button onTouchStart={e=>{e.preventDefault(); move(0,-0.8)}} onMouseDown={()=>move(0,-0.8)} style={{background:'#fff',borderRadius:12}}>◀</button>
        <div style={{background:'rgba(0,0,0,0.5)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>●</div>
        <button onTouchStart={e=>{e.preventDefault(); move(0,0.8)}} onMouseDown={()=>move(0,0.8)} style={{background:'#fff',borderRadius:12}}>▶</button>
        <div/><button onTouchStart={e=>{e.preventDefault(); move(0.9,0)}} onMouseDown={()=>move(0.9,0)} style={{background:'#ddd',borderRadius:12}}>▼</button><div/>
      </div>

      {/* RIGHT STICK - CAMERA */}
      <div
        onTouchMove={e=>{
          const t=e.touches[0]; if(!t) return
          setYaw(y=> y - (t.movementX||2)*0.02)
        }}
        onTouchStart={e=>{
          let lastX=e.touches[0].clientX
          const handle=(ev)=>{
            const x=ev.touches[0].clientX
            setYaw(y=> y - (x-lastX)*0.02)
            lastX=x
          }
          window.addEventListener('touchmove',handle)
          window.addEventListener('touchend',()=>window.removeEventListener('touchmove',handle),{once:true})
        }}
        style={{position:'absolute',bottom:14,right:14,width:130,height:130,background:'rgba(255,255,255,0.2)',border:'2px dashed #fff',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,textAlign:'center'}}
      >DRAG TO<br/>ROTATE CAM<br/>👁️<br/>PUBG</div>

      <button onClick={onGoPlane} style={{position:'absolute',bottom:160,right:14,background:'#FFD700',padding:12,borderRadius:10,fontWeight:'bold'}}>🚕 OR TAMBO</button>
    </div>
  )
    }
