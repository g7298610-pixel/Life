// PROTOCOL V1 - Ga-Rankuwa World System
// This is the BRAIN, not the graphics

export const WORLD = {
  kasi: {
    name: "Zone 16",
    size: [200, 200],
    streets: [
      { id: "main", from: [0, -30], to: [0, 90], width: 8 },
    ],
    places: [
      // id, position, size, what happens when you enter
      { id: "home_1", type: "house", pos: [-10, -10], size: [5, 6], solid: true },
      { id: "home_2", type: "house", pos: [10, -10], size: [5, 6], solid: true },
      { id: "home_3", type: "house", pos: [-10, 5], size: [5, 6], solid: true },
      { id: "home_4", type: "house", pos: [10, 5], size: [5, 6], solid: true },
      { id: "home_5", type: "house", pos: [-10, 20], size: [5, 6], solid: true },
      { id: "home_6", type: "house", pos: [10, 20], size: [5, 6], solid: true },
      //... more houses auto-generated

      { id: "spaza", type: "shop", pos: [0, 55], size: [8, 6], solid: true, trigger: "SHOP", label: "Yellow building = SHOP" },
      { id: "airport", type: "airport", pos: [0, 75], size: [12, 12], solid: true, trigger: "AIRPORT", label: "Green building = AIRPORT" },
    ]
  }
}

// Check collision - can't walk through houses
export function isColliding(playerPos, place) {
  const halfX = place.size[0] / 2
  const halfZ = place.size[1] / 2
  return (
    playerPos.x > place.pos[0] - halfX &&
    playerPos.x < place.pos[0] + halfX &&
    playerPos.z > place.pos[1] - halfZ &&
    playerPos.z < place.pos[1] + halfZ
  )
}

// Check triggers - what happens when near place
export function getNearbyTrigger(playerPos, places, distance = 6) {
  for (const place of places) {
    if (!place.trigger) continue
    const dx = playerPos.x - place.pos[0]
    const dz = playerPos.z - place.pos[1]
    const dist = Math.sqrt(dx*dx + dz*dz)
    if (dist < distance) {
      return place
    }
  }
  return null
}

// Generate full kasi houses along road (so you feel traveling)
export function generateKasiHouses(count = 30) {
  const houses = []
  for (let i = 0; i < count; i++) {
    const z = -20 + i * 7
    // Left
    if (Math.random() > 0.1) houses.push({ id: `h_left_${i}`, type: "house", pos: [-10 + Math.random(), z], size: [5, 5.5], solid: true })
    // Right
    if (Math.random() > 0.1) houses.push({ id: `h_right_${i}`, type: "house", pos: [10 + Math.random(), z], size: [5, 5.5], solid: true })
  }
  return houses
      }

export function keepInsideWorld(pos){
  const LIMIT = 95
  pos.x = Math.max(-LIMIT, Math.min(LIMIT, pos.x))
  pos.z = Math.max(-30, Math.min(LIMIT, pos.z))
  return pos
}
