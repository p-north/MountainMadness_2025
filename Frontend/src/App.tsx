import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/grid.tsx'
import Noise from './components/background-noise.tsx'


function App() {
  const [count, setCount] = useState(0)

  // useEffect(()=>{
  //     var audio = new Audio ("/suspense-horror.mp3");
  //     // audio.playbackRate = speed ;
  //     // audio.loop = true;
  //     audio.play();
  // },[]);
  
  return (
    <>
      <Noise speed={1.1}/>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="bg-gra" alt="React logo" />
        </a>
      </div>
      <h1 className="text-red-500 font-bold mb-30">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>



      <Grid difficulty={"Easy"}/>
    </>
  )
}

export default App



