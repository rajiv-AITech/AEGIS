/*
 * SENTINEL — Paste the full App component here.
 *
 * Steps:
 *   1. Go to your Claude conversation
 *   2. Open the artifact: "Sentinel — Full Platform + Energy-Aware Digital Twin"
 *   3. Select All (Ctrl+A / Cmd+A) → Copy
 *   4. Delete everything in this file and paste
 *   5. Commit and push — Vercel will redeploy automatically
 */

export default function App() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      height:'100vh',background:'#07090f',color:'#c9d8e8',
      fontFamily:'system-ui',flexDirection:'column',gap:20}}>
      <div style={{fontSize:48}}>🛡</div>
      <p style={{fontSize:20,fontWeight:500}}>Sentinel</p>
      <p style={{fontSize:14,color:'#5e7a96',textAlign:'center',maxWidth:360,lineHeight:1.6}}>
        Paste the full App component from the Claude artifact into src/App.tsx
      </p>
    </div>
  )
}