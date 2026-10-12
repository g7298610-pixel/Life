"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function CourtSlot({onBack}){
  return (
    <div style={{width:'100%',height:'100vh',background:'#e0c9a6',position:'relative'}}>
      <Canvas shadows camera={{position:[0,4,6],fov:50}} style={{background:'#e0c9a6'}}>
        {/* SUPER BRIGHT LIGHTS */}
        <ambientLight intensity={1.8}/>
        <directionalLight castShadow position={[5,10,5]} intensity={2} />
        <directionalLight position={[-5,8,-5]} intensity={1.2} />
        <pointLight position={[0,6,0]} intensity={1.5} />

        {/* LIGHT FLOOR - not dark brown */}
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[40,40]}/>
          <meshStandardMaterial color="#d2b48c" roughness={0.8}/>
        </mesh>

        {/* JUDGE BENCH - light wood */}
        <mesh position={[0,1.2,-3.5]} castShadow receiveShadow>
          <boxGeometry args={[10,2,2]}/>
          <meshStandardMaterial color="#8d6e63" roughness={0.7}/>
        </mesh>
        {/* GOLD STRIP */}
        <mesh position={[0,1.4,-2.6]} castShadow>
          <boxGeometry args={[9,0.3,0.2]}/>
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.3}/>
        </mesh>
        {/* Judge chair */}
        <mesh position={[0,1.8,-3.2]} castShadow>
          <boxGeometry args={[1.5,1.2,1]}/>
          <meshStandardMaterial color="#3e2723"/>
        </mesh>

        {/* DOCK - where you stand */}
        <mesh position={[0,0.6,2]} castShadow receiveShadow>
          <boxGeometry args={[3,1.2,1.8]}/>
          <meshStandardMaterial color="#6d4c41"/>
        </mesh>

        {/* SA FLAG ON WALL - big and visible */}
        <group position={[0,3.5,-5]}>
          <mesh position={[-2.5,0,0]}><planeGeometry args={[1.2,2]}/><meshStandardMaterial color="#007A4D" side={2}/></mesh>
          <mesh position={[-1.2,0,0]}><planeGeometry args={[1.2,2]}/><meshStandardMaterial color="#ffffff" side={2}/></mesh>
          <mesh position={[0,0,0]}><planeGeometry args={[1.2,2]}/><meshStandardMaterial color="#000000" side={2}/></mesh>
          <mesh position={[1.2,0,0]}><planeGeometry args={[1.2,2]}/><meshStandardMaterial color="#FFB612" side={2}/></mesh>
          <mesh position={[2.5,0,0]}><planeGeometry args={[1.2,2]}/><meshStandardMaterial color="#DE3831" side={2}/></mesh>
        </group>

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI/2.2} target={[0,1,0]}/>
      </Canvas>

      <div style={{position:'absolute',top:12,left:12,background:'black',color:'white',padding:'10px 14px',borderRadius:10,borderLeft:'5px solid #FFD700',maxWidth:'70%'}}>
        <div style={{fontWeight:'900',fontSize:15}}>⚖️ GA-RANKUWA HIGH COURT</div>
        <div style={{fontSize:12}}>A22936/2025 - Bright Court V2</div>
      </div>

      <button onClick={onBack} style={{position:'absolute',top:12,right:12,padding:'12px 20px',background:'white',color:'black',fontWeight:'900',borderRadius:12,border:'none',boxShadow:'0 4px 10px rgba(0,0,0,0.5)'}}>BACK</button>
    </div>
  )
          }
