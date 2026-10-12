export const WORLD = {
  kasi: {
    places: [
      { id:'china-mall', pos:[0,0,-80], size:[14,14], solid:false, type:'mall' },
    ]
  }
}

export function isColliding(p, place){
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

export function generateKasiHouses(count=60){
  const houses=[]
  for(let i=0;i<count;i++){
    const z = (Math.random()-0.5)*500
    // left side road and right side road, facing road
    houses.push({ id:`house-L-${i}`, pos:[-12.5, z], size:[5,5], solid:false, type:'house', side:-1 })
    houses.push({ id:`house-R-${i}`, pos:[12.5, z], size:[5,5], solid:false, type:'house', side:1 })
  }
  return houses
}
