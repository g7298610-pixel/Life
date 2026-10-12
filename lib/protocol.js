export const WORLD = {
  // REAL CENTER: -25.585114,27.972712 - Unit20
  center: { lat: -25.585114, lng: 27.972712 },

  neighborhoods: {
    unit20: { name: "Unit 20 - Small Area", center: [-65, -35], radius: 28 }, // your house here
    unit16: { name: "Unit 16 - Large Central", center: [-5, 25], radius: 65 },
    unit4: { name: "Unit 4 - Right Side", center: [72, 32], radius: 32 },
    tsunami: { name: "Tsunami - North of Main St", center: [0, -62], radius: 80, type: "veld" },
    bushPatch: { name: "Small Bush Patch", center: [42, -12], radius: 14, type: "bush" },
    mall: { name: "Garankuwa Mall", center: [115, 48], radius: 10 }
  },

  kasi: {
    places: [
      // YOUR REAL PLACES - from your orange drawing
      { id: 'me-house', pos: [-62, -32], size: [6,6], solid: false, type: 'house', neighborhood: 'unit20', isSpawn: true },
      { id: 'spaza-main', pos: [28, -38], size: [4,4], solid: true, type: 'spaza', onMainSt: true },
      { id: 'china-mall', pos: [0,0,-80], size: [14,14], solid: false, type: 'mall' }, // old - keep for now
      { id: 'garankuwa-mall', pos: [115, 48], size: [20,20], solid: true, type: 'mall', neighborhood: 'mall' },
      { id: 'bodubelo-primary', pos: [-35, -5], size: [12,12], solid: true, type: 'school', neighborhood: 'unit16' },
      { id: 'lowe-primary', pos: [25, -8], size: [12,12], solid: true, type: 'school', neighborhood: 'unit16' },
      // Main St road markers (invisible triggers for taxi sounds)
      { id: 'main-st', pos: [0, -42], size: [200, 6], solid: false, type: 'road', name: 'Main St' },
    ]
  },

  // Roads from your blueprint
  roads: [
    { id: "MainSt", points: [[-90, -45], [90, -38]], width: 9 },
    { id: "OrangeBorder", points: [[-75, -38], [-50, -20], [-60, 10]], width: 6 }, // your orange line
    { id: "MallRoad", points: [[45, -20], [115, 45]], width: 7 }, // your red line to mall
  ]
}

export function isColliding(p, place){
  if(!place ||!place.solid) return false
  const half = place.size[0]/2
  return Math.abs(p.x - place.pos[0]) < half && Math.abs(p.z - place.pos[1]) < half
}

export function keepInsideWorld(p){
  const limit = 290
  p.x = Math.max(-limit, Math.min(limit, p.x))
  p.z = Math.max(-limit, Math.min(limit, p.z))
}

export function getNearbyTrigger(p, places, dist=6){
  for(const pl of places){
    const d = Math.sqrt((p.x-pl.pos[0])**2 + (p.z-pl.pos[1])**2)
    if(d < dist) return pl
  }
  return null
}

// REAL yards and neighborhoods - not 2 roads anymore
export function generateKasiHouses(count=60){
  const houses=[]
  let id = 0

  // Unit20 - small area near your pin (-25.585114,27.972712) - 18 houses in curve
  for(let r=0;r<3;r++){
    for(let c=0;c<6;c++){
      const x = -80 + c*6.5
      const z = -38 + r*8
      if(Math.hypot(x +65, z +35) < 28){ // inside Unit20 radius
        houses.push({
          id:`house-U20-${id++}`,
          pos:[x, z],
          size:[5,5],
          solid:false,
          type:'house',
          side:1,
          neighborhood:'unit20',
          hasYard: true
        })
      }
    }
  }

  // Unit16 - large central - 70 houses
  for(let i=0;i<70;i++){
    const angle = Math.random() * Math.PI * 2
    const dist = 18 + Math.random()*48
    const x = -5 + Math.cos(angle)*dist*0.9
    const z = 25 + Math.sin(angle)*dist*0.7
    // skip schools
    if(Math.hypot(x+35, z+5) < 12) continue
    if(Math.hypot(x-25, z+8) < 12) continue
    houses.push({
      id:`house-U16-${id++}`,
      pos:[x, z],
      size:[5,5],
      solid:false,
      type:'house',
      side: Math.random()>0.5?1:-1,
      neighborhood:'unit16',
      hasYard: true
    })
  }

  // Unit4 - right side - 25 houses
  for(let i=0;i<25;i++){
    const x = 60 + Math.random()*28
    const z = 15 + Math.random()*35
    houses.push({
      id:`house-U4-${id++}`,
      pos:[x, z],
      size:[5,5],
      solid:false,
      type:'house',
      side:1,
      neighborhood:'unit4',
      hasYard: true
    })
  }

  return houses
      }
