import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, OrbitControls, Sparkles } from '@react-three/drei';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, Heart, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const CHAPTERS = [
  ['home', 'The night'],
  ['lamps', 'The lamps'],
  ['rangoli', 'The rangoli'],
  ['letter', 'The letter'],
  ['sky', 'The sky'],
];

const LANTERNS = [
  { id: 0, whisper: 'The brightest rooms start with one brave flame.' },
  { id: 1, whisper: 'Someone wished for your smile before the first lamp was lit.' },
  { id: 2, whisper: 'Downstairs, a rangoli is unfinished. It is waiting for your hands.' },
];

const BLESSINGS = ['warmth', 'courage', 'laughter', 'home', 'wonder'];

const INKS = [
  { name: 'marigold', color: '#ff9f1c' },
  { name: 'lotus', color: '#e24b78' },
  { name: 'peacock', color: '#129e9a' },
  { name: 'haldi', color: '#ffe066' },
  { name: 'jamun', color: '#7a4dff' },
];

const GLOSS = {
  happiness: 'the kind that arrives with cardamom, sweets, and a house full of lamps',
  heart: 'still the brightest diya in any room you walk into',
  year: 'twelve months, and a little extra light tucked into each one',
};

const CRUMBS = {
  moon: {
    title: 'The moon keeps a diary',
    note: 'THIS IS FOR YOU SCAMMER',
  },
  ink: {
    title: 'The ink is still wet',
    note: 'This whole night was drawn by hand, one warm line at a time.',
  },
  petal: {
    title: 'A petal wandered off',
    note: 'Pick a brush, then tap the empty petals. They hate being left out.',
  },
  star: {
    title: 'A star folded in half',
    note: 'The rosy words inside the letter know more than they say.',
  },
  firefly: {
    title: 'The last firefly',
    note: 'Pin a few stars, then let a lantern carry a wish in your own words.',
  },
};

const PETAL_ANGLES = Array.from({ length: 8 }, (_, index) => index * 45);

function useFestiveSound() {
  const ctxRef = useRef(null);
  const onRef = useRef(false);

  const chime = (kind) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!ctxRef.current) ctxRef.current = new AudioContextClass();
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const notes = {
      bell: [523.25, 659.25, 783.99],
      pop: [392, 523.25],
      sparkle: [880, 1174.66],
      whoosh: [196, 329.63, 523.25],
    }[kind] || [523.25];

    const now = ctx.currentTime;
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'whoosh' ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      const start = now + index * 0.05;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.04, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.1);
    });
  };

  return {
    play(kind) {
      if (onRef.current) chime(kind);
    },
    arm(next) {
      onRef.current = next;
      if (next) chime('sparkle');
    },
  };
}

function Flame() {
  return (
    <Float speed={2.2} rotationIntensity={0.16} floatIntensity={0.25}>
      <group position={[0, 0.58, 0]}>
        <mesh scale={[0.32, 0.55, 0.22]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#ffb000" emissive="#ff7a1a" emissiveIntensity={2.1} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.08, 0.03]} scale={[0.14, 0.32, 0.13]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#fff6d2" />
        </mesh>
      </group>
    </Float>
  );
}

function DiyaScene({ lit }) {
  return (
    <Canvas
      key="lamp-v2"
      camera={{ position: [1.2, 0.95, 3.55], fov: 32 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor('#fff6e4', 0);
        camera.lookAt(0, 0.05, 0);
      }}
    >
      <ambientLight intensity={0.95} />
      <pointLight position={[0, 2.2, 2]} intensity={lit ? 18 : 4} color="#ff9f1c" distance={8} />
      <pointLight position={[-2.4, 1.2, -1.5]} intensity={2.2} color="#e24b78" />
      <Sparkles count={lit ? 70 : 24} scale={4.5} size={2.4} speed={0.35} color="#ffb000" />
      <group position={[0, -0.15, 0]}>
        <mesh scale={[1.15, 0.4, 0.95]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial color="#e07040" roughness={0.62} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.085, 20, 56]} />
          <meshStandardMaterial color="#f2c56b" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[-0.35, 0.2, 0]} scale={[0.62, 0.62, 0.28]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color="#3a243f" roughness={0.5} />
        </mesh>
        {lit && <Flame />}
        <mesh position={[0, -0.32, 0]} scale={[0.55, 0.1, 0.42]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color="#c4532a" roughness={0.55} />
        </mesh>
      </group>
      <ContactShadows position={[0, -0.62, 0]} opacity={0.35} scale={5} blur={2.4} color="#241536" />
      <OrbitControls target={[0, 0.05, 0]} enableZoom={false} enablePan={false} minPolarAngle={1.05} maxPolarAngle={1.55} />
    </Canvas>
  );
}

function MoonSvg({ awake }) {
  return (
    <svg className="moon-svg" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#ffe7a8" stroke="#241536" strokeWidth="3" />
      <circle cx="84" cy="40" r="8" fill="#f3d48a" />
      <circle cx="42" cy="74" r="5" fill="#f3d48a" />
      {awake ? (
        <path d="M36 50h16" stroke="#241536" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M38 48c2 5 12 5 14 0" fill="none" stroke="#241536" strokeWidth="3" strokeLinecap="round" />
      )}
      <path d="M70 50c2 4 10 4 12 0" fill="none" stroke="#241536" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 78c8 8 20 8 28 1" fill="none" stroke="#241536" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Cloud({ className }) {
  return (
    <svg className={className} viewBox="0 0 140 70" aria-hidden="true">
      <path
        d="M28 54c-14 0-22-10-20-20 2-10 12-16 22-14 4-12 18-18 32-14 10 2 16 10 18 18 14-2 26 8 26 20 0 12-10 20-22 20H28z"
        fill="#fffaf0"
        stroke="#241536"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LanternSvg({ lit }) {
  return (
    <svg className="lantern-svg" viewBox="0 0 70 108" aria-hidden="true">
      <line x1="35" y1="0" x2="35" y2="14" stroke="#241536" strokeWidth="2.5" />
      <path d="M35 14l12 10H23z" fill="#e24b78" stroke="#241536" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="16" y="26" width="38" height="44" rx="10" fill={lit ? '#ffd27a' : '#f4e4c4'} stroke="#241536" strokeWidth="3" />
      <path d="M16 42h38M16 56h38" stroke="#241536" strokeWidth="1.6" opacity="0.35" />
      {lit && <circle cx="35" cy="48" r="7" fill="#fff6d0" />}
      <path d="M35 70l10 12H25z" fill="#ff9f1c" stroke="#241536" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M35 84v12" stroke="#241536" strokeWidth="2" />
    </svg>
  );
}

function MiniDiya({ lit }) {
  return (
    <svg className="mini-diya-svg" viewBox="0 0 88 96" aria-hidden="true">
      {lit && (
        <g className="flame-flicker">
          <path d="M44 6c9 12 16 18 13 32-7-5-9-4-13 3-5-9-9-9-16-3 1-14 7-22 16-32z" fill="#ffb000" stroke="#241536" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M44 20c4 7 6 10 4 16-4-2-6-1-7 3-2-5-5-5-7-1 1-7 4-12 10-18z" fill="#fff6d0" />
        </g>
      )}
      <path d="M12 58c8 22 56 22 64 0-12 14-52 14-64 0z" fill="#ef7d45" stroke="#241536" strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 57h48" stroke="#ffd27a" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="44" cy="57" rx="15" ry="5" fill="#3a243f" />
      <path d="M30 74c5 12 23 12 28 0" fill="#d85a32" stroke="#241536" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function InkBottle() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M18 6h12v8H18z" fill="#fff6e4" stroke="#241536" strokeWidth="2.4" />
      <rect x="10" y="16" width="28" height="24" rx="6" fill="#241536" />
      <circle cx="30" cy="28" r="4" fill="#ff9f1c" />
    </svg>
  );
}

function LoosePetal() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 6c8 8 12 16 8 28-8-4-12-4-16 2C10 22 14 12 24 6z" fill="#e24b78" stroke="#241536" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

function Curiosity({ id, found, onFind, className, children }) {
  return (
    <button
      type="button"
      className={`curiosity ${found ? 'is-found' : ''} ${className || ''}`}
      onClick={(event) => {
        event.stopPropagation();
        onFind(id);
      }}
      aria-label={found ? CRUMBS[id].title : 'Something curious is hiding here'}
    >
      {children}
    </button>
  );
}

function StorySky({ lanterns, activeLantern, onLantern, onMoon, moonFound, reduceMotion }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const shiftX = useTransform(mx, [-0.5, 0.5], [-18, 18]);
  const shiftY = useTransform(my, [-0.5, 0.5], [-12, 12]);
  const glowing = lanterns.filter(Boolean).length;

  const move = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  let whisper = 'Three lanterns. Three secrets. They are not only decoration.';
  if (activeLantern != null) whisper = LANTERNS[activeLantern].whisper;
  if (glowing === 3) whisper = `${whisper} All three are awake.`;

  return (
    <div className="story-sky" onPointerMove={move}>
      <motion.div className="sky-drift" style={reduceMotion ? undefined : { x: shiftX, y: shiftY }}>
        <button type="button" className={`moon-btn ${moonFound ? 'is-awake' : ''}`} onClick={onMoon} aria-label="Tap the illustrated moon">
          <MoonSvg awake={moonFound} />
        </button>
        <Cloud className="cloud cloud-a" />
        <Cloud className="cloud cloud-b" />
        <span className="sky-spark a">✦</span>
        <span className="sky-spark b">✧</span>
      </motion.div>
      <div className="lantern-string" />
      {LANTERNS.map((lantern) => (
        <button
          key={lantern.id}
          type="button"
          className={`hang-lantern hang-${lantern.id} ${lanterns[lantern.id] ? 'is-lit' : ''}`}
          onClick={() => onLantern(lantern.id)}
          aria-pressed={lanterns[lantern.id]}
          aria-label={lanterns[lantern.id] ? 'Lantern glowing. Hear its secret again' : 'Light this lantern'}
        >
          <LanternSvg lit={lanterns[lantern.id]} />
        </button>
      ))}
      <p className="whisper" aria-live="polite">{whisper}</p>
    </div>
  );
}

function FireworkShow({ burstId }) {
  const colors = ['#ffb000', '#e24b78', '#fff6e4', '#7dffe8'];
  return (
    <motion.div className="firework-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
        <motion.span
          key={`${burstId}-${index}`}
          className="burst"
          style={{
            left: `${8 + ((index * 37) % 84)}%`,
            top: `${10 + ((index * 23) % 68)}%`,
            color: colors[index % colors.length],
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1.35, 0], opacity: [1, 1, 0], y: [0, -26 - (index % 4) * 12] }}
          transition={{ duration: 1.5, delay: (index % 7) * 0.06 }}
        >
          {index % 2 === 0 ? '✦' : '✿'}
        </motion.span>
      ))}
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="ink-divider" aria-hidden="true">
      <span />
      <i>✺</i>
      <span />
    </div>
  );
}

function App() {
  const [sound, setSound] = useState(false);
  const [chapter, setChapter] = useState('home');
  const [lit, setLit] = useState(false);
  const [courtyard, setCourtyard] = useState([false, false, false, false, false]);
  const [lanterns, setLanterns] = useState([false, false, false]);
  const [activeLantern, setActiveLantern] = useState(null);
  const [petals, setPetals] = useState(() => Array(8).fill(null));
  const [brush, setBrush] = useState(0);
  const [centerOpen, setCenterOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [gloss, setGloss] = useState(null);
  const [wish, setWish] = useState('');
  const [wishes, setWishes] = useState([]);
  const [stars, setStars] = useState([]);
  const [found, setFound] = useState([]);
  const [toast, setToast] = useState(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [fireworks, setFireworks] = useState(0);
  const [sparks, setSparks] = useState([]);
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const { play, arm } = useFestiveSound();
  const toastTimer = useRef(null);

  useEffect(() => {
    const nodes = CHAPTERS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setChapter(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  };

  const find = (id) => {
    setFound((list) => (list.includes(id) ? list : [...list, id]));
    showToast(CRUMBS[id].note);
    play('sparkle');
  };

  const launchFireworks = () => {
    setFireworks((value) => value + 1);
    window.setTimeout(() => setFireworks((value) => Math.max(0, value - 1)), 2200);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    arm(next);
  };

  const toggleDiya = () => {
    setLit((value) => !value);
    if (!lit) play('bell');
  };

  const toggleLamp = (index) => {
    setCourtyard((list) => list.map((value, i) => (i === index ? !value : value)));
    if (!courtyard[index]) play('bell');
  };

  const lightLantern = (index) => {
    setLanterns((list) => list.map((value, i) => (i === index ? true : value)));
    setActiveLantern(index);
    play('bell');
  };

  const paintPetal = (index) => {
    const color = INKS[brush].color;
    setPetals((list) => list.map((value, i) => (i === index ? color : value)));
    play('pop');
  };

  const pinStar = (event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setStars((list) => [...list.slice(-17), { id: `${Date.now()}-${Math.random()}`, x, y }]);
    play('pop');
  };

  const releaseWish = (event) => {
    event.preventDefault();
    const text = wish.trim();
    if (!text) {
      showToast('The lantern will not leave empty-handed.');
      return;
    }
    setWishes((list) => [
      ...list.slice(-5),
      { id: `${Date.now()}`, text, x: 12 + Math.random() * 64 },
    ]);
    setWish('');
    launchFireworks();
    play('whoosh');
  };

  const addSpark = (event) => {
    if (event.target.closest('input, textarea')) return;
    const id = `${Date.now()}-${Math.random()}`;
    setSparks((list) => [...list.slice(-18), { id, x: event.clientX, y: event.clientY }]);
    window.setTimeout(() => {
      setSparks((list) => list.filter((item) => item.id !== id));
    }, 680);
  };

  const restart = () => {
    setLit(false);
    setCourtyard([false, false, false, false, false]);
    setLanterns([false, false, false]);
    setActiveLantern(null);
    setPetals(Array(8).fill(null));
    setBrush(0);
    setCenterOpen(false);
    setOpened(false);
    setGloss(null);
    setWish('');
    setWishes([]);
    setStars([]);
    setFound([]);
    setToast(null);
    setJournalOpen(false);
    setFireworks(0);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const painted = petals.filter(Boolean).length;
  const lampsLit = courtyard.filter(Boolean).length;
  const storyDone = {
    home: lanterns.every(Boolean),
    lamps: lit && courtyard.every(Boolean),
    rangoli: painted === 8,
    letter: opened,
    sky: stars.length > 0 || wishes.length > 0,
  };
  const appear = reduceMotion ? false : { opacity: 0, y: 28 };

  const centerNote = painted === 8
    ? 'The last petal was the bravest. A letter with your initial is waiting under the seal.'
    : `Still ${8 - painted} petal${painted === 7 ? '' : 's'} untouched. A rangoli hates to be half a circle.`;

  return (
    <main className="site-shell" onPointerDown={addSpark}>
      <div className="wash wash-a" />
      <div className="wash wash-b" />
      <div className="wash wash-c" />

      <header className="site-header">
        <div className="topbar">
          <a className="brand" href="#home">
            <MiniDiya lit />
            <span>Swathi’s Diwali</span>
          </a>
          <div className="top-actions">
            <aside className={`journal ${journalOpen ? 'is-open' : ''}`}>
              {journalOpen && (
                <div className="journal-panel">
                  <p>Five little things are hiding in the pictures. The wiggly ones are the suspects.</p>
                  <ul>
                    {Object.entries(CRUMBS).map(([id, crumb]) => (
                      <li key={id} className={found.includes(id) ? 'got' : ''}>
                        <b>{found.includes(id) ? crumb.title : 'Still tucked away'}</b>
                        {found.includes(id) && <span>{crumb.note}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type="button" className="journal-toggle" onClick={() => setJournalOpen((open) => !open)} aria-expanded={journalOpen} aria-label={`Curiosities found, ${found.length} of 5`}>
                <span>curiosities</span>
                <strong>{found.length}/5</strong>
              </button>
            </aside>
            <button type="button" className="sound-toggle" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'}>
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{sound ? 'Sound on' : 'Sound off'}</span>
            </button>
          </div>
        </div>
        <nav className="chapters" aria-label="Story chapters">
          {CHAPTERS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={chapter === id ? 'is-here' : ''} aria-current={chapter === id ? 'location' : undefined}>
              {storyDone[id] && <i className="done-dot" aria-hidden="true" />}
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <motion.p className="kicker" initial={appear} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Plate 01 · an illustrated night
          </motion.p>
          <motion.h1 initial={appear} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }}>
            A thousand lights,<br /><em>one special</em> you.
          </motion.h1>
          <motion.p className="lede" initial={appear} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.7 }}>
            This picture-book night was drawn for your Diwali, Swathi. The lanterns are keeping secrets, the rangoli has no painter yet, and a letter is asleep under a seal with your initial.
          </motion.p>
          <motion.button
            type="button"
            className="stamp-btn"
            initial={appear}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            onClick={() => document.getElementById('lamps')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })}
          >
            Step into the night
          </motion.button>
          <p className="hero-footnote"><span>✧</span> Drawn with warmth, wishes, and a little mischief</p>
        </div>

        <div className="print-card hero-frame">
          <StorySky
            lanterns={lanterns}
            activeLantern={activeLantern}
            onLantern={lightLantern}
            onMoon={() => find('moon')}
            moonFound={found.includes('moon')}
            reduceMotion={reduceMotion}
          />
          <p className="frame-caption">
            plate i — the night you can touch · {lanterns.filter(Boolean).length}/3 lanterns glowing
          </p>
        </div>
        <a className="scroll-cue" href="#lamps"><ArrowDown size={15} /> there is more hiding below</a>
      </section>

      <Divider />

      <motion.section
        className="section-wrap"
        id="lamps"
        initial={appear}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-copy">
          <p className="kicker">02 · lamps that answer</p>
          <h2>Every celebration begins with <em>one diya.</em></h2>
          <p>Turn the clay lamp. Light it. Then wake the five shy neighbors — each one is keeping a word until you ask.</p>
        </div>
        <div className="print-card diya-card">
          <div className="diya-layout">
            <div
              className={`three-diya ${lit ? 'is-lit' : ''}`}
              onClick={toggleDiya}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleDiya();
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={lit}
              aria-label={lit ? 'Diya is lit. Activate to rest the flame' : 'Diya is dark. Activate to light it'}
            >
              <Suspense fallback={<div className="scene-fallback">a lamp is warming up</div>}>
                <DiyaScene lit={lit} />
              </Suspense>
              <span className="drag-hint">drag to turn · tap to {lit ? 'rest' : 'light'}</span>
            </div>
            <div className="diya-copy">
              <p className="mini-label">{lit ? 'The light is yours' : 'Your first little moment'}</p>
              <h3>{lit ? 'You make the paper glow.' : 'Light up your Diwali'}</h3>
              <p>
                {lit
                  ? 'May your days be full of warmth, hope, and beautiful beginnings.'
                  : 'A tiny tap. A warm flame. A wish drawn just for you, Swathi.'}
              </p>
              <button type="button" className="ghost-btn" onClick={toggleDiya}>
                {lit ? 'Rest the flame' : 'Light the diya'}
              </button>
            </div>
          </div>
          <div className="courtyard-block">
            <p className="handwritten courtyard-lead">
              Five shy lamps. Light them in any order. {lampsLit}/5 are speaking.
            </p>
            <div className="courtyard">
              {BLESSINGS.map((word, index) => (
                <button
                  key={word}
                  type="button"
                  className={`lamp ${courtyard[index] ? 'is-lit' : ''}`}
                  onClick={() => toggleLamp(index)}
                  aria-pressed={courtyard[index]}
                >
                  <MiniDiya lit={courtyard[index]} />
                  <span>{courtyard[index] ? word : 'unlit'}</span>
                </button>
              ))}
            </div>
            {lampsLit === 5 && (
              <p className="handwritten reveal">
                Five flames, and the courtyard is awake. The rangoli on the next page has been waiting for a painter.
              </p>
            )}
            <div className="caption-row">
              <p className="frame-caption">plate ii — a lamp you can turn</p>
              <Curiosity id="ink" found={found.includes('ink')} onFind={find} className="curiosity-ink">
                <InkBottle />
              </Curiosity>
            </div>
          </div>
        </div>
      </motion.section>

      <Divider />

      <motion.section
        className="section-wrap rangoli-section"
        id="rangoli"
        initial={appear}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className="print-card rangoli-card">
          <p className="handwritten">Pick a brush, then tap a petal.</p>
          <div className="palette" role="radiogroup" aria-label="Rangoli brushes">
            {INKS.map((ink, index) => (
              <button
                key={ink.name}
                type="button"
                role="radio"
                aria-checked={brush === index}
                className={`swatch ${brush === index ? 'is-picked' : ''}`}
                style={{ background: ink.color }}
                onClick={() => setBrush(index)}
              >
                <span className="sr-only">{ink.name}</span>
              </button>
            ))}
          </div>
          <p className="brush-name">Brush in hand: {INKS[brush].name}</p>
          <div className="rangoli-stage">
            <div className={`rangoli ${painted === 8 ? 'is-complete' : ''}`}>
              <span className="rangoli-ring" />
              <span className="rangoli-ring ring-two" />
              {PETAL_ANGLES.map((angle, index) => (
                <button
                  key={angle}
                  type="button"
                  className={`petal ${petals[index] ? 'is-painted' : ''}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-96px)`,
                    background: petals[index] || 'transparent',
                  }}
                  onClick={() => paintPetal(index)}
                  aria-label={`Petal ${index + 1}, ${petals[index] ? 'painted' : 'still empty'}. Paint with ${INKS[brush].name}`}
                />
              ))}
              <button
                type="button"
                className="rangoli-center"
                onClick={() => {
                  setCenterOpen((open) => !open);
                  play('sparkle');
                }}
                aria-expanded={centerOpen}
              >
                {painted === 8 ? '✺' : '✿'}
              </button>
            </div>
            <Curiosity id="petal" found={found.includes('petal')} onFind={find} className="curiosity-petal">
              <LoosePetal />
            </Curiosity>
          </div>
          {centerOpen && <p className="handwritten reveal">{centerNote}</p>}
          <div className="caption-row">
            <p className="frame-caption">plate iii — {painted}/8 petals have a color</p>
            {painted > 0 && (
              <button type="button" className="quiet-btn" onClick={() => setPetals(Array(8).fill(null))}>
                Wash it clean
              </button>
            )}
          </div>
        </div>
        <div className="section-copy">
          <p className="kicker">03 · colors you can touch</p>
          <h2>The rangoli is <em>unfinished</em> on purpose.</h2>
          <p>Like every petal in a rangoli, may every little part of your life find its place. This one will not finish itself. That is the point.</p>
          {painted === 8 && (
            <p className="handwritten light">You painted the whole circle. The seal on the next page already knows your initial.</p>
          )}
        </div>
      </motion.section>

      <Divider />

      <motion.section
        className="section-wrap"
        id="letter"
        initial={appear}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-copy centered">
          <p className="kicker">04 · a seal with your initial</p>
          <h2>Something <em>from the heart.</em></h2>
          <p>Some wishes deserve to be opened slowly. The rosy words inside are not done talking.</p>
          <Curiosity id="star" found={found.includes('star')} onFind={find} className="curiosity-star">
            ✦
          </Curiosity>
        </div>
        <div className="print-card letter-card">
          <div className={`envelope ${opened ? 'opened' : ''}`} onClick={() => setOpened((value) => !value)}>
            <div className="envelope-back" />
            <div className="letter" onClick={(event) => event.stopPropagation()}>
              <div className="letter-symbol">✺</div>
              <span>Dear Swathi,</span>
              <p>
                May your home glow with{' '}
                {opened ? (
                  <button type="button" className={`gloss ${gloss === 'happiness' ? 'is-open' : ''}`} onClick={() => setGloss((value) => (value === 'happiness' ? null : 'happiness'))}>happiness</button>
                ) : 'happiness'}
                , your{' '}
                {opened ? (
                  <button type="button" className={`gloss ${gloss === 'heart' ? 'is-open' : ''}`} onClick={() => setGloss((value) => (value === 'heart' ? null : 'heart'))}>heart</button>
                ) : 'heart'}
                {' '}feel light, and your{' '}
                {opened ? (
                  <button type="button" className={`gloss ${gloss === 'year' ? 'is-open' : ''}`} onClick={() => setGloss((value) => (value === 'year' ? null : 'year'))}>year</button>
                ) : 'year'}
                {' '}be filled with moments worth remembering.
              </p>
              {gloss && <em className="gloss-note">{GLOSS[gloss]}</em>}
              <strong>Wishing you the loveliest Diwali.</strong>
              <small>With warm wishes</small>
            </div>
            <div className="envelope-front" />
            <div className="envelope-flap" />
            {!opened && <div className="seal" aria-hidden="true">S</div>}
          </div>
          <button type="button" className="stamp-btn letter-btn" onClick={() => setOpened((value) => !value)}>
            {opened ? 'Close the letter' : 'Open your little letter'} <Heart size={16} />
          </button>
          {opened && !gloss && <p className="handwritten reveal">Tap the rosy words. They kept a footnote for you.</p>}
          <p className="frame-caption">plate iv — wax, paper, and a secret in the ink</p>
        </div>
      </motion.section>

      <Divider />

      <motion.section
        className="section-wrap"
        id="sky"
        initial={appear}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-copy centered">
          <p className="kicker">05 · the listening sky</p>
          <h2>May your life be as <em>bright as Diwali.</em></h2>
          <p>Keep smiling, keep shining, and keep being wonderfully you, Swathi. This sky is blank on purpose. Pin a star, then hand a lantern a wish.</p>
        </div>
        <div className="print-card sky-card">
          <div className="sky-stage" onClick={pinStar}>
            <p className="sky-hint">
              {stars.length === 0
                ? 'Tap the dark to pin a star.'
                : `${stars.length} star${stars.length === 1 ? '' : 's'} pinned by you.`}
            </p>
            {stars.map((star) => (
              <span key={star.id} className="pinned-star" style={{ left: `${star.x}%`, top: `${star.y}%` }}>✦</span>
            ))}
            <AnimatePresence>
              {wishes.map((item) => (
                <motion.div
                  key={item.id}
                  className="sky-lantern"
                  style={{ left: `${item.x}%` }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1, y: 0 } : { y: -250, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: reduceMotion ? 0.3 : 7, ease: 'easeOut' }}
                  onAnimationComplete={() => setWishes((list) => list.filter((entry) => entry.id !== item.id))}
                >
                  <LanternSvg lit />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            <Curiosity id="firefly" found={found.includes('firefly')} onFind={find} className="curiosity-firefly">
              <span className="firefly-dot" />
            </Curiosity>
          </div>
          <form className="wish-form" onSubmit={releaseWish}>
            <label className="sr-only" htmlFor="wish">A wish for the sky</label>
            <input
              id="wish"
              maxLength={90}
              value={wish}
              placeholder="Write something only a lantern should carry…"
              onChange={(event) => setWish(event.target.value)}
            />
            <button type="submit" className="stamp-btn" disabled={!wish.trim()}>
              Release a lantern
            </button>
          </form>
          <p className="char-count">{wish.length}/90 · the sky reads slowly</p>
          <p className="frame-caption">plate v — stars you placed, wishes you wrote</p>
          <button type="button" className="quiet-btn restart-btn" onClick={restart}>
            <RotateCcw size={14} /> Read the night again
          </button>
        </div>
      </motion.section>

      <footer>
        <span>✺</span> THIS IS FOR YOU SCAMMER <span>✺</span>
        <small>Happy Diwali · an illustrated night</small>
      </footer>

      <div className="toast-slot" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              className="toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sparks.map((spark) => (
        <span key={spark.id} className="spark" style={{ left: spark.x, top: spark.y }}>✦</span>
      ))}

      <AnimatePresence>
        {fireworks > 0 && <FireworkShow key={fireworks} burstId={fireworks} />}
      </AnimatePresence>
    </main>
  );
}

export default App;
