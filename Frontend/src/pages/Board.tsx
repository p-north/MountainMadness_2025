import jumpscareSound from "@/assets/jumpscare.mp3";
import Grid from "@/components/grid";
import Jumpscare from "@/components/jumpscare";
import Score from "@/components/score-board";
import { useScore } from "@/util/score-context";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const jumpscareImages: string[] = [
  "https://www.icegif.com/wp-content/uploads/2024/05/cat-icegif-4.gif",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqq2ac_J6EJQTajAzEN9vSIEGM7NisGncWvA&s",
  "https://i.pinimg.com/originals/9a/3c/3f/9a3c3fb5f73822af8514df07f6676392.gif",
  "https://i.pinimg.com/originals/c4/c5/3c/c4c53c48cc5ef5d0af630ba961c5ca73.gif"
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