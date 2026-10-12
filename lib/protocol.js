// PROTOCOL V2 - Ga-Rankuwa World System + Boundaries
export const WORLD = {
  kasi: {
    name: "Zone 16",
    size: [200, 200],
    streets: [
      { id: "main", from: [0, -30], to: [0, 90], width: 8 },
    ],
    places: [
      { id: "home_1", type: "house", pos: [-10, -10], size: [5, 6], solid: true },
      { id: "home_2", type: "house", pos: [10, -10], size: [5, 6], solid: true },
      { id: "home_3", type: "house", pos: [-10, 5], size: [5, 6], solid: true },
      { id: "home_4", type: "house", pos: [10, 5], size: [5, 6], solid: true },
      { id: "home_5", type: "house", pos: [-10, 20], size: [5, 6], solid: true },
      { id: "home_6", type: "house", pos: [10, 20], size: [5, 6], solid: true },
      { id: "spaza", type: "shop", pos: [0, 55], size: [8, 6], solid: true, trigger: "SHOP", label: "Yellow building = SHOP" },
      { id: "airport", type: "airport", pos: [0, 75], size: [12, 12], solid: true, trigger: "AIRPORT", label: "Green building = AIRPORT" },
    ]
  }
}

export function isColliding(playerPos, place) {
  const extra = 1.4 // BIGGER - so you can't even touch roof edge
  const halfX = place.size[0] / 2 + extra
  const halfZ = place.size[1] / 2 + extra
  return (
    playerPos.x > place.pos[0] - halfX &&
    playerPos.x < place.pos[0] + halfX &&
    playerPos.z > place.pos[1] - halfZ &&
    playerPos.z < place.pos[1] + halfZ
  )
}
export function getNearbyTrigger(playerPos, places, distance = 6) {
  for (const place of places) {
    if (!place.trigger) continue
    const dx = playerPos.x - place.pos[0]
    const dz = playerPos.z - place.pos[1]
    const dist = Math.sqrt(dx*dx + dz*dz)
    if (dist < distance) return place
  }
  return null
}

export function generateKasiHouses(count=60){
  const houses = []
  // Spread houses far along Z so map keeps going
  for(let i=0;i<count;i++){
    const z = (Math.random()-0.5)*400 // 400 long road!
    houses.push({
      id: 'rdp-'+i+'-l',
      pos: [-10 - Math.random()*3, z],
      size: [5,5],
      solid: true,
      type: 'house'
    })
    houses.push({
      id: 'rdp-'+i+'-r',
      pos: [10 + Math.random()*3, z],
      size: [5,5],
      solid: true,
      type: 'house'
    })
  }
  return houses
}

// NEW - Keep player inside map, no more blue void
export function keepInsideWorld(pos){
  // Only block left/right — let Z go forever so map never ends
  if(pos.x < -18) pos.x = -18
  if(pos.x > 18) pos.x = 18
  // No Z limit = infinite road
  return pos
}

