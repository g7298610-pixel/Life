export default function CourtSlot() {
  const [judge, setJudge] = useState('Bot Judge Mahlangu')
  const queue = ['Thabo (25 wins)', 'Lerato (22 wins)', 'You (0 wins)']
  return (
    <div style={{padding:20, border:'2px solid black'}}>
      <h3>Court — 1 Chair Only</h3>
      <p>Current Judge: {judge}</p>
      <button onClick={()=>setJudge('You — Real Player')}>TAKE OVER (Bot stands up)</button>
      <button onClick={()=>setJudge('Bot Judge Mahlangu')}>LOG OFF (Bot sits again)</button>
      <p>Queue (10 want judge): {queue.join(', ')} — Shifts: 08-10, 10-12, 12-14, 14-16</p>
    </div>
  )
}
