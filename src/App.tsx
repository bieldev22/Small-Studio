import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Camera, MapPin, Menu, MessageCircle, X } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { siteConfig } from './siteConfig'

const sections = [
  { label: 'Início', href: '#inicio' },
  { label: 'A ideia', href: '#ideia' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'O espaço', href: '#espaco' },
  { label: 'Contato', href: '#contato' },
]

function Mark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(50 50)" fill="currentColor">
        <rect x="-7" y="-45" width="14" height="90" />
        <rect x="-7" y="-45" width="14" height="90" transform="rotate(60)" />
        <rect x="-7" y="-45" width="14" height="90" transform="rotate(120)" />
      </g>
    </svg>
  )
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  if (typeof IntersectionObserver === 'undefined') return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="wordmark" href="#inicio" aria-label="Small Studio Barber, início">
        <Mark className="wordmark__mark" />
        <span>small<span className="wordmark__light">studio barber</span></span>
      </a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={`main-nav${menuOpen ? ' main-nav--open' : ''}`} aria-label="Navegação principal">
        {sections.map((section) => (
          <a key={section.href} href={section.href} onClick={() => setMenuOpen(false)}>{section.label}</a>
        ))}
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__content">
        <div className="hero__copy">
          <Reveal delay={0.08}>
            <h2 id="hero-title">A barbearia<br />que foge <em>dos rótulos.</em></h2>
          </Reveal>
          <motion.div className="hero__foot" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.52 }}>
            <h4>{siteConfig.introduction}</h4>
            <a className="text-link text-link--light" href="#ideia">Conheça a ideia <ArrowDownRight size={45} /></a>
          </motion.div>
        </div>
        <motion.img className="hero__logo" src="/assets/images/logo.png" alt="Small Studio Barber" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </section>
  )
}

function Story() {
  const storyRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [motionReady, setMotionReady] = useState(false)
  const [photoRevealed, setPhotoRevealed] = useState(false)
  const [activeSteps, setActiveSteps] = useState<number[]>([])

  useEffect(() => {
    const story = storyRef.current
    if (!story || reduceMotion || typeof IntersectionObserver === 'undefined') return

    const observerInset = Math.min(330, Math.round(window.innerHeight * 0.4))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.hasAttribute('data-story-photo')) {
          if (entry.isIntersecting) {
            setPhotoRevealed(true)
            observer.unobserve(entry.target)
          }
        } else {
          const step = Number((entry.target as HTMLElement).dataset.storyStep)
          setActiveSteps((current) => entry.isIntersecting
            ? current.includes(step) ? current : [...current, step]
            : current.filter((activeStep) => activeStep !== step))
        }
      })
      setMotionReady(true)
    }, { threshold: 0, rootMargin: `-${observerInset}px 0px -${observerInset}px 0px` })

    story.querySelectorAll('[data-story-photo], [data-story-step]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <section ref={storyRef} className={`story section-pad${motionReady ? ' story--motion-ready' : ''}`} id="ideia" aria-labelledby="story-title">
      <div className="story__intro">
        <h2 id="story-title">O básico nunca foi o nosso limite.</h2>
      </div>
      <div className="story__body">
        <div className={`story__symbol${photoRevealed ? ' story__symbol--revealed' : ''}`} data-story-photo>
          <img src="/assets/images/IMG_1805.png" alt="Logo Small Studio Barber impressa no lençol de proteção, com fios de cabelo após o atendimento" width="3024" height="4032" />
          <motion.div className="story__symbol-mark" aria-hidden="true" animate={{ rotate: reduceMotion ? 0 : 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
            <Mark />
          </motion.div>
        </div>
        <div className="story__text">
          <article className={`story__step${activeSteps.includes(0) ? ' story__step--active' : ''}`} data-story-step="0">
            <h3>Um ponto de partida.</h3>
            <p className="story__lead">Um símbolo. Infinitas possibilidades.</p>
            <p>O asterisco da Small representa tudo aquilo que não cabe em um único padrão.</p>
          </article>
          <article className={`story__step${activeSteps.includes(1) ? ' story__step--active' : ''}`} data-story-step="1">
            <h3>Mas não precisa terminar ali.</h3>
            <p>É sobre explorar possibilidades, valorizar diferenças e entender que cada estilo tem sua própria identidade.</p>
          </article>
          <article className={`story__step${activeSteps.includes(2) ? ' story__step--active' : ''}`} data-story-step="2">
            <h3>Sempre existe algo a mais.</h3>
            <p>Esse é o conceito que orienta a identidade da marca. A história, a missão e os valores do estúdio.  Não existe uma única forma de fazer bem-feito — existe técnica, visão e respeito por cada estilo.</p>
            <a className="text-link" href="#trabalhos">Ver o trabalho de perto <ArrowDownRight size={17} /></a>
          </article>
        </div>
      </div>
      <div className="story__mission">
        <span className="story__mission-mark"><Mark /></span>
        <p>Ir além não é fazer mais por fazer.<br /><strong>É cuidar do que faz diferença.</strong></p>
        </div>
    </section>
  )
}

function Portfolio() {
  const sequenceRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const items = siteConfig.portfolio
  const { scrollYProgress } = useScroll({ target: sequenceRef, offset: ['start start', 'end end'] })
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0])
  const secondTitleOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.3, 0.4], [0, 1, 1, 0])
  const titleY = useTransform(scrollYProgress, [0.3, 0.4], [0, -42])
  const closingOpacity = useTransform(scrollYProgress, [0.92, 0.99], [0, 1])
  const closingY = useTransform(scrollYProgress, [0.92, 0.99], [28, 0])
  return (
    <section className="portfolio section-pad" id="trabalhos" aria-labelledby="portfolio-title">
      <div ref={sequenceRef} className="portfolio__sequence">
        <div className="portfolio__stage">
          <div className="portfolio__intro">
            <motion.h2 id="portfolio-title" style={{ opacity: reduceMotion ? 1 : titleOpacity, y: reduceMotion ? 0 : titleY }}>O ESTILO NÃO TEM<br />UMA ÚNICA FORMA.</motion.h2>
            <motion.h2 style={{ opacity: reduceMotion ? 1 : secondTitleOpacity, y: reduceMotion ? 0 : titleY }}>O RESULTADO FALA<br />POR SI SÓ.</motion.h2>
          </div>
          <div className="portfolio__gallery">
            {items.map((item, itemIndex) => (
              <PortfolioItem key={item.image} item={item} itemIndex={itemIndex} progress={scrollYProgress} reduceMotion={reduceMotion} />
            ))}
          </div>
          <motion.div className="portfolio__closing" style={{ opacity: reduceMotion ? 1 : closingOpacity, y: reduceMotion ? 0 : closingY }}>
            <p className="portfolio__closing-text">Do clássico ao contemporâneo. Diferentes técnicas, diferentes identidades. O mesmo cuidado em cada detalhe.</p>
          </motion.div>
          </div>
      </div>
    </section>
  )
}

function PortfolioItem({
  item,
  itemIndex,
  progress,
  reduceMotion,
}: {
  item: (typeof siteConfig.portfolio)[number]
  itemIndex: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduceMotion: boolean | null
}) {
  const start = 0.4 + itemIndex * 0.052
  const end = Math.min(start + 0.052, 0.92)
  const opacity = useTransform(progress, [start, start + 0.012, end - 0.012, end], [0, 1, 1, 0])
  const y = useTransform(progress, [start, start + 0.012, end - 0.012, end], [34, 0, 0, -42])
  const scale = useTransform(progress, [start, start + 0.012, end - 0.012, end], [0.985, 1, 1, 1.01])

  return (
    <motion.figure
      className={`portfolio__item portfolio__item--${itemIndex + 1}`}
      style={{
        zIndex: itemIndex + 1,
        opacity: reduceMotion ? 1 : opacity,
        y: reduceMotion ? 0 : y,
        scale: reduceMotion ? 1 : scale,
      }}
    >
      <img src={item.image} alt={item.alt} width="1200" height="900" loading={itemIndex < 4 ? 'eager' : 'lazy'} />
      <figcaption>{item.caption}</figcaption>
    </motion.figure>
  )
}

function Environment() {
  return (
    <section className="environment" id="espaco" aria-labelledby="environment-title">
      <div className="environment__copy section-pad">
        <div className="section-kicker section-kicker--light"><p className="eyebrow">AMBIENTE</p></div>
        <Reveal><h2 id="environment-title">Um lugar para<br /><em>desacelerar.</em></h2></Reveal>
        <Reveal delay={0.1}><p className="environment__description">Conheça o espaço da Small Studio Barber. Um ambiente para se sentir à vontade e aproveitar o seu momento.</p></Reveal>
        </div>
      <div className="environment__media">
        {siteConfig.environmentVideo ? <video autoPlay muted loop playsInline preload="auto" poster={siteConfig.environmentPoster || undefined} aria-label="Vídeo do ambiente da Small Studio Barber"><source src={siteConfig.environmentVideo} type="video/mp4" />Seu navegador não suporta vídeo.</video> : <div className="video-placeholder"><span className="video-placeholder__line" /><span>VÍDEO DO AMBIENTE<br />ARQUIVO PENDENTE</span><span className="video-placeholder__line" /></div>}
        </div>
    </section>
  )
}

function Contact() {
  const bookingSiteHref = siteConfig.bookingSite
  const whatsappHref = siteConfig.whatsapp
  const address = siteConfig.address || 'Rua Montevidéu, 10 - Serrinha, Fortaleza'
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const instagramHref = siteConfig.instagram || 'https://www.instagram.com/smallstudiobarber/'
  return (
    <section className="contact section-pad" id="contato" aria-labelledby="contact-title">
      <div className="section-kicker"><span>Contato e agendamento</span></div>
      <div className="contact__main">
        <Reveal><p className="eyebrow eyebrow--dark">QUANDO QUISER IR ALÉM</p><h2 id="contact-title">A próxima<br />direção é <em>sua.</em></h2></Reveal>
        <Reveal delay={0.12} className="contact__action">
          <p>Acesse o link para iniciar seu agendamento online.</p>
          <a className="button-link" href={bookingSiteHref} target="_blank" rel="noreferrer">Agende seu horário <ArrowUpRight size={17} aria-hidden="true" /></a>
        </Reveal>
      </div>
      <div className="contact__details">
        <div><a className="button-link" href={mapsHref} target="_blank" rel="noreferrer"><MapPin size={19} aria-hidden="true" />{address}<ArrowUpRight size={17} aria-hidden="true" /></a></div>
        <div><a className="button-link" href={instagramHref} target="_blank" rel="noreferrer"><Camera size={19} aria-hidden="true" />Instagram<ArrowUpRight size={17} aria-hidden="true" /></a></div>
        <div><a className="button-link" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={19} aria-hidden="true" />WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </div>
    </section>
  )
}



function BrandStamp() {
  return (
    <section className="brand-stamp" aria-label="Império Soluções Digitais">
      <img src="/assets/images/imperio-solucoes-digitais-claro.png" alt="Império Soluções Digitais" width="2000" height="740" loading="lazy" />
    </section>
  )
}

export default function App() {
  return <><Header /><main><Hero /><Story /><Portfolio /><Environment /><Contact /></main><BrandStamp /></>
}
