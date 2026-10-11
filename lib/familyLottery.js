export function rollFamily(){
  const r=Math.random()*100
  if(r<60) return {zone:'RDP Zone 16', surname:'Molefe', buff:'Street Smart +10', cash:150, house:'shack'}
  if(r<90) return {zone:'Flats CBD', surname:'Khumalo', buff:'Balanced', cash:1200, house:'flat'}
  if(r<98) return {zone:'Estate', surname:'Van Wyk', buff:'Respect -10 but Money +50', cash:15000, house:'mansion'}
  return {zone:'Islands', surname:'Zhao', buff:'Boss Kid - Start rich', cash:50000, house:'island villa'}
}
