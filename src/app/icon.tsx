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
        {/* The italic S */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 44,
            fontWeight: 500,
            color: '#F0E6D2',
            lineHeight: 1,
            marginRight: -2,
            marginTop: -4,
          }}
        >
          S
        </div>

        {/* The glowing dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#CF9D7B',
            marginTop: 18,
            marginLeft: 2,
            boxShadow: '0 0 8px #CF9D7B',
          }}
        />
      </div>
    ),
    { ...size }
  )
}