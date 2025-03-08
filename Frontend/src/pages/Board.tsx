import Grid from "@/components/grid";
import Score from "@/components/score-board";
import { useLocation } from "react-router"
import { useState } from "react";




const Board = () => {
  const location = useLocation();
  const [_, mode, level] = location.pathname.split('/');
  const[score, setScore] = useState(0);


  return (
    <>
      <Score userScore={score} Mode={mode}/>
      <Grid difficulty={level} callback={setScore} />
    </>
  )
}

export default Board