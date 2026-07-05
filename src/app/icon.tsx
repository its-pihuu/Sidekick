import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', position: 'relative' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#5B8DEF',
              position: 'absolute',
              left: -5,
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#9D4EDD',
              position: 'absolute',
              left: 5,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
