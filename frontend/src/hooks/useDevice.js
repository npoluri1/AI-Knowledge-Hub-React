import React from 'react'
import { deviceForWidth } from '../data/devices'

export function useDevice() {
  const [device, setDevice] = React.useState(() => deviceForWidth(typeof window === 'undefined' ? 1440 : window.innerWidth))

  React.useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setDevice(deviceForWidth(window.innerWidth)))
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.dataset.device = device.id
    return () => { delete document.documentElement.dataset.device }
  }, [device.id])

  return device
}
