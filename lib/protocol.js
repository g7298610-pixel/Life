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

export function generateKasiHouses(count = 30) {
  const houses = []
  for (let i = 0; i < count; i++) {
    const z = -20 + i * 7
    if (Math.random() > 0.1) houses.push({ id: `h_left_${i}`, type: "house", pos: [-10 + Math.random(), z], size: [5, 5.5], solid: true })
    if (Math.random() > 0.1) houses.push({ id: `h_right_${i}`, type: "house", pos: [10 + Math.random(), z], size: [5, 5.5], solid: true })
  }
  return houses
}

// NEW - Keep player inside map, no more blue void
export function keepInsideWorld(pos){
  const LIMIT_X = 40
  const MIN_Z = -25
  const MAX_Z = 95
  pos.x = Math.max(-LIMIT_X, Math.min(LIMIT_X, pos.x))
  pos.z = Math.max(MIN_Z, Math.min(MAX_Z, pos.z))
  return pos
}
