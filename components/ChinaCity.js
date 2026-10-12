"use client"
import { Canvas } from '@react-three/fiber'

export default function ChinaCity({onBack}){
  return (
    <div style={{width:'100%',height:'100vh',background:'linear-gradient(#87CEEB,#FF6B6B)'}}>
      <Canvas>
        <ambientLight intensity={1}/>
        <mesh position={[0,1,0]}><boxGeometry args={[2,3,2]}/><meshStandardMaterial color="#d32f2f"/></mesh>
        <mesh position={[0,2.8,0]} rotation={[0,0,0]}><coneGeometry args={[1.8,1,4]}/><meshStandardMaterial color="#FFD700"/></mesh>
      </Canvas>
      <div style={{position:'absolute',top:20,left:20,color:'#fff',fontWeight:'bold'}}>🇨🇳 ZHANGJIAJIE CITY - You landed!</div>
      <button onClick={onBack} style={{position:'absolute',bottom:30,left:'50%',transform:'translateX(-50%)',padding:15,background:'#fff',borderRadius:10}}>FLY BACK TO KASI ✈️</button>
    </div>
  )
}
