"use client"

interface LogoMarkProps {
  size?: number
  className?: string
  glow?: boolean
}

export function LogoMark({ size = 64, className = "", glow = true }: LogoMarkProps) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size * 1.5, height: size }}>
      {glow && (
        <>
          <div 
            className="absolute inset-0 blur-3xl opacity-40"
            style={{
              background: "radial-gradient(ellipse at center, #D67DF0 0%, #A872E8 30%, #6B8AFF 60%, transparent 80%)"
            }}
          />
          <div 
            className="absolute inset-0 blur-xl opacity-25"
            style={{
              background: "radial-gradient(ellipse at center, #F5DCFF 0%, #D67DF0 40%, transparent 70%)"
            }}
          />
        </>
      )}
      <svg
        width={size * 1.5}
        height={size}
        viewBox="0 0 48 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <radialGradient id="lmBlueFill" cx="0.35" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#94AAFF" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#6B8AFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4D6EE8" stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id="lmPurpleFill" cx="0.65" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#C49AF0" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#A872E8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8753CC" stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id="lmFusionFill" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F5DCFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#E5B5F5" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#D67DF0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#B863D9" stopOpacity="0.7" />
          </radialGradient>
          <filter id="lmGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path 
          d="M 17 3.5 C 24.5 3.5, 30 9, 30 16 C 30 23, 24.3 28.6, 17 28.5 C 9.7 28.4, 4 23, 4 16 C 4 9, 9.6 3.6, 17 3.5 Z" 
          fill="url(#lmBlueFill)" 
          filter="url(#lmGlow)"
        />
        
        <path 
          d="M 31 3.5 C 38.5 3.6, 44 9, 44 16 C 44 23, 38.3 28.5, 31 28.5 C 23.7 28.5, 18 23, 18 16 C 18 9, 23.6 3.5, 31 3.5 Z" 
          fill="url(#lmPurpleFill)" 
          filter="url(#lmGlow)"
          style={{mixBlendMode: 'screen'}}
        />
        
        <ellipse cx="24" cy="16" rx="6" ry="10.5" fill="url(#lmFusionFill)" filter="url(#lmGlow)"/>
        
        <path 
          d="M 17 3.5 C 24.5 3.5, 30.2 9.1, 30 16 C 29.8 23.1, 24.3 28.6, 17 28.5 C 9.8 28.4, 4.1 23, 4 16 C 3.9 8.9, 9.6 3.6, 17 3.5 Z" 
          stroke="rgba(255,255,255,0.5)" 
          strokeWidth="0.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        
        <path 
          d="M 31 3.5 C 38.4 3.7, 44.1 9, 44 16 C 43.9 23.2, 38.3 28.5, 31 28.5 C 23.6 28.5, 18 23.1, 18 16 C 18 9, 23.6 3.4, 31 3.5 Z" 
          stroke="rgba(255,255,255,0.5)" 
          strokeWidth="0.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        
        <path 
          d="M 41 5 L 41.5 7 L 43.5 7.5 L 41.5 8 L 41 10 L 40.5 8 L 38.5 7.5 L 40.5 7 Z" 
          fill="#E8D26B" 
          opacity="0.85"
        />
      </svg>
    </div>
  )
}