"use client"

import { StarDoodle, HeartDoodle, SparkleDoodle, SquiggleDoodle, SpiralDoodle, PlusDoodle, DotsDoodle, CircleDoodle } from "./doodles"

export function DoodleScatter() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top area */}
      <StarDoodle size={22} className="absolute top-[6%] left-[6%]" style={{ transform: "rotate(-15deg)" }} />
      <SparkleDoodle size={16} className="absolute top-[12%] left-[14%]" />
      <PlusDoodle size={14} className="absolute top-[20%] left-[5%]" color="#E89BC7" />
      <HeartDoodle size={20} className="absolute top-[8%] right-[8%]" style={{ transform: "rotate(20deg)" }} />
      <SparkleDoodle size={18} color="#E89BC7" className="absolute top-[16%] right-[15%]" />
      <SquiggleDoodle size={55} className="absolute top-[24%] right-[6%]" style={{ transform: "rotate(-10deg)" }} />
      <CircleDoodle size={30} className="absolute top-[18%] left-[22%]" color="rgba(232,210,107,0.3)" />
      
      {/* Middle-upper area */}
      <SpiralDoodle size={32} className="absolute top-[35%] left-[4%]" />
      <DotsDoodle size={28} className="absolute top-[42%] left-[12%]" color="#E8D26B" />
      <StarDoodle size={18} color="#E89BC7" className="absolute top-[38%] right-[8%]" style={{ transform: "rotate(25deg)" }} />
      <PlusDoodle size={14} className="absolute top-[45%] right-[16%]" />
      <SparkleDoodle size={20} className="absolute top-[40%] right-[5%]" />
      
      {/* Middle area */}
      <HeartDoodle size={22} color="#E89BC7" className="absolute top-[55%] left-[7%]" style={{ transform: "rotate(-12deg)" }} />
      <SparkleDoodle size={16} className="absolute top-[60%] left-[18%]" color="#E8D26B" />
      <StarDoodle size={20} className="absolute top-[58%] right-[10%]" style={{ transform: "rotate(15deg)" }} />
      <CircleDoodle size={25} className="absolute top-[65%] right-[5%]" color="rgba(232,155,199,0.3)" />
      <DotsDoodle size={20} className="absolute top-[68%] right-[20%]" />
      
      {/* Middle-lower area */}
      <SpiralDoodle size={28} className="absolute top-[75%] left-[5%]" color="rgba(255,255,255,0.25)" />
      <SquiggleDoodle size={50} className="absolute top-[78%] left-[16%]" style={{ transform: "rotate(8deg)" }} />
      <HeartDoodle size={18} color="#E8D26B" className="absolute top-[80%] right-[12%]" style={{ transform: "rotate(-15deg)" }} />
      <SparkleDoodle size={14} color="#E89BC7" className="absolute top-[85%] right-[6%]" />
      
      {/* Bottom area */}
      <StarDoodle size={24} className="absolute bottom-[8%] left-[10%]" style={{ transform: "rotate(10deg)" }} />
      <PlusDoodle size={16} className="absolute bottom-[15%] left-[20%]" color="#E89BC7" />
      <SparkleDoodle size={18} className="absolute bottom-[12%] right-[14%]" color="#E8D26B" />
      <HeartDoodle size={16} color="#E89BC7" className="absolute bottom-[6%] right-[8%]" style={{ transform: "rotate(20deg)" }} />
      <DotsDoodle size={22} className="absolute bottom-[18%] left-[5%]" />
      <CircleDoodle size={28} className="absolute bottom-[10%] left-[30%]" color="rgba(232,210,107,0.25)" />
    </div>
  )
}