import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 64,
  height: 64,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0C1519',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          position: 'relative',
        }}
      >
        {/* The dramatically tilted S */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 50,
            fontWeight: 600,
            color: '#F0E6D2',
            lineHeight: 1,
            transform: 'skewX(-15deg) rotate(-8deg)',
            marginRight: 2,
            marginTop: -4,
          }}
        >
          S
        </div>

        {/* Glow layer 1 — outermost soft halo */}
        <div
          style={{
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#D4A017',
            opacity: 0.25,
            filter: 'blur(6px)',
            right: 10,
            bottom: 12,
          }}
        />

        {/* Glow layer 2 — mid glow */}
        <div
          style={{
            position: 'absolute',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#F4C430',
            opacity: 0.6,
            filter: 'blur(2px)',
            right: 14,
            bottom: 16,
          }}
        />

        {/* The actual gold dot — sharp + bright */}
        <div
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#FFD700',
            right: 17,
            bottom: 19,
          }}
        />
      </div>
    ),
    { ...size }
  )
}