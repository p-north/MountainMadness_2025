import Grid from "@/components/grid";
import Score from "@/components/score-board";
import Noise from "@/components/background-noise";
import { useLocation } from "react-router"
import { useState } from "react";




const Board = () => {
  const location = useLocation();
  const [_, mode, level] = location.pathname.split('/');
  const[score, setScore] = useState(0);


  return (

    <>
    <Noise speed={((score+1)*(score+1)/10)+1} />
    <Score userScore={score} Mode={mode}/>
    <Grid difficulty={level} callback={setScore} />
    

    </>
  )
}

export default Board