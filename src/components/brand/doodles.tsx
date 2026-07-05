"use client"

interface DoodleProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function StarDoodle({ size = 24, color = "#E8D26B", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        d="M12 2.5 L13.8 9 L20.5 9.5 L15.2 13.8 L17.1 20.2 L12 16.4 L6.9 20.2 L8.8 13.8 L3.5 9.5 L10.2 9 Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  )
}

export function HeartDoodle({ size = 24, color = "#E89BC7", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        d="M12 20s-7-4.5-7-10c0-3 2.5-5 5-5 1.5 0 3 .8 2 2.5C13 5.8 14.5 5 16 5c2.5 0 5 2 5 5 0 5.5-7 10-7 10z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  )
}

export function SparkleDoodle({ size = 20, color = "#E8D26B", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        d="M12 3 L13 11 L21 12 L13 13 L12 21 L11 13 L3 12 L11 11 Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  )
}

export function SquiggleDoodle({ size = 60, color = "rgba(255,255,255,0.4)", className = "", style }: DoodleProps) {
  const h = size / 3
  return (
    <svg width={size} height={h} viewBox="0 0 60 20" fill="none" className={className} style={style}>
      <path
        d="M2 10 Q 10 2, 18 10 T 34 10 T 50 10 T 58 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function ArrowDoodle({ size = 40, color = "rgba(255,255,255,0.5)", className = "", style }: DoodleProps) {
  const h = size * 0.7
  return (
    <svg width={size} height={h} viewBox="0 0 40 28" fill="none" className={className} style={style}>
      <path
        d="M3 14 Q 15 5, 30 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 12 L 26 6 M30 12 L 24 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function SpiralDoodle({ size = 30, color = "rgba(255,255,255,0.3)", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" className={className} style={style}>
      <path
        d="M15 15 m-2 0 a 2 2 0 1 1 4 0 a 4 4 0 1 1 -8 0 a 6 6 0 1 1 12 0 a 8 8 0 1 1 -16 0"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function PlusDoodle({ size = 16, color = "#E8D26B", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={style}>
      <path d="M8 2 L8 14 M2 8 L14 8" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

export function DotsDoodle({ size = 24, color = "#E89BC7", className = "", style }: DoodleProps) {
  const h = size / 3
  return (
    <svg width={size} height={h} viewBox="0 0 24 8" fill="none" className={className} style={style}>
      <circle cx="4" cy="4" r="2" fill={color} opacity="0.85" />
      <circle cx="12" cy="4" r="2" fill={color} opacity="0.85" />
      <circle cx="20" cy="4" r="2" fill={color} opacity="0.85" />
    </svg>
  )
}

export function CircleDoodle({ size = 40, color = "rgba(255,255,255,0.4)", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} style={style}>
      <path
        d="M 20 4 C 28 4, 36 12, 36 20 C 36 28, 28 36, 20 36 C 12 36, 4 28, 4 20 C 4 12, 12 4, 20 4 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function UnderlineDoodle({ size = 100, color = "#E8D26B", className = "", style }: DoodleProps) {
  return (
    <svg width={size} height={10} viewBox="0 0 100 10" fill="none" className={className} style={style}>
      <path
        d="M2 6 Q 25 2, 50 5 T 98 4"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  )
}