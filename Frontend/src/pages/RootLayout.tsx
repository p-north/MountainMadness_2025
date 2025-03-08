import BgParticles from '@/components/landing/BgParticles'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
        <BgParticles />
        <Outlet />
    </div>
  )
}

export default RootLayout