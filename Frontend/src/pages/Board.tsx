import Grid from "@/components/grid";
import Score from "@/components/score-board";
import { useLocation } from "react-router"
import { useState, useContext, useEffect } from "react";
import { ScoreContext } from "@/util/score-context";
import { useScore } from "@/util/score-context";

const Board = () => {
  const location = useLocation();
  const [_, mode, level] = location.pathname.split('/');
  // const[score, setScore] = useState(0);
  // const context = useContext(ScoreContext);
  const {score, setScore} = useScore(); 

  useEffect(() => {
    setScore(0);
  }, []);


  return (
    <>
      <Score userScore={score} Mode={mode}/>
      <Grid difficulty={level} callback={setScore} mode={mode} />
    </>
  )
}

export default Board