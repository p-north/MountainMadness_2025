import Grid from "@/components/grid";
import { useLocation } from "react-router"

const Board = () => {
  const location = useLocation();
  const [_, mode, level] = location.pathname.split('/');
  return (
    <Grid difficulty={level} />
  )
}

export default Board