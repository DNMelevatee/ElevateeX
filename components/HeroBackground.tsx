'use client'
import { useEffect, useRef } from 'react'

/**
 * Animated hero background.
 *  • Technology → a living node network (dots + connecting lines)
 *  • Nature     → emerald particles drifting upward (growth) + soft glows
 *  • Education  → nodes gently pulse like sparks of insight
 * Tuned for a light theme. Respects prefers-reduced-motion.
 */
type Node = { x: number; y: number; vx: number; vy: number; r: number; c: string; ph: number }

const COLORS = ['124,58,237', '16,185,129', '167,139,250', '13,148,136'] // violet, emerald, light-violet, teal

export default function HeroBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let nodes: Node[] = []
    const mouse = { x: -9999, y: -9999 }
    let raf = 0
    let t = 0
    const MAXD = 132

    function build() {
      const parent = canvas!.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(24, Math.min(Math.floor((w * h) / 15000), 88))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(0.08 + Math.random() * 0.28), // upward drift = growth
        r: 1.2 + Math.random() * 2.3,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        ph: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      t += 0.016
      ctx!.clearRect(0, 0, w, h)

      // update positions
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const md = Math.hypot(dx, dy)
        if (md < 130 && md > 0.01) {
          const f = ((130 - md) / 130) * 0.7
          n.x += (dx / md) * f
          n.y += (dy / md) * f
        }
        if (n.y < -12) { n.y = h + 12; n.x = Math.random() * w }
        if (n.x < -12) n.x = w + 12
        if (n.x > w + 12) n.x = -12
      }

      // connecting lines (technology / knowledge web)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < MAXD) {
            ctx!.strokeStyle = `rgba(91,76,156,${(1 - d / MAXD) * 0.2})`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // nodes (pulsing sparks)
      for (const n of nodes) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.4 + n.ph)
        ctx!.shadowBlur = 9
        ctx!.shadowColor = `rgba(${n.c},0.5)`
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${n.c},${0.45 * pulse + 0.3})`
        ctx!.fill()
        ctx!.shadowBlur = 0
      }

      raf = requestAnimationFrame(draw)
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999 }
    function onVis() {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw)
    }

    build()
    if (reduce) {
      draw()
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', build)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />
}
