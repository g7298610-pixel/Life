export const WORLD = {
  center: { lat: -25.585114, lng: 27.972712 },
  neighborhoods: {
    unit20: { name: "Unit 20", center: [-65, -35], radius: 28 },
    unit16: { name: "Unit 16", center: [-5, 25], radius: 65 },
    unit4: { name: "Unit 4", center: [72, 32], radius: 32 },
    tsunami: { name: "Tsunami - North", center: [0, -62], radius: 80, type: "veld" },
    mall: { name: "Garankuwa Mall", center: [115, 48], radius: 10 }
  },
  kasi: {
    places: [
      { id: 'me-house', pos: [-62, -32], size: [6,6], solid: false, type: 'house', neighborhood: 'unit20', isSpawn: true, label: '95 Zone 20' },
      { id: 'rantailane-high', pos: [-10, -38], size: [14,14], solid: true, type: 'school', label: 'Rantailane High' },
      { id: 'spaza-main', pos: [28, -38], size: [4,4], solid: true, type: 'spaza', onMainSt: true },
      { id: 'garankuwa-mall', pos: [115, 48], size: [20,20], solid: true, type: 'mall' },
      { id: 'bodubelo-primary', pos: [-35, -5], size: [12,12], solid: true, type: 'school' },
      { id: 'lowe-primary', pos: [25, -8], size: [12,12], solid: true, type: 'school' },
      { id: 'main-st', pos: [0, -42], size: [200, 6], solid: false, type: 'road', name: 'Main St' },
    ]
  },
  roads: [
    { id: "MainSt", points: [[-90, -45], [90, -38]], width: 9 },
    { id: "MallRoad", points: [[45, -20], [115, 45]], width: 7 },
  ]
}

export function keepInsideWorld(p){ const limit=290; p.x=Math.max(-limit,Math.min(limit,p.x)); p.z=Math.max(-limit,Math.min(limit,p.z)); }
export function getNearbyTrigger(p, places, dist=6){
  for(const pl of places){
    if(!pl.pos) continue;
    const d=Math.sqrt((p.x-pl.pos[0])**2 + (p.z-pl.pos[1])**2);
    if(d<dist) return pl;
  } return null;
}
export function generateKasiHouses(count=60){
  const houses=[]; let id=0;
  for(let r=0;r<3;r++){ for(let c=0;c<6;c++){
    const x=-80+c*6.5, z=-38+r*8;
    if(Math.hypot(x+65,z+35)<28) houses.push({id:`house-U20-${id++}`,pos:[x,z],size:[5,5],solid:false,type:'house',side:1,neighborhood:'unit20'})
  }}
  for(let i=0;i<70;i++){
    const angle=Math.random()*Math.PI*2, dist=18+Math.random()*48;
    const x=-5+Math.cos(angle)*dist*0.9, z=25+Math.sin(angle)*dist*0.7;
    if(Math.hypot(x+35,z+5)<12) continue; if(Math.hypot(x-25,z+8)<12) continue;
    houses.push({id:`house-U16-${id++}`,pos:[x,z],size:[5,5],solid:false,type:'house',side:Math.random()>0.5?1:-1,neighborhood:'unit16'})
  }
  for(let i=0;i<25;i++){ const x=60+Math.random()*28, z=15+Math.random()*35; houses.push({id:`house-U4-${id++}`,pos:[x,z],size:[5,5],solid:false,type:'house',side:1,neighborhood:'unit4'}) }
  return houses;
}
