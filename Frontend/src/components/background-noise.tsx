import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import SoundIcon from "@/assets/volume-high-solid.svg?react";
import MuteIcon from "@/assets/volume-xmark-solid.svg?react";
import { useScore } from "@/util/score-context";

const audio = new Audio ("/suspense-horror.mp3");

function Noise({speed}: {speed:number;}) {
    const location = useLocation();
    const [soundPlaying, setPlaySound] = useState(false);
    const {score, setScore} = useScore(); 

    useEffect(() => {
        if (location.pathname.includes('behavior') || location.pathname.includes('leet-code')) {
            setPlaySound(true);
            audio.currentTime = 0
            audio.play();
        } else {
            setPlaySound(false);
            audio.pause();
            audio.currentTime = 0
        }
    }, [location.pathname]);

    useEffect(() => {
        if (score == 0){
            audio.playbackRate = 1;
            console.log(audio.playbackRate);
        } else {
            audio.playbackRate = (score/5)+1;
            console.log(audio.playbackRate);
        }
        console.log("Increasing the speed: ", score);
    }, [score]);
    
    const handleBtnClick = () => {
        setPlaySound((soundPlaying) => {
            if (soundPlaying){
                audio.pause();
            } else {
                audio.loop = true;
                audio.play();
            }

            return !soundPlaying;
        });
        
    }


    // return null;
    return(<>
    <button onClick={handleBtnClick} className="cursor-pointer">
        {soundPlaying ? <SoundIcon className="w-[36px]" /> : <MuteIcon className="w-[40px]" />}
    </button>
    </>)

}

export default Noise;