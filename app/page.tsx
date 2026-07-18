'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeProvider'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

const courses = [
  { icon: '🤖', tag: 'AI & ML', tc: 'rgba(192,132,252,.75)', tb: 'rgba(192,132,252,.08)', bc: 'rgba(192,132,252,.12)', title: 'Generative AI', desc: 'Prompt engineering, LLMs, RAG pipelines, and building AI-powered apps from scratch.' },
  { icon: '🌐', tag: 'Dev', tc: 'rgba(52,211,153,.75)', tb: 'rgba(52,211,153,.06)', bc: 'rgba(52,211,153,.1)', title: 'Web Development', desc: 'HTML, CSS, JavaScript, React & Node.js. Build and deploy full-stack web apps.' },
  { icon: '📈', tag: 'Marketing', tc: 'rgba(251,191,36,.75)', tb: 'rgba(251,191,36,.06)', bc: 'rgba(251,191,36,.1)', title: 'Digital Marketing', desc: 'SEO, social media, content strategy, and analytics to grow brands online.' },
  { icon: '☕', tag: 'Backend', tc: 'rgba(96,165,250,.75)', tb: 'rgba(96,165,250,.06)', bc: 'rgba(96,165,250,.1)', title: 'Java Programming', desc: 'Core Java, OOP, data structures, Spring Boot basics and backend development.' },
  { icon: '⚡', tag: 'Systems', tc: 'rgba(248,113,113,.75)', tb: 'rgba(248,113,113,.06)', bc: 'rgba(248,113,113,.1)', title: 'C++ Fundamentals', desc: 'Pointers, memory, STL, algorithms and competitive programming preparation.' },

]

export default function Home() {
  useEffect(() => {
    // Video fade logic
    const v = document.getElementById('bgv') as HTMLVideoElement
    if (!v) return
    let raf: number | null = null
    let fo = false
    function kr() { if (raf) { cancelAnimationFrame(raf); raf = null } }
    function fadeTo(to: number, ms: number, cb?: () => void) {
      kr()
      const t0 = performance.now()
      const from = parseFloat(v.style.opacity) || 0
      function tick(now: number) {
        const p = Math.min((now - t0) / ms, 1)
        v.style.opacity = String(from + (to - from) * p)
        if (p < 1) { raf = requestAnimationFrame(tick) } else { v.style.opacity = String(to); raf = null; cb?.() }
      }
      raf = requestAnimationFrame(tick)
    }
    v.addEventListener('canplay', () => { v.play().catch(() => {}); fadeTo(1, 500) })
    v.addEventListener('timeupdate', () => {
      const r = v.duration - v.currentTime
      if (!fo && r > 0 && r <= 0.55) { fo = true; fadeTo(0, 500) }
    })
    v.addEventListener('ended', () => { fo = false; v.style.opacity = '0'; setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); fadeTo(1, 500) }, 100) })
    v.load()

    // Intersection observer for card animations
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ;(e.target as HTMLElement).style.opacity = '1'
          ;(e.target as HTMLElement).style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.08, rootMargin: '-30px' })
    document.querySelectorAll('.ccard,.pcard,.step,.ti').forEach(el => {
      ;(el as HTMLElement).style.opacity = '0'
      ;(el as HTMLElement).style.transform = 'translateY(20px)'
      ;(el as HTMLElement).style.transition = 'opacity .6s ease, transform .6s ease'
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  function openM(n: string) {
    const el = document.getElementById('mname')
    if (el) el.textContent = n
    document.getElementById('modal')?.classList.add('on')
    const tot = document.getElementById('mtot')
    if (tot) tot.textContent = '₹699'
    document.querySelectorAll('.dopt').forEach((el, i) => el.classList.toggle('sel', i === 1))
  }
  function closeM() { document.getElementById('modal')?.classList.remove('on') }
  function selD(el: HTMLElement, p: number) {
    document.querySelectorAll('.dopt').forEach(d => d.classList.remove('sel'))
    el.classList.add('sel')
    const tot = document.getElementById('mtot')
    if (tot) tot.textContent = '₹' + p.toLocaleString('en-IN')
  }

  return (
    <>
      {/* NAV */}
      <div className="nav-fixed">
        <div className="nav-inner lg">
          <a href="#" className="nav-logo"><div className="lm">E</div>ElevateEx</a>
          <div className="nav-links">
            <a href="#courses">Courses</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="nav-r">
            {/* Theme Toggle */}
            <ThemeToggle />
            <Link href="/login" className="nbtn" style={{ textDecoration: 'none' }}>Sign in</Link>
            <button className="nbtn nbtn-e lg" style={{ borderRadius: '100px', padding: '7px 18px' }}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <video className="bg" id="bgv" muted playsInline preload="auto">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="hero-ov" />
        <div className="hero-body">
          <div className="badge lg">
            <span className="bdot" />
            Course-based internships · Now live
          </div>
          <h1>Learn. Build.<br /><em>Get Certified.</em></h1>
          <div className="ipill lg">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
            <input type="email" placeholder="Enter your email to get started" />
            <button className="abtn" aria-label="Submit">
              <svg className="ics" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
          <p className="hero-sub">Pick a course. Set your duration. Build a real project.<br />Earn a certificate colleges actually recognise.</p>
          <button className="xbtn lg" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore all courses →
          </button>
        </div>
        <div className="socials">
          <button className="sbtn lg" aria-label="Instagram">
            <svg className="ic" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
          </button>
          <button className="sbtn lg" aria-label="Twitter">
            <svg className="ic" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20"/></svg>
          </button>
          <button className="sbtn lg" aria-label="LinkedIn">
            <svg className="ic" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v7M7 7v.01M12 10v7M12 13a3 3 0 016 0v4"/></svg>
          </button>
        </div>
      </section>

      {/* PARTNERS */}
      <div className="partners">
        <div className="p-inner">
          <div className="p-label">Trusted by students from colleges & coaching centers across India</div>
          <div className="p-row">
            {['Delhi University','IIT Coaching Hub','CareerEdge Academy','TechMinds Institute','FutureSkills College'].map(p => (
              <span key={p} className="p-item">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* COURSES */}
      <section id="courses" className="courses-bg" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="slabel">Our Programs</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
            <h2 className="sh" style={{ marginBottom: 0 }}>Courses built for<br /><em>the real world</em></h2>
            <p style={{ fontSize: 13, color: 'var(--courses-desc)', maxWidth: 240, textAlign: 'right', lineHeight: 1.8, fontWeight: 300 }}>
              Complete a course, submit your project, earn a verified internship certificate.
            </p>
          </div>
          <div className="cgrid">
            {courses.map(c => (
              <div key={c.title} className="ccard lg" onClick={() => openM(c.title)}
                style={{ borderColor: c.bc }}>
                <div className="ccard-in">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="cico" style={{ background: c.tb, border: `1px solid ${c.bc}` }}>{c.icon}</div>
                    <span className="ctag" style={{ color: c.tc, background: c.tb, border: `1px solid ${c.bc}` }}>{c.tag}</span>
                  </div>
                  <div><div className="ctitle">{c.title}</div><div className="cdesc">{c.desc}</div></div>
                  <div className="cmeta">
                    <div className="dpills"><span className="dp">1 mo</span><span className="dp">3 mo</span><span className="dp">6 mo</span></div>
                    <div className="carr">→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-bg" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="slabel">The Process</div>
          <h2 className="sh">Simple. Structured.<br /><em>Rewarding.</em></h2>
          <div className="steps lg" style={{ borderRadius: 24 }}>
            {[
              { n: '01', ico: '📚', bg: 'rgba(192,132,252,.09)', brd: 'rgba(192,132,252,.15)', t: 'Pick your course', d: 'Choose GenAI, Web Dev, Marketing, Java, or C++. Select 1, 3, or 6 months — pay accordingly.' },
              { n: '02', ico: '🎯', bg: 'rgba(52,211,153,.07)', brd: 'rgba(52,211,153,.12)', t: 'Learn & build', d: 'Access full course materials instantly. Work through structured content and build your final project.' },
              { n: '03', ico: '🚀', bg: 'rgba(251,191,36,.07)', brd: 'rgba(251,191,36,.12)', t: 'Submit your project', d: 'When your duration ends, the submission link opens. Submit your work for expert manual review.' },
              { n: '04', ico: '🏆', bg: 'rgba(192,132,252,.09)', brd: 'rgba(192,132,252,.15)', t: 'Get certified', d: 'Pass review and receive your internship + course completion certificate. Shareable on LinkedIn.' },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="snum">{s.n}</div>
                <div className="sico" style={{ background: s.bg, border: `1px solid ${s.brd}` }}>{s.ico}</div>
                <div className="stitle">{s.t}</div>
                <div className="sdesc">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 24px', background: 'radial-gradient(ellipse 50% 60% at 50% 50%,rgba(52,211,153,.03) 0%,transparent 60%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div className="slabel">Pricing</div>
          <h2 className="sh" style={{ textAlign: 'center' }}>Student-friendly.<br /><em>No hidden fees.</em></h2>
          <p style={{ fontSize: 13, color: 'var(--sp-color)', maxWidth: 380, margin: '0 auto 44px', lineHeight: 1.8, fontWeight: 300 }}>
            All plans include full course access and certification. Longer duration = more time to master the material.
          </p>
          <div className="pgrid">
            <div className="pcard lg">
              <div className="pdur">1 Month</div>
              <div className="pamount"><sup>₹</sup>399</div>
              <div className="pnote">one-time · no renewal</div>
              <ul className="pfeat"><li>Full course access</li><li>30-day learning window</li><li>Project submission</li><li>Course certificate</li></ul>
              <button className="pbtn">Get started</button>
            </div>
            <div className="pcard lg" style={{ borderColor: 'rgba(192,132,252,.25)', transform: 'scale(1.04)', zIndex: 2 }}>
              <div className="ppop">Most Popular</div>
              <div className="pdur">3 Months</div>
              <div className="pamount"><sup>₹</sup>699</div>
              <div className="pnote">one-time · no renewal</div>
              <ul className="pfeat"><li>Full course access</li><li>90-day learning window</li><li>Project submission</li><li>Course certificate</li><li>Internship certificate</li></ul>
              <button className="pbtn pbtn-a">Enroll now</button>
            </div>
            <div className="pcard lg">
              <div className="pdur">6 Months</div>
              <div className="pamount"><sup>₹</sup>999</div>
              <div className="pnote">one-time · no renewal</div>
              <ul className="pfeat"><li>Full course access</li><li>180-day learning window</li><li>Project submission</li><li>Course certificate</li><li>Internship certificate</li><li>LinkedIn badge template</li></ul>
              <button className="pbtn">Get started</button>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATE */}
      <section className="cert-wrap">
        <div className="cert-inner">
          <div className="cviz lg">
            <div className="ccard2">
              <div className="ch">
                <div className="clm">E</div>
                <div className="co">ElevateEx<small>Internship & Course Certificate</small></div>
              </div>
              <div className="ctit">Generative AI & Prompt Engineering</div>
              <div className="cn">Awarded to <strong>Priya Sharma</strong> · 3-month program</div>
              <div className="cbadges">
                <span className="cb cb-p">✓ Project Reviewed</span>
                <span className="cb cb-g">✓ Certified</span>
                <span className="cb cb-p">✓ Internship Done</span>
              </div>
              <div className="cf">
                <div>
                  <div className="cfl">Issue Date</div>
                  <div style={{ fontSize: 12, color: 'var(--cn-color)', marginTop: 2 }}>May 2025</div>
                </div>
                <div className="cfv"><div className="ck">✓</div>Manually verified</div>
              </div>
            </div>
          </div>
          <div>
            <div className="slabel">Your Achievement</div>
            <h2 className="sh">A certificate that<br /><em>actually means something</em></h2>
            <p className="sp">Every certificate is issued only after manual review. No auto-generated credentials — just real proof you built something and we verified it.</p>
            <div className="tl">
              <div className="ti"><div className="tdot td-p">1</div><div><div className="ttit">Complete your course</div><div className="tdesc">Work through all modules within your enrollment duration</div></div></div>
              <div className="ti"><div className="tdot td-w">2</div><div><div className="ttit">Submit your final project</div><div className="tdesc">Submission link opens automatically when duration ends</div></div></div>
              <div className="ti"><div className="tdot td-w">3</div><div><div className="ttit">Expert review (3–5 days)</div><div className="tdesc">Our team manually evaluates your project for quality</div></div></div>
              <div className="ti"><div className="tdot td-g">4</div><div><div className="ttit">Receive both certificates</div><div className="tdesc">Internship + course completion sent to your email</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="footer-wrap">
        <footer>
          <div className="ft">
            <div className="fc">
              <div className="nav-logo" style={{ marginBottom: 14 }}><div className="lm">E</div>ElevateEx</div>
              <p style={{ fontSize: 12, color: 'var(--partners-text)', lineHeight: 1.8, maxWidth: 200, fontWeight: 300 }}>Course-based internships that build real skills and real credentials.</p>
            </div>

            <div className="fc"><h4>Company</h4><a href="#">About us</a><a href="#">Blog</a><a href="#">Partnerships</a><a href="#">Careers</a></div>
            <div className="fc"><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Refund Policy</a><a href="#">Contact</a></div>
          </div>
          <div className="fb">
            <div className="fcopy">© 2025 ElevateEx. All rights reserved.</div>
            <div className="ftag">Elevate your career, one project at a time.</div>
          </div>
        </footer>
      </div>

      {/* MODAL */}
      <div className="modal-ov" id="modal" onClick={e => { if (e.target === e.currentTarget) closeM() }}>
        <div className="mbox lg">
          <button className="mcl" onClick={closeM}>×</button>
          <div className="mt">Enroll Now</div>
          <div className="mc" id="mname">Generative AI</div>
          <div className="ml">Choose Duration</div>
          <div className="dopts">
            <div className="dopt" onClick={e => selD(e.currentTarget as HTMLElement, 399)}><div className="dm">1</div><div className="dl">Month</div><div className="dp2">₹399</div></div>
            <div className="dopt sel" onClick={e => selD(e.currentTarget as HTMLElement, 699)}><div className="dm">3</div><div className="dl">Months</div><div className="dp2">₹699</div></div>
            <div className="dopt" onClick={e => selD(e.currentTarget as HTMLElement, 999)}><div className="dm">6</div><div className="dl">Months</div><div className="dp2">₹999</div></div>
          </div>
          <div className="mtot"><div className="mtl">Total</div><div className="mtp" id="mtot">₹699</div></div>
          <button className="menroll">Proceed to Payment →</button>
        </div>
      </div>
    </>
  )
}
