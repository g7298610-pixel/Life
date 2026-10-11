"use client"
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function CourtRoom({isJudge}){
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]}>
        <planeGeometry args={[20,20]} />
        <meshStandardMaterial color="#5a3a20" />
      </mesh>
      {/* Judge bench */}
      <mesh position={[0,1,-6]}>
        <boxGeometry args={[6,2,1]} />
        <meshStandardMaterial color={isJudge?'#FFD700':'#4a2a10'} />
      </mesh>
      {/* Judge chair - only 1 */}
      <mesh position={[0,0.5,-5]}>
        <boxGeometry args={[1.2,1.2,1.2]} />
        <meshStandardMaterial color={isJudge?'#ff0000':'#333'} />
      </mesh>
      {/* Player benches */}
      <mesh position={[0,0.5,2]}>
        <boxGeometry args={[8,0.5,1]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </>
  )
}

export default function CourtSlot() {
  const [judge, setJudge] = useState('Bot Judge Mahlangu')
  const isYou = judge.includes('You')
  const queue = ['Thabo (25 wins)', 'Lerato (22 wins)', 'You (0 wins)']

  return (
    <div style={{height:'75vh', width:'100%', background:'#000'}}>
      <div style={{padding:15, background:'#111', border:'2px solid #fff'}}>
        <h3 style={{margin:0}}>COURT — 1 Chair Only</h3>
        <p>Current Judge: <b style={{color:isYou?'#0f0':'#ff0'}}>{judge}</b></p>
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          <button onClick={()=>setJudge('You — Real Player')} style={{background:'#0f0', color:'#000'}}>TAKE OVER (Bot stands up)</button>
          <button onClick={()=>setJudge('Bot Judge Mahlangu')} style={{background:'#f00', color:'#fff'}}>LOG OFF (Bot sits again)</button>
        </div>
        <p style={{fontSize:12, color:'#aaa'}}>Queue: {queue.join(', ')} | Shifts: 08-10, 10-12, 12-14, 14-16</p>
      </div>

      <Canvas camera={{position:[0,5,8]}}>
        <ambientLight intensity={0.6}/>
        <directionalLight position={[5,10,5]} intensity={1}/>
        <CourtRoom isJudge={isYou}/>
        <OrbitControls maxPolarAngle={Math.PI/2.1}/>
      </Canvas>
    </div>
  )
        }
