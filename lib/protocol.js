export function generateKasiHouses(count=40){
  const houses=[]
  for(let i=0;i<count;i++){
    const z=(Math.random()-0.5)*500
    houses.push({id:'house-l-'+i, pos:[-12,z], size:[5,5], solid:false, type:'house'})
    houses.push({id:'house-r-'+i, pos:[12,z], size:[5,5], solid:false, type:'house'})
  }
  return houses
}
