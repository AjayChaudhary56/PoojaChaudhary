"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  collaboration,
  education,
  films,
  gallery,
  instagramReels,
  musicVideos,
  nursingExperience,
  profile,
  resumeLinks,
  showreel,
  socialLinks,
} from "../src/content/portfolio";

const navItems = [
  ["Work", "filmography"],
  ["Showreel", "showreel"],
  ["Music", "music-videos"],
  ["Reels", "instagram-reels"],
  ["Story", "journey"],
  ["Contact", "contact"],
];

function isPlaceholderUrl(url: string) {
  return url.toUpperCase().includes("PLACEHOLDER");
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let animation = 0;
    const pointer = { x: 0, y: 0 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: reduced ? 42 : 84 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.18 + Math.random() * 0.82,
      size: 0.45 + Math.random() * (index % 9 === 0 ? 2.1 : 1.1),
      speed: 0.00004 + Math.random() * 0.00013,
      warm: Math.random() > 0.68,
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / width - 0.5;
      pointer.y = event.clientY / height - 0.5;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      frame += reduced ? 0 : 1;
      const scrollBoost = Math.min(window.scrollY / Math.max(height, 1), 2.5);
      for (const particle of particles) {
        const drift = frame * particle.speed * (1 + scrollBoost * 0.18);
        const x = ((particle.x + drift * particle.z) % 1) * width + pointer.x * 25 * particle.z;
        const y = ((particle.y + drift * 0.22) % 1) * height + pointer.y * 18 * particle.z;
        const alpha = 0.08 + particle.z * 0.42;
        const radius = particle.size * (0.45 + particle.z);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = particle.warm
          ? `rgba(231, 161, 119, ${alpha})`
          : `rgba(255, 226, 214, ${alpha * 0.65})`;
        context.fill();
      }
      animation = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    draw();
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function SocialIcon({ platform }: { platform: string }) {
  if (platform === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle className="social-icon-dot" cx="17.4" cy="6.7" r="1" />
      </svg>
    );
  }

  if (platform === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4.2" />
        <path className="social-icon-fill" d="m10 9 5 3-5 3Z" />
      </svg>
    );
  }

  if (platform === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path className="social-icon-fill" d="M14.2 21v-7.8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H8v3.1h2.8V21h3.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="social-icon-fill" d="M15.1 3.2c.4 2.4 1.8 3.9 4.2 4.2v3.1a8.2 8.2 0 0 1-4.2-1.3v5.5a5.5 5.5 0 1 1-4.7-5.4v3.2a2.3 2.3 0 1 0 1.6 2.2V3.2h3.1Z" />
    </svg>
  );
}

function getInstagramEmbedUrl(reelUrl: string) {
  return `${reelUrl.replace(/\/?$/, "/")}embed/`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [placeholderTitle, setPlaceholderTitle] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState("");
  const [activeReel, setActiveReel] = useState(0);
  const [reelsPaused, setReelsPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reelsPaused || reducedMotion || instagramReels.length < 2) return;
    const rotation = window.setInterval(() => {
      setActiveReel((current) => (current + 1) % instagramReels.length);
    }, 12000);
    return () => window.clearInterval(rotation);
  }, [reelsPaused]);

  useEffect(() => {
    const root = document.documentElement;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let animation = 0;

    const updatePointer = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };
    const updateScroll = () => {
      const hero = document.querySelector<HTMLElement>(".hero-scroll");
      if (hero) {
        const max = Math.max(hero.offsetHeight - window.innerHeight, 1);
        targetProgress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / max));
      }
    };
    const render = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      currentProgress += (targetProgress - currentProgress) * 0.085;
      root.style.setProperty("--mx", currentX.toFixed(4));
      root.style.setProperty("--my", currentY.toFixed(4));
      root.style.setProperty("--hero-progress", currentProgress.toFixed(4));
      animation = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.14 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlaceholderTitle(null);
        setMenuOpen(false);
      }
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    updateScroll();
    render();
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const openMedia = (url: string, title: string) => {
    if (isPlaceholderUrl(url)) {
      setPlaceholderTitle(title);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCollaborationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const projectType = String(formData.get("projectType") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = `${collaboration.subject} — ${projectType}`;
    const body = [
      collaboration.websiteMessageLabel,
      "",
      `Name: ${name}`,
      `Reply email: ${email}`,
      `Project type: ${projectType}`,
      "",
      "Message:",
      message,
    ].join("\n");

    setFormStatus(`Your email app is ready. Send the prepared message to ${collaboration.email}.`);
    window.location.href = `mailto:${collaboration.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const currentReel = instagramReels[activeReel];
  const showPreviousReel = () => {
    setActiveReel((current) => (current - 1 + instagramReels.length) % instagramReels.length);
    setReelsPaused(true);
  };
  const showNextReel = () => {
    setActiveReel((current) => (current + 1) % instagramReels.length);
    setReelsPaused(true);
  };

  return (
    <main>
      <ParticleField />
      <div className="ambient-vignette" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-mark" href="#home" aria-label="Pooja Chaudhary home">
          <span className="brand-name"><strong>Pooja</strong><strong>Chaudhary</strong></span>
          <span className="brand-role">Actor</span>
        </a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">Let&apos;s collaborate <Arrow diagonal /></a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        ><span /><span /></button>
      </header>

      <section id="home" className="hero-scroll" aria-labelledby="hero-title">
        <div className="hero-sticky">
          <div className="hero-depth hero-depth-far" aria-hidden="true">
            <div className="deep-sphere" /><div className="orbit-dust" />
          </div>
          <div className="hero-depth hero-depth-mid" aria-hidden="true">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <div className="glass-fragment glass-one" /><div className="glass-fragment glass-two" />
          </div>

          <div className="hero-intro">
            <span className="eyebrow">Actor · Film · Music video</span>
            <p>{profile.heroSupportingLine}</p>
            <span className="hero-rn-badge">Registered Nurse · Australia</span>
          </div>
          <h1 id="hero-title" className="hero-name" aria-label="Pooja Chaudhary">
            <span className="name-first">{profile.firstName}</span>
            <span className="name-last">{profile.lastName}</span>
          </h1>
          <div className="hero-portrait-wrap">
            <div className="portrait-glow" aria-hidden="true" />
            <img
              className="hero-portrait"
              src={profile.heroImage}
              alt="Pooja Chaudhary in traditional white clothing and silver jewellery"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-statement">
            <p>{profile.heroStatement}</p>
            <div className="hero-actions">
              <a className="button button-gold" href="#filmography">View acting work <Arrow /></a>
              <a className="button button-quiet" href="#showreel">Watch showreel</a>
              <a className="button button-quiet" href="#journey">Her story</a>
            </div>
          </div>
          <div className="foreground-specks" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll to enter</span><i /></div>
          <div className="hero-journey-reveal" aria-hidden="true"><span>01 / Actor</span><strong>SELECTED WORK</strong></div>
        </div>
      </section>

      <section className="camera-transition" aria-labelledby="camera-transition-title">
        <div className="camera-glow" aria-hidden="true" /><p className="eyebrow reveal">The actor</p>
        <h2 id="camera-transition-title" className="reveal"><span>Presence</span><span>in every frame</span><em>Film · character · music</em></h2>
        <p className="reveal">A growing screen portfolio across Nepali film and music video.</p>
      </section>

      <section id="filmography" className="section film-section">
        <div className="section-header reveal">
          <div><p className="eyebrow">Verified credit · Selected work</p><h2>Filmography</h2></div>
          <p>Pooja&apos;s confirmed film credit is presented as one complete feature, from official poster to production details.</p>
        </div>
        <div className={films.length === 1 ? "film-grid is-single" : "film-grid"}>
          {films.map((film, index) => (
            <article className="film-card reveal" key={film.title}>
              <button className="film-poster" type="button" onClick={() => openMedia(film.trailerUrl, `${film.title} trailer`)} aria-label={`Open trailer for ${film.title}`}>
                <img src={film.poster} alt={`${film.creditStatus === "verified" ? "Official" : "Abstract placeholder"} poster for ${film.title}`} loading={index > 1 ? "lazy" : "eager"} referrerPolicy="no-referrer" />
                <span className={`placeholder-stamp ${film.creditStatus === "verified" ? "is-verified" : ""}`}>{film.creditStatus === "verified" ? "Verified credit" : "Temporary artwork"}</span><span className="poster-index">Film {String(index + 1).padStart(2, "0")}</span>
                <span className="poster-play">{film.creditStatus === "verified" ? "Watch teaser" : "Play trailer"} <Arrow diagonal /></span>
              </button>
              <div className="film-meta">
                <div><span>{film.year}</span><span>{film.role}</span></div><h3>{film.title}</h3>
                <dl><div><dt>Director</dt><dd>{film.director}</dd></div><div><dt>Production</dt><dd>{film.production}</dd></div></dl>
                <p>{film.description}</p>
                {film.detailsUrl && <a className="film-detail-link" href={film.detailsUrl} target="_blank" rel="noreferrer">Official film page <Arrow diagonal /></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="music-videos" className="section music-section">
        <div className="section-header reveal">
          <div><p className="eyebrow">Official videos · On screen</p><h2>Music videos</h2></div>
          <p>Panchhi Deewana and Khan Khan Khan are now featured with their official videos.</p>
        </div>
        <div className="music-grid">
          {musicVideos.map((video, index) => (
            <article className="music-card reveal" key={video.songTitle}>
              <button type="button" onClick={() => openMedia(video.videoUrl, `${video.songTitle} video`)} aria-label={`Open ${video.songTitle}`}>
                <img src={video.thumbnail} alt={`${video.creditStatus === "verified" ? "Official" : "Abstract placeholder"} thumbnail for ${video.songTitle}`} loading="lazy" referrerPolicy="no-referrer" />
                <span className="music-count">0{index + 1}</span><span className="music-play" aria-hidden="true">▶</span><span className={`placeholder-stamp ${video.creditStatus === "verified" ? "is-verified" : ""}`}>{video.creditStatus === "verified" ? "Official video" : "Temporary visual"}</span>
              </button>
              <div><p>{video.artist} · {video.year}</p><h3>{video.songTitle}</h3><span>{video.role}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section id="instagram-reels" className="section reels-section">
        <div className="reels-copy reveal">
          <p className="eyebrow">Instagram · Reels in rotation</p>
          <h2>Life beyond<br /><em>the frame.</em></h2>
          <p>A changing selection of Pooja&apos;s public Instagram reels. Rotation pauses whenever you choose a reel manually.</p>
          <a className="reels-profile-link" href="https://www.instagram.com/poozachaudhari143/" target="_blank" rel="noreferrer">
            <span className="reels-instagram-icon"><SocialIcon platform="Instagram" /></span>
            Follow @poozachaudhari143 <Arrow diagonal />
          </a>
          <div className="reels-controls" aria-label="Instagram reel controls">
            <button type="button" onClick={showPreviousReel} aria-label="Previous Instagram reel">←</button>
            <button type="button" className="reels-pause" onClick={() => setReelsPaused((paused) => !paused)} aria-pressed={reelsPaused}>
              {reelsPaused ? "Resume rotation" : "Pause rotation"}
            </button>
            <button type="button" onClick={showNextReel} aria-label="Next Instagram reel">→</button>
          </div>
          <div className="reels-index" role="tablist" aria-label="Choose an Instagram reel">
            {instagramReels.map((reel, index) => (
              <button
                key={reel.reelUrl}
                type="button"
                role="tab"
                aria-selected={index === activeReel}
                className={index === activeReel ? "is-active" : ""}
                onClick={() => {
                  setActiveReel(index);
                  setReelsPaused(true);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{reel.title}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="reel-stage reveal">
          <div className="reel-stage-label"><span>Now showing</span><strong>{currentReel.title}</strong></div>
          <div className="reel-phone">
            <iframe
              key={currentReel.reelUrl}
              src={getInstagramEmbedUrl(currentReel.reelUrl)}
              title={`Instagram reel: ${currentReel.title}`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className={reelsPaused ? "reel-progress is-paused" : "reel-progress"} key={`${activeReel}-${reelsPaused}`} aria-hidden="true"><i /></div>
          <a className="reel-open-link" href={currentReel.reelUrl} target="_blank" rel="noreferrer">Open on Instagram <Arrow diagonal /></a>
        </div>
      </section>

      <section id="showreel" className="section showreel-section">
        <div className="showreel-frame reveal">
          <img src={showreel.showreelThumbnail} alt="Abstract acting showreel placeholder" /><div className="showreel-shade" />
          <div className="showreel-copy"><p className="eyebrow">Acting showreel · Placeholder</p><h2>{showreel.status}</h2>
            <button type="button" onClick={() => openMedia(showreel.showreelUrl, "Acting showreel")}><span>▶</span> Preview placeholder</button>
          </div><span className="showreel-edge">S / 01</span>
        </div>
      </section>

      <section className="section gallery-section" aria-labelledby="gallery-heading">
        <div className="section-header reveal"><div><p className="eyebrow">Frames · Placeholder gallery</p><h2 id="gallery-heading">In motion</h2></div><p>Replace these six files later and the gallery will update automatically.</p></div>
        <div className="gallery-grid">
          {gallery.map((item, index) => <figure className="reveal" key={item.image}><img src={item.image} alt={item.alt} /><figcaption>Placeholder frame · {String(index + 1).padStart(2, "0")}</figcaption></figure>)}
        </div>
      </section>

      <section id="journey" className="section journey-section">
        <div className="section-number reveal">06 / Her story</div>
        <div className="journey-heading reveal">
          <p className="eyebrow">Beyond the screen · Nepal → Australia</p>
          <h2>Grounded in care.<br /><em>Drawn to story.</em></h2>
          <p className="journey-copy">{profile.biography}</p>
        </div>
        <div className="journey-world reveal">
          <div className="globe-shell" aria-label="Journey from Nepal to Australia">
            <div className="globe-atmosphere" aria-hidden="true" />
            <div className="globe-grid globe-grid-a" aria-hidden="true" />
            <div className="globe-grid globe-grid-b" aria-hidden="true" />
            <svg className="journey-route" viewBox="0 0 500 500" aria-hidden="true">
              <path d="M 145 188 Q 290 84 385 324" />
              <path className="route-light" d="M 145 188 Q 290 84 385 324" />
              <circle cx="145" cy="188" r="7" /><circle cx="385" cy="324" r="7" />
            </svg>
            <div className="globe-label label-nepal"><span>Origin</span><strong>Nepal</strong></div>
            <div className="globe-label label-australia"><span>New chapter</span><strong>Australia</strong></div>
          </div>
          <div className="journey-timeline">
            <div><span>01</span><p>Nursing<br /><strong>Nepal</strong></p></div><i />
            <div><span>02</span><p>A new<br /><strong>chapter</strong></p></div><i />
            <div><span>03</span><p>Australia<br /><strong>Registered Nurse</strong></p></div>
          </div>
        </div>
        <div className="credentials-grid reveal">
          <article>
            <span className="credential-index">N / 01</span><p className="eyebrow">Professional experience</p>
            <h3>{nursingExperience[0].title}</h3>
            <dl><div><dt>Location</dt><dd>{nursingExperience[0].location}</dd></div><div><dt>Dates</dt><dd>{nursingExperience[0].dates}</dd></div></dl>
            <p>{nursingExperience[0].description}</p>
          </article>
          <article>
            <span className="credential-index">E / 01</span><p className="eyebrow">Education</p>
            <h3>{education[0].qualification}</h3>
            <dl><div><dt>Institution</dt><dd>{education[0].institution}</dd></div><div><dt>Location</dt><dd>{education[0].location}</dd></div></dl>
            <p>{education[0].description}</p>
          </article>
        </div>
      </section>

      <section id="resume" className="section resume-section">
        <div className="resume-orbit" aria-hidden="true" />
        <div className="resume-copy reveal"><p className="eyebrow">Acting credits & experience</p><h2>Her work,<br /><em>on paper.</em></h2><p>Download Pooja&apos;s acting résumé, or view the professional placeholder while verified details are prepared.</p></div>
        <div className="resume-actions reveal">
          <a className="resume-button primary" href={resumeLinks.resumeActingUrl} download><span><small>PDF · Placeholder</small>Download acting résumé</span><Arrow diagonal /></a>
          <a className="resume-button" href={resumeLinks.resumeProfessionalUrl} download><span><small>PDF · Placeholder</small>Download professional résumé</span><Arrow diagonal /></a>
          <a className="resume-button" href={resumeLinks.resumeProfessionalUrl} target="_blank" rel="noreferrer"><span><small>Open in browser</small>View résumé</span><Arrow diagonal /></a>
        </div>
      </section>

      <section id="contact" className="section collaboration-section">
        <div className="collaboration-kicker reveal"><span>Open for selected projects</span><i /></div>
        <div className="collaboration-copy reveal">
          <p className="eyebrow">Film · Music video · Creative work</p>
          <h2>Let&apos;s create<br /><em>something memorable.</em></h2>
          <p>{collaboration.availability}</p>
        </div>
        <form className="collaboration-form reveal" onSubmit={handleCollaborationSubmit}>
          <div className="form-heading">
            <span>Project enquiry</span>
            <small>All fields are required</small>
          </div>
          <div className="form-grid">
            <label>
              <span>Your name</span>
              <input type="text" name="name" autoComplete="name" placeholder="Name" required />
            </label>
            <label>
              <span>Your email</span>
              <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
            <label className="form-field-wide">
              <span>Project type</span>
              <select name="projectType" defaultValue="" required>
                <option value="" disabled>Select a project</option>
                <option value="Film">Film</option>
                <option value="Music video">Music video</option>
                <option value="Commercial or brand">Commercial or brand</option>
                <option value="Creative collaboration">Creative collaboration</option>
                <option value="Other enquiry">Other enquiry</option>
              </select>
            </label>
            <label className="form-field-wide">
              <span>Your message</span>
              <textarea name="message" rows={5} placeholder="Tell Pooja about your project, location and preferred dates." required />
            </label>
          </div>
          <div className="form-submit-row">
            <p>Submitting opens your email app with a message addressed to <strong>{collaboration.email}</strong>.</p>
            <button className="collaboration-submit" type="submit">Send enquiry <Arrow diagonal /></button>
          </div>
          {formStatus && <p className="form-status" role="status">{formStatus}</p>}
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-orbit" aria-hidden="true"><i /><i /><b /></div>
        <div className="footer-intro reveal">
          <p className="eyebrow">Stay in the frame</p>
          <h2>Follow her<br /><em>next chapter.</em></h2>
          <p>New screen work, rotating reels and moments from the journey — all in one place.</p>
        </div>
        <div className="footer-socials reveal">
          {socialLinks.map((social) => (
            <a className="footer-social-card" key={social.platform} href={social.url} target="_blank" rel="noreferrer" aria-label={`Open Pooja's ${social.platform}`}>
              <span className="footer-social-icon"><SocialIcon platform={social.platform} /></span>
              <span className="footer-social-copy"><strong>{social.platform}</strong><small>{social.label}</small></span>
              <Arrow diagonal />
            </a>
          ))}
        </div>
        <div className="footer-wordmark reveal" aria-label="Pooja Chaudhary"><span>Pooja</span><span>Chaudhary</span></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Pooja Chaudhary</span><a href="#home">Back to top ↑</a><span>Australia</span></div>
      </footer>

      {placeholderTitle && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPlaceholderTitle(null)}>
          <div className="placeholder-modal" role="dialog" aria-modal="true" aria-labelledby="placeholder-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setPlaceholderTitle(null)} aria-label="Close">×</button>
            <span className="eyebrow">Ready to replace</span><h2 id="placeholder-modal-title">{placeholderTitle}</h2>
            <p>This is a clearly marked dummy link. Add Pooja’s real YouTube URL in <strong>src/content/portfolio.ts</strong> and this button will open it automatically.</p>
            <button className="button button-gold" type="button" onClick={() => setPlaceholderTitle(null)}>Got it</button>
          </div>
        </div>
      )}
    </main>
  );
}
