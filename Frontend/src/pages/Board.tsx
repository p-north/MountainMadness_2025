import jumpscareSound from "@/assets/jumpscare.mp3";
import Grid from "@/components/grid";
import Jumpscare from "@/components/jumpscare";
import Score from "@/components/score-board";
import { useScore } from "@/util/score-context";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const jumpscareImages: string[] = [
  'https://media.tenor.com/VXLAU_AIlF4AAAAM/jumpscare-ring-jumpscare.gif',
  'https://i.pinimg.com/originals/f2/50/d3/f250d38a6b842872560d414de477a3ea.gif',
  'https://media1.giphy.com/media/28aGE5xerXkbK/200.gif?cid=6c09b952bagks3ixakpj511ctubv9nngdtjebz48921i1z2n&ep=v1_gifs_search&rid=200.gif&ct=g',
  'https://www.gifcen.com/wp-content/uploads/2022/11/scary-gif-2.gif',
  'https://media.tenor.com/PPinUoLk4MoAAAAM/scary.gif',
];

const Board = () => {
  const location = useLocation();
  const [_, mode, level] = location.pathname.split("/");
  const { score, setScore } = useScore();
  const [jumpscare, setJumpscare] = useState<boolean>(false);
  const [jumpscareImage, setJumpscareImage] = useState<string | null>(null);

  useEffect(() => {
    setScore(0);
  }, []);

  useEffect(() => {
    const randomTime = Math.random() * (15000 - 5000) + 5000; // Random time between 5s - 15s
    const timeout = setTimeout(() => {
      setJumpscare(true);
      setJumpscareImage(jumpscareImages[Math.floor(Math.random() * jumpscareImages.length)]);
      const audio = new Audio(jumpscareSound);
      audio.play();
      setTimeout(() => setJumpscare(false), 1000); // Remove jumpscare after 1s
    }, randomTime);

    return () => clearTimeout(timeout);
  }, [score]); // Triggers jumpscare at random times, resets on score change

  return (
    <>
      <Score userScore={score} Mode={mode} />
      <Grid difficulty={level} callback={setScore} mode={mode} />
      <Jumpscare trigger={jumpscare} image={jumpscareImage} />
    </>
  );
}

export default Board
