export function rollFamily(){
  const r=Math.random()*100
  if(r<60) return {zone:'RDP Zone 16', surname:'Molefe', buff:'Street Smart'}
  if(r<90) return {zone:'Flats CBD', surname:'Khumalo', buff:'Balanced'}
  if(r<98) return {zone:'Estate', surname:'Van Wyk', buff:'Respect -10'}
  return {zone:'Islands', surname:'Zhao', buff:'Boss Kid'}
}
