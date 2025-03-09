import {useState } from "react";

const audio = new Audio ("/suspense-horror.mp3");

function Noise({speed}: {speed:number;}) {
    const [soundPlaying, setPlaySound] = useState(false);
    
    const handleBtnClick = () => {
        setPlaySound(!soundPlaying);
        console.log(soundPlaying)
        if (soundPlaying){
            audio.playbackRate = speed ;
            audio.loop = true;
            audio.play();
        } else {
            audio.pause();
        }
    }


    // return null;
    return(<>
    <button onClick={handleBtnClick}>Toggle Sound</button>
    </>)

}

export default Noise;