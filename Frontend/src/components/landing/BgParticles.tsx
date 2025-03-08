import { useEffect, useState } from "react";
import { loadFull } from "tsparticles";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const BgParticles = () => {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadFull(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);


  if (init) {
  return (
    <Particles

      options={{
        fullScreen: { enable: true },

  backgroundMode: {
    enable: true
  },
  fpsLimit: 60,
        particles: {
          number: { value: 0 }, // More particles for chaos
          collisions: {
            enable: false
          },
          color: {
            value: "#ffffff"
          },
          move: {
            enable: true,
            speed: 20, // Super fast movement
            random: true, // Erratic movement
            direction: "none", // No set direction
            outModes: { default: "destroy" }, // Bouncing particles
          },
          // color: { value: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00"] },
          shape: { type: "circle" }, 
          opacity: { value: { min: 0.3, max: 0.8 } },
          size: { value: { min: 3, max: 10 }, },
          line_linked: { enable: false }, // No links between particles
          trail: {
            enable: true,
            fillColor: '#000',
            length: 3
          }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" }, // Particles scatter away from the cursor
            onClick: { enable: true, mode: "explode" }, // Click causes explosion effect
          },
          modes: {
            repulse: { distance: 200, duration: 0.4 },
            explode: { particles_nb: 20 }, // Click triggers particle explosion
          },
        },
        detectRetina: true,
        emitters: {
          direction: "none",
          rate: {
            delay: 0.25,
            quantity: 10
          },
          position: {
            x: 50,
            y: 50
          },
          size: {
            width: 0,
            height: 0
          },
          spawnColor: {
            value: "#ff0000",
            animation: {
              h: {
                enable: true,
                speed: 5
              },
              l: {
                enable: true,
                speed: 0,
                offset: {
                  min: 20,
                  max: 80
                }
              }
            }
          }
        }
      }}
    />
  );
} else {
  return <></>;
}
};

export default BgParticles;
