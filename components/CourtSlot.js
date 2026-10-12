"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'

function JudgeBench(){
  return (
    <group position={[0,0,-4]}>
      {/* main bench - dark mahogany */}
      <mesh position={[0,1,0]} castShadow receiveShadow>
        <boxGeometry args={[9,1.8,1.5]} />
        <meshStandardMaterial color="#2b1a0f" roughness={0.6} metalness={0.2}/>
      </mesh>
      {/* gold front */}
      <mesh position={[0,1.1,0.8]} castShadow>
        <boxGeometry args={[8.5,0.4,0.1]} />
        <meshStandardMaterial color="#c5a100" metalness={0.8} roughness={0.2}/>
      </mesh>
      {/* judge chair - high back */}
      <mesh position={[0,1.3,-0.2]} castShadow>
        <boxGeometry args={[1.4,1.6,1]} />
        <meshStandardMaterial color="#111" roughness={0.9}/>
      </mesh>
      {/* yellow seat is now leather */}
      <mesh position={[0,1.1,0.1]} castShadow>
        <boxGeometry args={[1.2,0.2,0.9]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8}/>
      </mesh>
    </group>
  )
}

function Dock(){
  return (
    <mesh position={[0,0.5,2.5]} castShadow receiveShadow>
      <boxGeometry args={[2.5,1,1.5]} />
      <meshStandardMaterial color="#4a3b2a" roughness={0.8}/>
    </mesh>
  )
}

export default function CourtSlot({onBack}){
  return (
    <div style={{width:'100%',height:'100vh',background:'#0a0a0a',position:'relative'}}>
      <Canvas shadows camera={{position:[0,3,4],fov:55}}>
        <ambientLight intensity={0.5}/>
        <directionalLight castShadow position={[5,10,5]} intensity={1.5} shadow-mapSize={[2048,2048]}/>
        <pointLight position={[0,5,0]} intensity={0.8} color="#ffcc88"/>
        
        {/* floor - polished wood */}
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[30,30]}/>
          <meshStandardMaterial color="#3e2723" roughness={0.3} metalness={0.1}/>
        </mesh>

        <JudgeBench/>
        <Dock/>

        {/* South African flag colors on wall */}
        <mesh position={[-4,3,-5.5]}><planeGeometry args={[1,2]}/><meshStandardMaterial color="#007A4D" /></mesh>
        <mesh position={[-2.8,3,-5.5]}><planeGeometry args={[1,2]}/><meshStandardMaterial color="#fff" /></mesh>

        <ContactShadows position={[0,0.01,0]} scale={20} blur={2} opacity={0.6}/>
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI/2.1} minDistance={2} maxDistance={10}/>
      </Canvas>

      <div style={{position:'absolute',top:10,left:10,right:80,background:'rgba(0,0,0,0.8)',color:'#fff',padding:'10px 14px',borderRadius:10,borderLeft:'4px solid #FFD700'}}>
        <div style={{fontWeight:'bold',fontSize:14}}>⚖️ GA-RANKUWA HIGH COURT</div>
        <div style={{fontSize:11,opacity:0.8}}>Case A22936/2025 - Blind Birth</div>
      </div>

      <button onClick={onBack} style={{position:'absolute',top:10,right:10,padding:'12px 18px',background:'#fff',color:'#000',fontWeight:'bold',borderRadius:10,border:'none'}}>
        BACK
      </button>
    </div>
  )
        }
