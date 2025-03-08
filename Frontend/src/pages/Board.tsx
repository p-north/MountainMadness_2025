import { useLocation } from "react-router"

const Board = () => {
  const location = useLocation();
  const [_, mode, level] = location.pathname.split('/');
  return (
    <div>{mode}: {level}</div>
  )
}

export default Board