import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import SoundIcon from "@/assets/volume-high-solid.svg?react";
import MuteIcon from "@/assets/volume-xmark-solid.svg?react";


const audio = new Audio ("/suspense-horror.mp3");
function Noise({speed}: {speed:number;}) {
    const location = useLocation();
    const [soundPlaying, setPlaySound] = useState(false);

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
    
    const handleBtnClick = () => {
        setPlaySound(!soundPlaying);
        console.log({soundPlaying});
        console.log(soundPlaying)
        if (soundPlaying){
            audio.playbackRate = speed;
            audio.loop = true;
            audio.play();
        } else {
            audio.pause();
        }
    }


    // return null;
    return(<>
    <button onClick={handleBtnClick} className="cursor-pointer">
        {soundPlaying ? <SoundIcon className="w-[40px]" /> : <MuteIcon className="w-[36px]" />}
    </button>
    </>)

}

export default Noise;