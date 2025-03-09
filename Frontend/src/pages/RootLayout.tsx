import Noise from '@/components/background-noise';
import BgParticles from '@/components/landing/BgParticles';
import { Link, Outlet, useLocation } from 'react-router';
import Home from '@/assets/home.svg?react';

const RootLayout = () => {
  const location = useLocation();
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
        <div className="flex gap-4 p-8 absolute z-20">
            {
                location.pathname !== '/' && <Link to="/">
                <Home className="w-[36px] cursor-pointer" />
            </Link>
            }
            <Noise speed={1} />
        </div>
        <BgParticles />
        <div className="absolute w-full justify-center">
            <Outlet />
        </div>
    </div>
  )
}

export default RootLayout