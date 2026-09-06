import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import "./ui-overrides.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const IMG = {
  harappa: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Harappa_Ruins_-_IV.jpg",
  madhubani: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Madhubani_painting.jpg",
  baul: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baul_singer.jpg",
  kalamkari: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalamkari_painting.jpg",
  theyyam: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Theyyam.jpg",
  pattachitra: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pattachitra_painting.jpg"
};

const heritage = [
  {
    id: "madhubani",
    title: "Madhubani Painting",
    type: "Visual Art",
    place: "Bihar",
    period: "Living tradition",
    interest: "art",
    image: IMG.madhubani,
    icon: "◈",
    desc: "A vibrant Mithila painting tradition carried through homes, rituals and generations of artists.",
    facts: ["Mithila motifs", "Natural pigments", "Women-led transmission", "Ritual & everyday art"]
  },
  {
    id: "baul",
    title: "Baul Music",
    type: "Folk Tradition",
    place: "West Bengal",
    period: "Living oral tradition",
    interest: "music",
    image: IMG.baul,
    icon: "♪",
    desc: "Songs, philosophy and travelling performance passed from voice to voice across Bengal.",
    facts: ["Oral transmission", "Ektara & instruments", "Mystical poetry", "Travelling performers"]
  },
  {
    id: "kalamkari",
    title: "Kalamkari",
    type: "Textile Art",
    place: "Andhra Pradesh",
    period: "Living craft tradition",
    interest: "craft",
    image: IMG.kalamkari,
    icon: "✦",
    desc: "Hand-painted and block-printed textiles where dye, line and storytelling meet.",
    facts: ["Hand drawing", "Natural dyes", "Block printing", "Narrative textiles"]
  },
  {
    id: "theyyam",
    title: "Theyyam",
    type: "Ritual Art",
    place: "Kerala",
    period: "Living ritual tradition",
    interest: "performance",
    image: IMG.theyyam,
    icon: "✺",
    desc: "A powerful ritual performance combining costume, dance, percussion and community memory.",
    facts: ["Ritual performance", "Elaborate costume", "Percussion", "Community participation"]
  },
  {
    id: "pattachitra",
    title: "Pattachitra",
    type: "Visual Art",
    place: "Odisha",
    period: "Living craft tradition",
    interest: "art",
    image: IMG.pattachitra,
    icon: "❋",
    desc: "Narrative cloth painting with disciplined lines, traditional pigments and regional stories.",
    facts: ["Cloth preparation", "Traditional pigments", "Narrative painting", "Chitrakara communities"]
  },
  {
    id: "harappa",
    title: "Harappa",
    type: "Ancient Civilization",
    place: "Indus Valley",
    period: "c. 2600–1900 BCE",
    interest: "history",
    image: IMG.harappa,
    icon: "🏺",
    desc: "An ancient urban centre remembered for planned streets, drainage, craft and long-distance trade.",
    facts: ["Grid-planned streets", "Advanced drainage", "Craft workshops", "Seals & trade"]
  }
];

const riskItems = [
  ["Baul Music", "Declining number of practitioners", 68, "High"],
  ["Kani Tribal Language", "At risk of extinction", 52, "High"],
  ["Kavadi Attam", "Decreasing youth participation", 71, "Medium"],
  ["Bamboo Craft", "Lack of market support", 74, "Medium"]
];

const experienceOptions = [
  ["image", "Interactive Explorer", "Tap into artworks, artefacts and visual stories."],
  ["timeline", "Timeline", "Drag through the journey from roots to today."],
  ["process", "How It’s Made", "Explore traditional processes step by step."],
  ["connections", "Culture Connections", "Follow links between food, art, rituals, places and people."],
  ["surprise", "You Might Be Surprised", "Find small discoveries and interactive facts."],
  ["quiz", "Quiz & Challenge", "Identify, answer and learn with lightweight challenges."],
  ["audio", "Listen & Explore", "Hear music, instruments, languages and oral traditions."],
  ["beforeafter", "Before / After", "Compare heritage across time with a visual slider."],
  ["community", "Stories from the Community", "Discover memories and traditions shared by people."],
  ["passport", "Heritage Passport", "Collect stamps as you explore India."]
];

const experienceDetails = {
  image: [
    "Interactive Heritage Explorer",
    "Explore an image instead of just reading about it. Future hotspots will reveal symbols, materials, people and hidden stories."
  ],
  timeline: [
    "Timeline — See the Journey",
    "Move through ancient roots, regional traditions, modern revival and the present day."
  ],
  process: [
    "How It’s Made",
    "A reusable step-by-step experience for crafts, food, architecture, music and traditional practices."
  ],
  connections: [
    "Culture Connections",
    "Discover how one tradition connects to other foods, arts, rituals, regions and communities."
  ],
  surprise: [
    "You Might Be Surprised…",
    "Tap, look closer and uncover small facts hidden inside heritage scenes and artefacts."
  ],
  quiz: [
    "Quiz & Challenge",
    "A common quiz engine can work across art, food, dance, architecture, textiles, instruments and festivals."
  ],
  audio: [
    "Listen & Explore",
    "Hear the sound of living culture and learn about instruments, language, rhythm and region."
  ],
  beforeafter: [
    "Before / After",
    "Drag between historical views and the present to understand how heritage changes over time."
  ],
  community: [
    "Stories from the Community",
    "Real memories, local knowledge, artist stories and traditions can become part of the digital archive."
  ],
  passport: [
    "Heritage Passport",
    "Collect virtual stamps for states, categories and heritage you have explored."
  ]
};

async function api(path, opts = {}) {
  const r = await fetch(API + path, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {})
    },
    ...opts
  });

  if (!r.ok) {
    throw new Error(
      (await r.json().catch(() => ({}))).error || `API ${r.status}`
    );
  }

  return r.json();
}

function daySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function dailyOrder(list, interest) {
  const filtered = interest === "all"
    ? list
    : list.filter(x => x.interest === interest);

  const source = filtered.length ? filtered : list;
  let seed = daySeed() + interest.length * 97;

  return [...source].sort(() => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280 - .5;
  });
}

function Icon({ children }) {
  return <span className="nav-icon">{children}</span>;
}

function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(heritage);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [posts, setPosts] = useState([]);
  const [online, setOnline] = useState(false);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interest, setInterest] = useState(
    () => localStorage.getItem("li-interest") || "all"
  );
  const [slide, setSlide] = useState(0);
  const [trendingSlide, setTrendingSlide] = useState(0);
  const [selectedState, setSelectedState] = useState(null);

  const notify = x => {
    setToast(x);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => {
    api("/health")
      .then(() => setOnline(true))
      .catch(() => setOnline(false));

    api("/heritage")
      .then(d => {
        if (Array.isArray(d) && d.length) {
          setItems(
            d.map(x => ({
              ...heritage.find(h => h.id === x.id),
              ...x,
              image: x.image || heritage.find(h => h.id === x.id)?.image
            }))
          );
        }
      })
      .catch(() => { });

    api("/posts")
      .then(setPosts)
      .catch(() => { });
  }, []);

  useEffect(() => {
    localStorage.setItem("li-interest", interest);
    setSlide(0);
  }, [interest]);

  const stories = useMemo(
    () => dailyOrder(items, interest),
    [items, interest]
  );

  useEffect(() => {
    if (stories.length < 2) return;

    const t = setInterval(
      () => setSlide(s => (s + 1) % stories.length),
      5000
    );

    return () => clearInterval(t);
  }, [stories]);

  const search = async value => {
    setQuery(value);

    if (!value) {
      setItems(heritage);
      return;
    }

    try {
      setItems(
        await api("/heritage?q=" + encodeURIComponent(value))
      );
    } catch {
      setItems(
        heritage.filter(x =>
          (x.title + x.type + x.place + x.desc)
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
    }
  };

  const open = h => {
    setSelected(h);
    setSidebarOpen(false);
  };

  const nav = p => {
    setPage(p);
    setSidebarOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const showExperience = id => {
    setModal({
      type: "experience",
      id
    });
    setSidebarOpen(false);
  };

  return (
    <div className={sidebarOpen ? "app sidebar-is-open" : "app"}>

      <div
        className="scrim"
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className="sidebar">

        <button
          className="brand"
          onClick={() => nav("home")}
        >
          <span className="brand-symbol">✺</span>
          <span className="brand-name">
            LIVING <b>INDIA</b>
          </span>
          <small>
            PEOPLE · CULTURE · STORIES · FOREVER
          </small>
        </button>

        <div className="side-links">

          <button
            className={page === "home" ? "active" : ""}
            onClick={() => nav("home")}
          >
            <Icon>⌂</Icon>Home
          </button>

          <button
            className={page === "explore" ? "active" : ""}
            onClick={() => nav("explore")}
          >
            <Icon>⌕</Icon>Explore
          </button>

          <button
            className={page === "map" ? "active" : ""}
            onClick={() => nav("map")}
          >
            <Icon>◈</Icon>Map
          </button>

          <button
            className={page === "community" ? "active" : ""}
            onClick={() => nav("community")}
          >
            <Icon>♧</Icon>Community
          </button>

          <button
            onClick={() => setModal("contribute")}
          >
            <Icon>✎</Icon>Contribute
          </button>

          <button
            className={page === "risk" ? "active" : ""}
            onClick={() => nav("risk")}
          >
            <Icon>△</Icon>At Risk
          </button>

          <button
            onClick={() => open(
              heritage.find(x => x.id === "harappa")
            )}
          >
            <Icon>♜</Icon>Harappa
          </button>

        </div>

        <div className="side-bottom">

          <button>
            <Icon>ⓘ</Icon>About
          </button>

          {/* FIXED LOGIN */}
          <a
            href="./login.html"
            className="li-login-link"
          >
            <Icon>♙</Icon>Login
          </a>

        </div>

        <div className="sidebar-note">
          <span>✦</span>
          <div>
            OUR HERITAGE<br />
            <b>LIVES THROUGH YOU</b>
          </div>
        </div>

      </aside>

      <main className="content">

        <header className="topbar">

          <button
            className="burger"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(v => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="mobile-brand">
            LIVING <b>INDIA</b>
          </div>

          <div className="search">
            <span>⌕</span>

            <input
              value={query}
              onChange={e => search(e.target.value)}
              placeholder="Search a heritage, art form, place, or story..."
            />

            <kbd>⌘ K</kbd>
          </div>

          <div className="top-actions">

            <span className={online ? "live" : "demo"}>
              ● {online ? "LIVE" : "DEMO"}
            </span>

            <button>♧</button>

            {/* FIXED AVATAR LOGIN */}
            <a
              className="avatar"
              href="./login.html"
              aria-label="Login"
            >
              ✦
            </a>

          </div>

        </header>

        {page === "home" && (
          <>

            <section className="hero">

              <div className="hero-art">

                <div className="sun"></div>
                <div className="mountains"></div>

                <div className="temple temple-left">
                  ♜
                </div>

                <div className="temple temple-right">
                  ♜
                </div>

                <div className="hero-map">
                  <div className="map-shape">
                    INDIA
                  </div>

                  <span className="pin p1">✦</span>
                  <span className="pin p2">✦</span>
                  <span className="pin p3">✦</span>
                  <span className="pin p4">✦</span>
                </div>

                <div className="map-lines"></div>

                <div className="quote-top">
                  “Sanskriti na kabhi purani hoti hai,<br />
                  na kabhi nai — woh hamesha jeevit rehti hai.”
                  <small>— Anonymous</small>
                </div>

                <div className="compass">
                  N<br />
                  <span>✧</span><br />
                  S
                </div>

              </div>

              <div className="hero-copy">

                <div className="eyebrow">
                  INDIA'S LIVING HERITAGE
                </div>

                <h1>
                  Discover<br />
                  <i>Living Heritage</i>
                </h1>

                <h2>
                  Stories. People. Places. A Living India.
                </h2>

                <p>
                  Explore the traditions, art forms, languages and living cultures that make India eternal.
                </p>

                <div className="hero-buttons">

                  <button
                    className="primary"
                    onClick={() => nav("explore")}
                  >
                    Start Exploring <b>→</b>
                  </button>

                  <button
                    className="outline"
                    onClick={() => setModal("contribute")}
                  >
                    Share a Story <b>＋</b>
                  </button>

                </div>

              </div>

              <div className="hero-side">
                <span>EK</span>
                <b>BHARAT</b>
                <span>ANEK</span>
                <b>KAHAANIYAN</b>

                <div className="side-arrow">
                  →
                </div>

                <small>
                  Different Stories<br />
                  Same Soul
                </small>
              </div>

            </section>

            <TrendingHeritage
              stories={heritage}
              slide={trendingSlide}
              onSlideChange={setTrendingSlide}
              onExplore={open}
            />

            <section className="featured section">

              <div className="section-head">

                <div>
                  <h2>✺ Top Stories</h2>
                  <p>
                    Freshly arranged for you · changes daily
                  </p>
                </div>

                <button onClick={() => nav("explore")}>
                  View All →
                </button>

              </div>

              <div className="interest-tabs">

                {[
                  ["all", "For You"],
                  ["art", "Art & Craft"],
                  ["music", "Music"],
                  ["performance", "Performance"],
                  ["history", "History"]
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={interest === id ? "selected" : ""}
                    onClick={() => setInterest(id)}
                  >
                    {label}
                  </button>
                ))}

              </div>

              <div className="carousel-window">

                <div
                  className="cards carousel-track"
                  style={{
                    transform: `translateX(-${slide * 198}px)`
                  }}
                >
                  {stories.map(h => (
                    <HeritageCard
                      key={h.id}
                      h={h}
                      onClick={open}
                    />
                  ))}
                </div>

              </div>

              <div className="carousel-controls">

                <div>
                  {stories.map((h, i) => (
                    <button
                      key={h.id}
                      className={
                        i === slide
                          ? "dot active"
                          : "dot"
                      }
                      onClick={() => setSlide(i)}
                      aria-label={`Story ${i + 1}`}
                    ></button>
                  ))}
                </div>

                <span>
                  Auto-playing · today’s selection
                </span>

              </div>

            </section>

            <section className="experiences section">

              <div className="section-head">

                <div>
                  <h2>
                    ✦ Explore Heritage, Your Way
                  </h2>
                  <p>
                    Go beyond reading — listen, discover, compare and play.
                  </p>
                </div>

                <button
                  onClick={() => showExperience("passport")}
                >
                  Open Passport →
                </button>

              </div>

              <div className="experience-grid">

                {experienceOptions.map(
                  ([id, label, desc]) => (
                    <button
                      className="experience-card"
                      key={id}
                      onClick={() => showExperience(id)}
                    >
                      <span className="experience-icon">
                        {({
                          image: "▧",
                          timeline: "◷",
                          process: "✦",
                          connections: "⌘",
                          surprise: "!",
                          quiz: "?",
                          audio: "♪",
                          beforeafter: "↔",
                          community: "♧",
                          passport: "◇"
                        })[id]}
                      </span>

                      <div>
                        <b>{label}</b>
                        <small>{desc}</small>
                      </div>

                      <i>→</i>
                    </button>
                  )
                )}

              </div>

            </section>

            <section className="map-feature section">

              <div className="section-head">

                <div>
                  <h2>✦ Explore India by State</h2>
                  <p>
                    Every region carries a different story. Follow the glowing trail.
                  </p>
                </div>

                <button onClick={() => nav("map")}>
                  Open Full Map →
                </button>

              </div>

              <CulturalMap
                items={items}
                onOpen={open}
                onStateSelect={setSelectedState}
              />

            </section>

            <section className="split section">

              <RiskPanel
                onClick={() => nav("risk")}
              />

              <Community
                posts={posts}
                onClick={() => nav("community")}
              />

            </section>

            <footer>
              <span>❋ Preserve</span>
              <span>✦ Participate</span>
              <span>✺ Pass It On</span>
              <b>INDIA LIVES IN ITS PEOPLE ✦</b>
            </footer>

          </>
        )}

        {page === "explore" && (
          <Explore
            items={items}
            onOpen={open}
          />
        )}

        {page === "risk" && (
          <RiskPage onOpenMap={() => nav("map")} />
        )}

        {page === "community" && (
          <div className="page-wrap">

            <div className="page-title">

              <div className="eyebrow">
                FROM THE COMMUNITY
              </div>

              <h1>
                Stories from <i>the people</i>
              </h1>

              <p>
                Living heritage is not just history. It is what people still do, teach and remember.
              </p>

            </div>

            <Community
              posts={posts}
              large
              onClick={() => { }}
            />

          </div>
        )}

        {page === "map" && (
          <div className="page-wrap map-page">

            <div className="page-title">

              <div className="eyebrow">
                A CULTURAL MAP
              </div>

              <h1>
                One India, <i>many worlds</i>
              </h1>

              <p>
                Zoom, explore and select any state to choose the heritage you want to contribute.
              </p>

            </div>

            <CulturalMap
              items={items}
              onOpen={open}
              onStateSelect={setSelectedState}
              full
            />

          </div>
        )}

      </main>

      {selectedState && (
        <HeritageCategoryModal
          state={selectedState}
          onClose={() => setSelectedState(null)}
        />
      )}
      {selected && (
        <Detail
          h={selected}
          close={() => setSelected(null)}
          onContribute={() => setModal("contribute")}
        />
      )}

      {modal && (
        <Modal
          type={modal}
          close={() => setModal(null)}
          notify={notify}
        />
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

    </div>
  );
}

function TrendingHeritage({ stories, slide, onSlideChange, onExplore }) {
  const total = stories.length;
  const current = stories[slide % total] || stories[0];
  const next = stories[(slide + 1) % total] || stories[0];

  useEffect(() => {
    if (total < 2) return;

    const timer = setInterval(() => {
      onSlideChange(value => (value + 1) % total);
    }, 5000);

    return () => clearInterval(timer);
  }, [total, onSlideChange]);

  const previous = () =>
    onSlideChange(value => (value - 1 + total) % total);

  const following = () =>
    onSlideChange(value => (value + 1) % total);

  return (
    <section className="trending section" aria-label="Trending Across India">
      <div className="trending-shell">
        <div className="trending-head">
          <div>
            <div className="trending-kicker">✦ INDIA · CULTURE · HERITAGE</div>
            <h2>🔥 Trending Across India</h2>
            <p>Explore what’s capturing hearts — iconic heritage, living traditions and stories from across the country.</p>
          </div>

          <div className="trending-nav">
            <button type="button" onClick={previous} aria-label="Previous trending story">←</button>
            <button type="button" onClick={following} aria-label="Next trending story">→</button>
            <span>{String((slide % total) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="trending-stage">
          <button
            type="button"
            className="trending-main"
            onClick={() => onExplore(current)}
            aria-label={`Explore ${current.title}`}
          >
            <div className="trending-image">
              <img src={current.image} alt="" />
              <span className="trending-image-tag">TRENDING NOW</span>
            </div>

            <div className="trending-copy">
              <span>{current.type} · {current.place}</span>
              <h3>{current.title}</h3>
              <p>{current.desc}</p>
              <strong>Explore Now <b>→</b></strong>
            </div>
          </button>

          <button
            type="button"
            className="trending-next"
            onClick={following}
            aria-label={`Next story: ${next.title}`}
          >
            <div className="trending-next-image">
              <img src={next.image} alt="" />
              <span>UP NEXT</span>
            </div>
            <div className="trending-next-copy">
              <small>{next.place} · {next.type}</small>
              <b>{next.title}</b>
              <i>→</i>
            </div>
          </button>
        </div>

        <div className="trending-bottom">
          <div className="trending-dots" aria-label="Trending story selector">
            {stories.map((story, index) => (
              <button
                key={story.id}
                type="button"
                className={index === slide ? "active" : ""}
                onClick={() => onSlideChange(index)}
                aria-label={`Show ${story.title}`}
              />
            ))}
          </div>
          <span>Auto-playing · tap a story to explore</span>
        </div>
      </div>
    </section>
  );
}

function HeritageCard({ h, onClick }) {
  return (
    <button
      className="heritage-card"
      onClick={() => onClick(h)}
    >
      <div className="card-img">

        <img
          src={h.image}
          alt=""
        />

        <span className="card-icon">
          {h.icon || "✦"}
        </span>

      </div>

      <div className="card-info">

        <h3>{h.title}</h3>

        <p>{h.place}</p>

        <small>{h.type}</small>

        <span className="card-arrow">
          →
        </span>

      </div>

    </button>
  );
}

function RiskPage({ onOpenMap }) {
  const [featured, setFeatured] = useState(0);
  const featuredItems = riskItems;
  const current = featuredItems[featured % featuredItems.length];
  const [name, desc, val, level] = current;

  const riskImages = {
    "Baul Music": IMG.baul,
    "Kani Tribal Language": IMG.madhubani,
    "Kavadi Attam": IMG.theyyam,
    "Bamboo Craft": IMG.kalamkari
  };

  const next = () => setFeatured(i => (i + 1) % featuredItems.length);
  const prev = () => setFeatured(i => (i - 1 + featuredItems.length) % featuredItems.length);

  return (
    <div className="risk-page">
      <section className="risk-hero">
        <div className="risk-hero-copy">
          <div className="eyebrow">PRESERVATION · LIVING HERITAGE</div>
          <h1>Heritage at <i>Risk</i></h1>
          <p className="risk-lead">
            Some traditions don’t disappear overnight. They fade when fewer people carry them.
          </p>
          <div className="risk-actions">
            <button className="risk-primary" onClick={() => document.getElementById("risk-stories")?.scrollIntoView({ behavior: "smooth" })}>
              Discover the stories →
            </button>
            <button className="risk-secondary" onClick={onOpenMap}>Explore India’s map ↗</button>
          </div>
          <div className="risk-stats">
            <div><strong>{riskItems.length}</strong><span>stories currently tracked</span></div>
            <div><strong>{riskItems.filter(x => x[3] === "High").length}</strong><span>high-risk traditions</span></div>
            <div><strong>{riskItems.filter(x => x[3] === "Medium").length}</strong><span>medium-risk traditions</span></div>
          </div>
        </div>
        <div className="risk-hero-art">
          <img src={IMG.baul} alt="Baul music heritage" />
          <div className="risk-hero-quote">“When a tradition is practised, it is alive.”<small>— Living India</small></div>
          <div className="risk-hero-stamp">KEEP<br /><b>IT ALIVE</b></div>
        </div>
      </section>

      <section className="risk-feature-grid">
        <div className="risk-pulse-card">
          <div className="risk-section-label">EXPLORE THE LANDSCAPE</div>
          <h2>India’s Heritage <em>Pulse</em></h2>
          <p>Move through the map and discover the places where living heritage is being documented.</p>
          <div className="risk-legend">
            <span><i className="high"></i> High risk</span>
            <span><i className="medium"></i> Medium risk</span>
            <span><i className="watch"></i> Being watched</span>
          </div>
          <button onClick={onOpenMap}>Explore full map →</button>
        </div>
        <div className="risk-map-shell">
          <CulturalMap riskPulse />
        </div>
        <article className="risk-feature-card">
          <div className="risk-feature-top">
            <span className={"badge " + level.toLowerCase()}>{level} Risk</span>
            <div className="risk-feature-nav">
              <button onClick={prev} aria-label="Previous story">‹</button>
              <button onClick={next} aria-label="Next story">›</button>
            </div>
          </div>
          <img src={riskImages[name] || IMG.baul} alt={name} />
          <div className="risk-feature-body">
            <small>FEATURED · LIVING TRADITION</small>
            <h2>{name}</h2>
            <p>{desc}. This story deserves attention while the knowledge is still being carried forward.</p>
            <div className="risk-score"><span><i style={{ width: val + "%" }}></i></span><b>{val}/100</b></div>
            <button onClick={() => document.getElementById("risk-stories")?.scrollIntoView({ behavior: "smooth" })}>Explore this story →</button>
          </div>
        </article>
      </section>

      <section className="risk-stories" id="risk-stories">
        <div className="risk-stories-head">
          <div>
            <div className="risk-section-label">STORIES THAT NEED A FUTURE</div>
            <h2>What could fade <em>next?</em></h2>
            <p>Explore the traditions in our current preservation watchlist.</p>
          </div>
          <span className="risk-count">01 — 0{riskItems.length}</span>
        </div>
        <div className="risk-story-grid">
          {riskItems.map(([itemName, itemDesc, itemVal, itemLevel], index) => (
            <button className="risk-story-card" key={itemName} onClick={() => setFeatured(index)}>
              <div className="risk-story-image">
                <img src={riskImages[itemName] || IMG.baul} alt={itemName} />
                <span className={"badge " + itemLevel.toLowerCase()}>{itemLevel} Risk</span>
              </div>
              <div className="risk-story-body">
                <small>{itemLevel === "High" ? "URGENT ATTENTION" : "NEEDS SUPPORT"}</small>
                <h3>{itemName}</h3>
                <p>{itemDesc}.</p>
                <div className="risk-score"><span><i style={{ width: itemVal + "%" }}></i></span><b>{itemVal}/100</b></div>
                <em>View story →</em>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="risk-cta">
        <div>
          <span>✦</span>
          <h2>Be a part of the change.</h2>
          <p>Learn. Share. Support. Help keep living heritage alive.</p>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Learn · Share · Support →</button>
      </section>
    </div>
  );
}

function RiskPanel({ onClick, large }) {
  return (
    <div
      className={
        large
          ? "panel risk-panel large"
          : "panel risk-panel"
      }
    >

      <div className="panel-head">

        <h2>⚠ Heritage at Risk</h2>

        {onClick && (
          <button onClick={onClick}>
            View All →
          </button>
        )}

      </div>

      {riskItems.map(
        ([name, desc, val, level]) => (
          <button
            className="risk-row"
            key={name}
            onClick={onClick}
          >

            <span
              className={
                "badge " + level.toLowerCase()
              }
            >
              {level}
            </span>

            <span className="risk-name">
              <b>{name}</b>
              <small>{desc}</small>
            </span>

            <span className="bar">
              <i
                style={{
                  width: val + "%"
                }}
              ></i>
            </span>

            <em>{val}/100</em>

          </button>
        )
      )}

    </div>
  );
}

function Community({ posts, large, onClick }) {

  const data = posts.length
    ? posts
    : [
      {
        user: "Ananya S.",
        text: "My grandmother still paints Madhubani at home. Here's a short story about her work...",
        tag: "#Madhubani",
        img: IMG.madhubani,
        likes: 124
      },
      {
        user: "Rahul K.",
        text: "Visited a traditional boat making community in Kerala. The craftsmanship is incredible!",
        tag: "#LivingTraditions",
        img: IMG.harappa,
        likes: 98
      }
    ];

  return (
    <div
      className={
        large
          ? "panel community large"
          : "panel community"
      }
    >

      <div className="panel-head">

        <h2>◌ Community Voices</h2>

        <button onClick={onClick}>
          Post a Story ＋
        </button>

      </div>

      {data.slice(0, 4).map((p, i) => (
        <article
          className="post"
          key={i}
        >

          <img
            src={p.img || IMG.madhubani}
            alt=""
          />

          <div>

            <b>
              {p.user || "Heritage Explorer"}
            </b>

            <p>
              {p.text || p.story}
            </p>

            <small>
              ♥ {p.likes || 0}　♡ {p.comments || 8}　 {p.tag || "#LivingIndia"}
            </small>

          </div>

        </article>
      ))}

    </div>
  );
}

function Explore({ items, onOpen }) {

  return (
    <div className="page-wrap">

      <div className="page-title">

        <div className="eyebrow">
          EXPLORE INDIA
        </div>

        <h1>
          Stories worth <i>discovering</i>
        </h1>

        <p>
          From ancient cities to living crafts, explore the many threads of India's cultural memory.
        </p>

      </div>

      <div className="filter-row">

        <button className="selected">
          All
        </button>

        <button>
          Art & Craft
        </button>

        <button>
          Music
        </button>

        <button>
          Dance & Performance
        </button>

        <button>
          Food
        </button>

        <button>
          Archaeology
        </button>

      </div>

      <div className="explore-grid">

        {items.map(h => (
          <HeritageCard
            key={h.id}
            h={h}
            onClick={onOpen}
          />
        ))}

      </div>

    </div>
  );
}


/*
  REAL INDIA STATE MAP
  --------------------
  The map uses GeoJSON state/UT boundaries rather than manually positioned pins.
  Source: India states simplified GeoJSON (state-level boundaries).
  Keeping the URL here means no extra npm map library is required.
*/
const INDIA_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/AbhinavSwami28/india-official-geojson@main/india-states-simplified.geojson";

const MAP_VIEW = {
  minLon: 67,
  maxLon: 99,
  minLat: 5,
  maxLat: 38.5,
  width: 1000,
  height: 1100
};

const HERITAGE_CATEGORIES = [
  { id: "art", label: "Art", icon: "🎨", tone: "coral" },
  { id: "craft", label: "Craft", icon: "🏺", tone: "ochre" },
  { id: "music", label: "Music", icon: "🎵", tone: "teal" },
  { id: "dance", label: "Dance / Performance", icon: "💃", tone: "violet" },
  { id: "festival", label: "Festival", icon: "✺", tone: "saffron" },
  { id: "food", label: "Food", icon: "🍛", tone: "leaf" },
  { id: "architecture", label: "Architecture", icon: "🏛", tone: "rose" },
  { id: "language", label: "Language", icon: "अ", tone: "sky" },
  { id: "ritual", label: "Ritual / Tradition", icon: "🪔", tone: "sand" },
  { id: "history", label: "Historical Heritage", icon: "◉", tone: "indigo" }
];



// Curated heritage stories used by the state -> category -> story flow.
// Images are sourced from Wikimedia Commons and are kept as direct file URLs.
const STATE_HERITAGE_STORIES = {
  "West Bengal": {
    art: [
      {
        id: "wb-kalighat",
        title: "Kalighat painting",
        short: "Bold lines, vibrant colours and social themes from 19th-century Bengal.",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalighat%2C_Kolkata%20%28Calcutta%29%2C%20West%20Bengal%2C%20India%20-%20Kali%20-%20Google%20Art%20Project.jpg",
        place: "Kalighat, Kolkata",
        period: "19th century",
        medium: "Watercolour on paper",
        theme: "Religious, social and everyday life",
        description: "Kalighat painting developed around the Kalighat Kali Temple area of Kolkata. Its confident brush lines and simplified forms made vivid images that could be understood quickly, while artists also used the form to comment on contemporary society.",
        facts: ["Originated around Kalighat in Kolkata", "Known for strong flowing outlines", "Subjects include gods, people and social life", "A major urban folk-art tradition of Bengal"],
        gallery: [
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalighat%2C_Kolkata%20%28Calcutta%29%2C%20West%20Bengal%2C%20India%20-%20Kali%20-%20Google%20Art%20Project.jpg",
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalighat_Painting_Calcutta_19th_Century_-_Brahmin_Kneeling_in_Front_of_Two_Tigers.jpg"
        ],
        source: "Wikimedia Commons"
      },
      {
        id: "wb-patachitra",
        title: "Bengal Pattachitra",
        short: "Traditional scroll painting where stories are carried through images and song.",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pattachitra%2C%20Art%20Of%20Bengal.jpg",
        place: "Pingla, Paschim Medinipur",
        period: "Living tradition",
        medium: "Painted cloth scroll",
        theme: "Mythology, folklore and social stories",
        description: "Bengal Pattachitra is a living visual storytelling tradition associated with Patua communities. Scrolls are painted in sequence and can be accompanied by sung narration, turning the artwork into a shared performance.",
        facts: ["Strongly associated with Patua artists", "Pingla is a major living centre", "Stories can combine painting and song", "Skills are passed between generations"],
        gallery: [
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pattachitra%2C%20Art%20Of%20Bengal.jpg",
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pattachitra_of_West_Bengal.jpg"
        ],
        source: "Wikimedia Commons"
      },
      {
        id: "wb-terracotta-art",
        title: "Bishnupur terracotta art",
        short: "Baked-earth panels that turn temple walls into visual storybooks.",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Terracotta_Bishnupur.jpg",
        place: "Bishnupur, Bankura",
        period: "Malla-era heritage",
        medium: "Fired terracotta relief",
        theme: "Epic stories, devotion and everyday life",
        description: "Bishnupur is celebrated for temples whose brick surfaces carry intricate terracotta reliefs. The panels depict religious narratives alongside scenes of people, animals and life in the region.",
        facts: ["Bishnupur is a major terracotta heritage centre", "Reliefs are fired from clay", "Temple panels carry narrative scenes", "The tradition connects architecture and sculpture"],
        gallery: [
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Terracotta_Bishnupur.jpg",
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Terracotta_Panels_on_Shyam_Rai_temple_at_Bishnupur_in_Bankura_district_of_West_Bengal.jpg"
        ],
        source: "Wikimedia Commons"
      },
      {
        id: "wb-kantha",
        title: "Kantha embroidery",
        short: "Layered cloth and running stitches transformed into storytelling textiles.",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kantha_embroidery_of_bengal.jpg",
        place: "Bengal",
        period: "Living textile tradition",
        medium: "Embroidery on layered cloth",
        theme: "Memory, nature and domestic life",
        description: "Kantha uses simple running stitches to join and decorate layers of cloth. Designs can carry flowers, animals, figures and scenes, turning everyday textile work into expressive visual storytelling.",
        facts: ["Uses the running stitch as a signature technique", "Often built from layered cloth", "Motifs can depict plants, animals and people", "A long-standing household textile tradition"],
        gallery: ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Kantha_embroidery_of_bengal.jpg"],
        source: "Wikimedia Commons"
      }
    ],
    dance: [
      {
        id: "wb-chhau",
        title: "Purulia Chhau",
        short: "Masked dance combining martial movement, theatre, music and folklore.",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chhau_Dance_of_Purulia%2C_West_bengal.jpg",
        place: "Purulia",
        period: "Living performance tradition",
        medium: "Dance, mask and percussion",
        theme: "Epics, mythology and martial movement",
        description: "Purulia Chhau is a highly visual performance tradition of West Bengal. Dancers use powerful movement, elaborate masks and music to bring stories and characters to life in open-air community settings.",
        facts: ["Strongly associated with Purulia", "Masks are a defining visual element", "Movement has martial and acrobatic qualities", "Stories draw on epics and mythology"],
        gallery: [
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chhau_Dance_of_Purulia%2C_West_bengal.jpg",
          "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chhau_dance.jpg"
        ],
        source: "Wikimedia Commons"
      },
      {
        id: "wb-gombhira",
        title: "Gombhira",
        short: "A folk performance tradition from northern Bengal built around song, dance and social commentary.",
        image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Gombhira_Mask_Dance_2.jpg",
        place: "Northern West Bengal",
        period: "Living folk tradition",
        medium: "Song, dialogue, dance and masks",
        theme: "Community life and social commentary",
        description: "Gombhira combines music, dialogue, movement and performance. The tradition is especially associated with Malda and northern Bengal and is known for turning community concerns into memorable performance.",
        facts: ["Associated with northern Bengal", "Uses dialogue and song", "Can include masks and dance", "Performance can address social concerns"],
        gallery: ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Gombhira_Mask_Dance_2.jpg"],
        source: "Wikimedia Commons"
      }
    ],
    craft: [], festival: [], music: [], food: [], architecture: [], language: [], ritual: [], history: []
  },
  "Ladakh": {
    art: [
      {
        id: "ladakh-thangka",
        title: "Ladakhi Thangka painting",
        short: "Intricate Buddhist paintings used for teaching, devotion and visual meditation.",
        image: IMG.madhubani,
        place: "Ladakh monasteries",
        period: "Living Buddhist art tradition",
        medium: "Pigment on prepared cloth",
        theme: "Buddhist philosophy and sacred imagery",
        description: "Thangka painting in the Himalayan Buddhist tradition uses carefully prescribed proportions, symbols and colours. The paintings can function as devotional and teaching objects as well as works of art.",
        facts: ["Strong geometric and symbolic structure", "Used in Buddhist teaching and practice", "Requires highly skilled fine-line work", "Tradition continues through specialist artists"],
        gallery: [IMG.madhubani],
        source: "Living India research placeholder"
      }
    ],
    craft: [
      {
        id: "ladakh-wool",
        title: "Ladakhi wool craft",
        short: "Wool, weaving and handmade textiles shaped by high-altitude life.",
        image: IMG.kalamkari,
        place: "Ladakh",
        period: "Living craft tradition",
        medium: "Wool and handwork",
        theme: "Everyday life and climate",
        description: "Textile traditions in Ladakh are closely connected to the region's cold mountain environment and pastoral life. Wool is transformed into practical and decorative objects through spinning, weaving and other hand processes.",
        facts: ["Connected to high-altitude pastoral life", "Wool provides warmth and utility", "Craft knowledge is locally transmitted", "Textiles are part of everyday culture"],
        gallery: [IMG.kalamkari],
        source: "Living India research placeholder"
      }
    ],
    festival: [
      {
        id: "ladakh-hemis",
        title: "Hemis Festival",
        short: "A spectacular monastery festival known for masked dances, music and ritual pageantry.",
        image: IMG.theyyam,
        place: "Hemis Monastery",
        period: "Annual festival tradition",
        medium: "Masked dance, music and ritual",
        theme: "Buddhist celebration and community gathering",
        description: "Hemis Festival brings together ritual performance, music, costumes and community participation at Hemis Monastery. Its masked dances make the event especially vivid for visitors.",
        facts: ["Held at Hemis Monastery", "Known for masked Cham dances", "Combines ritual and public celebration", "A major cultural gathering in Ladakh"],
        gallery: [IMG.theyyam],
        source: "Living India research placeholder"
      }
    ],
    dance: [], music: [], food: [], architecture: [], language: [], ritual: [], history: []
  }
};


// State-wise key heritage highlights. These are intentionally compact: the story
// detail view can be expanded with more photographs and community submissions later.
const STATE_HIGHLIGHTS = {
  "Andhra Pradesh": { art:[["Kalamkari","Hand-painted and block-printed textile art, especially associated with Srikalahasti and Machilipatnam."]], craft:[["Kondapalli toys","Lightweight wooden toys traditionally made by artisans of Kondapalli." ]], dance:[["Kuchipudi","Classical dance-drama tradition rooted in Andhra Pradesh."]], festival:[["Ugadi","Telugu New Year celebration marked by ritual, food and seasonal renewal."]], food:[["Pulihora","Tamarind rice prepared widely for festivals and temple offerings."]], architecture:[["Lepakshi temple","Vijayanagara-era temple celebrated for sculpture and painted ceilings."]], language:[["Telugu","A major Dravidian language with a long literary and performing-arts tradition."]] },
  "Arunachal Pradesh": { craft:[["Apatani weaving","Distinctive handwoven textiles associated with the Apatani community." ]], dance:[["Ponung","A traditional group performance of the Adi community."]], festival:[["Losar","Tibetan Buddhist New Year celebrated in several Himalayan communities."]], architecture:[["Tawang Monastery","A major Himalayan Buddhist monastery and cultural landmark."]], ritual:[["Solung","Adi agricultural festival connected with community, harvest and wellbeing."]], history:[["Idu Mishmi cultural heritage","Living traditions of one of Arunachal's Indigenous communities."]] },
  "Assam": { art:[["Assamese manuscript painting","Illustrated manuscript tradition linked to Vaishnavite literary culture."]], craft:[["Muga silk","Golden-hued silk traditionally produced in Assam and valued for its durability."]], dance:[["Bihu dance","Energetic folk dance performed around the Bihu festival and central to Assamese cultural identity."]], festival:[["Rongali / Bohag Bihu","Spring festival celebrated with music, dance, food and community gatherings."]], food:[["Khar","A distinctive alkaline preparation and an important element of Assamese cuisine."]], architecture:[["Sattras of Majuli","Vaishnavite monastic-cultural institutions preserving art, music, theatre and ritual."]], language:[["Assamese","The principal language of Assam with a rich literary tradition."]], ritual:[["Sattriya tradition","Cultural practices nurtured in Vaishnavite monasteries and communities."]], history:[["Ahom heritage","Centuries of Ahom rule left monuments, manuscripts and distinctive cultural traditions."]] },
  "Bihar": { art:[["Madhubani painting","Folk painting tradition of the Mithila region using vivid motifs and narrative imagery."]], craft:[["Sujuni embroidery","Textile craft using running stitches to create patterned quilts and cloth art."]], dance:[["Bidesia","Folk theatre-performance tradition associated with Bhojpuri-speaking communities."]], festival:[["Chhath Puja","Sun-worship festival centred on ritual offerings and disciplined observance."]], food:[["Litti chokha","Iconic baked wheat-and-sattu dish served with mashed vegetables."]], architecture:[["Mahabodhi Temple","Historic Buddhist pilgrimage site at Bodh Gaya."]], language:[["Maithili","Major language of the Mithila region with a celebrated literary heritage."]], history:[["Nalanda","Ancient centre of Buddhist learning and one of South Asia's major historical sites."]] },
  "Chhattisgarh": { art:[["Godna tradition","Tattoo-inspired visual motifs preserved in regional tribal art and craft."]], craft:[["Dhokra metal craft","Lost-wax metal casting tradition practised by artisan communities."]], dance:[["Panthi","Devotional folk dance associated with the Satnami community."]], festival:[["Bastar Dussehra","Long-running community festival with distinctive rituals and local traditions."]], food:[["Fara","Steamed rice-based preparation popular in Chhattisgarh."]], ritual:[["Ghotul tradition","A historically documented community institution among some Muria communities."]] },
  "Goa": { art:[["Goan Christian art","A distinctive blend of local and European visual traditions in churches and sacred art."]], craft:[["Coconut craft","Handmade objects and decorative work using coconut materials."]], music:[["Mando","Goan lyrical song tradition blending local and Western influences."]], dance:[["Fugdi","Women's folk dance performed at community and festive occasions."]], festival:[["Carnival","Public celebration featuring processions, music and local performance culture."]], food:[["Fish curry rice","A signature Goan meal combining rice with spiced coastal fish curry."]], architecture:[["Old Goa churches","Historic churches and convents that form a major heritage landscape."]], language:[["Konkani","Goa's principal regional language with multiple literary and oral traditions."]] },
  "Gujarat": { art:[["Mata ni Pachedi","Ritual textile painting tradition depicting deities and sacred narratives."]], craft:[["Patola weaving","Highly intricate double-ikat silk weaving associated with Patan."]], dance:[["Garba","Circular community dance traditionally performed during Navratri."]], festival:[["Navratri","Nine-night celebration especially renowned for Garba and Dandiya Raas."]], food:[["Dhokla","Steamed fermented snack central to Gujarati food culture."]], architecture:[["Stepwells","Monumental water structures such as Rani ki Vav combine utility, sculpture and architecture."]], language:[["Gujarati","Indo-Aryan language with a strong literary and mercantile history."]] },
  "Haryana": { art:[["Phulkari embroidery","Floral and geometric embroidery traditions shared across the wider Punjab-Haryana cultural region."]], craft:[["Mud and pottery craft","Village pottery traditions using locally worked clay."]], dance:[["Dhamal","Traditional community dance and musical performance of Haryana."]], festival:[["Teej","Monsoon festival marked by songs, swings and community gatherings."]], food:[["Bajra roti","Millet flatbread closely associated with rural Haryana cuisine."]], language:[["Haryanvi","Regional Indo-Aryan speech varieties with strong oral performance traditions."]] },
  "Himachal Pradesh": { art:[["Kangra painting","Pahari miniature painting known for lyrical landscapes and devotional themes."]], craft:[["Kullu shawls","Woollen textiles known for colourful geometric borders and patterns."]], dance:[["Nati","Popular Himachali group dance performed at festivals and community events."]], festival:[["Kullu Dussehra","Large community festival combining procession, deities and local traditions."]], food:[["Dham","Traditional festive meal served during ceremonies and celebrations."]], architecture:[["Kath-Kuni architecture","Traditional timber-and-stone construction adapted to Himalayan conditions."]] },
  "Jharkhand": { art:[["Sohrai painting","Wall-painting tradition featuring animals, plants and geometric forms."]], craft:[["Dokra craft","Lost-wax metal casting practised by artisan communities."]], dance:[["Chhau","Masked dance tradition with strong presence in eastern India, including Jharkhand."]], festival:[["Sarhul","Spring festival celebrating nature, community and the sacred sal tree."]], food:[["Dhuska","Fried rice-and-lentil preparation popular in Jharkhand."]], ritual:[["Karam","Community festival centred on the Karam tree, song and dance."]] },
  "Karnataka": { art:[["Mysore painting","Decorative painting tradition known for fine lines, gold leaf and devotional subjects."]], craft:[["Mysore silk","Renowned silk weaving tradition associated with Mysuru."]], dance:[["Yakshagana","Colourful dance-drama combining music, elaborate costume and storytelling."]], festival:[["Mysuru Dasara","Major royal-city festival with procession, music and cultural performances."]], food:[["Bisi bele bath","Spiced rice-and-lentil dish strongly associated with Karnataka cuisine."]], architecture:[["Hampi","Vijayanagara-era monumental landscape of temples, markets and stone structures."]], language:[["Kannada","Classical Dravidian language with a long literary history."]] },
  "Kerala": { art:[["Kerala mural painting","Temple and palace murals using stylised figures and rich natural pigments."]], craft:[["Coir craft","Objects and textiles made from coconut fibre, a long-standing coastal craft."]], dance:[["Kathakali","Highly visual classical dance-drama with elaborate makeup, costume and storytelling."]], festival:[["Onam","Harvest-season celebration known for pookalam, feasts, games and boat traditions."]], food:[["Sadya","Festive vegetarian feast traditionally served on a banana leaf."]], architecture:[["Traditional nalukettu houses","Courtyard houses adapted to Kerala's climate and social life."]], language:[["Malayalam","Dravidian language with a major literary and performing-arts tradition."]] },
  "Madhya Pradesh": { art:[["Gond painting","Contemporary folk-art tradition using rhythmic lines, dots and nature-inspired imagery."]], craft:[["Chanderi weaving","Fine handwoven textiles associated with Chanderi town."]], dance:[["Rai","Popular folk dance tradition of Madhya Pradesh."]], festival:[["Bhagoria","Adivasi fair and festival associated with the Bhil and Bhilala communities."]], food:[["Poha","Flattened rice preparation widely eaten across Madhya Pradesh."]], architecture:[["Khajuraho temples","Sculptural temple complex representing Chandela-era architecture."]], language:[["Bundeli","Regional Indo-Aryan language of Bundelkhand with rich oral traditions."]] },
  "Maharashtra": { art:[["Warli painting","Minimalist tribal painting tradition using geometric human and nature forms."]], craft:[["Paithani weaving","Silk weaving tradition known for peacock motifs and rich borders."]], dance:[["Lavani","Expressive performance tradition combining rhythm, poetry and dance."]], festival:[["Ganesh Chaturthi","Major public and household festival with music, processions and community participation."]], food:[["Puran poli","Sweet stuffed flatbread associated with festivals and home cooking."]], architecture:[["Ajanta and Ellora","Major rock-cut heritage complexes with Buddhist, Hindu and Jain monuments."]], language:[["Marathi","Indo-Aryan language with a major literary and theatrical heritage."]] },
  "Manipur": { art:[["Manipuri Vaishnavite painting","Devotional visual traditions connected with the region's Vaishnavite culture."]], craft:[["Manipuri handloom","Distinctive textiles woven in traditional patterns and garments."]], dance:[["Manipuri Ras Leela","Classical dance tradition centred on devotional storytelling."]], festival:[["Yaoshang","Spring festival featuring community gatherings, sports and cultural performances."]], food:[["Eromba","Mashed vegetable dish often prepared with fermented fish and chillies."]], architecture:[["Kangla Fort","Historic political and cultural centre of the Meitei kingdom."]], language:[["Meitei / Manipuri","Principal language of the Meitei community and a major literary tradition of the state."]] },
  "Meghalaya": { art:[["Khasi weaving","Traditional textile practices producing shawls, baskets and garments."]], craft:[["Cane and bamboo craft","Highly developed household and decorative craft traditions."]], music:[["Khasi folk music","Community song traditions tied to seasonal and social life."]], dance:[["Wangala dance","Performance tradition of the Garo community, especially associated with harvest celebrations."]], festival:[["Wangala","Garo harvest festival honouring the Sun God and community life."]], food:[["Jadoh","Rice-and-meat preparation associated with Khasi food culture."]], architecture:[["Living root bridges","Community-built bridges grown from tree roots in the wet hill landscape."]] },
  "Mizoram": { craft:[["Mizo weaving","Handloom tradition producing colourful puans and ceremonial textiles."]], music:[["Mizo folk songs","Oral song traditions connected with community and customary life."]], dance:[["Cheraw","Bamboo dance performed with coordinated rhythmic movement."]], festival:[["Chapchar Kut","Spring festival celebrated with music, dance and community gatherings."]], food:[["Bai","Traditional mixed vegetable preparation central to Mizo cuisine."]], language:[["Mizo","Sino-Tibetan language with a strong oral and literary tradition."]] },
  "Nagaland": { craft:[["Naga shawls","Handwoven textiles whose patterns can carry community and social meanings."]], music:[["Naga folk songs","Community songs preserving history, identity and oral traditions."]], dance:[["Chang Lo","Traditional dance of the Chang community."]], festival:[["Hornbill Festival","State festival bringing together Naga communities, crafts, music and food."]], food:[["Smoked pork","Smoked meats are an important part of several Naga food traditions."]], ritual:[["Morung tradition","Traditional youth dormitory institution central to the social education of many Naga communities."]] },
  "Odisha": { art:[["Odisha Pattachitra","Detailed cloth painting tradition with strong links to Jagannath culture."]], craft:[["Pipili appliqué","Colourful appliqué craft traditionally used for ceremonial and decorative objects."]], dance:[["Odissi","Classical dance tradition known for sculptural poses and expressive storytelling."]], festival:[["Rath Yatra","Jagannath chariot festival in Puri drawing large community participation."]], food:[["Dalma","Lentil and vegetable preparation strongly associated with Odia cuisine."]], architecture:[["Konark Sun Temple","Monumental temple celebrated for its sculptural architecture."]], language:[["Odia","Classical Indo-Aryan language with a long literary heritage."]] },
  "Punjab": { art:[["Phulkari","Embroidery tradition known for colourful floral and geometric patterns."]], craft:[["Punjabi jutti","Handcrafted embroidered footwear with distinctive regional decoration."]], music:[["Bhangra music","Drumming and song tradition closely associated with Punjabi celebration."]], dance:[["Bhangra","Energetic folk dance with strong agricultural and festive roots."]], festival:[["Lohri","Winter festival marked by bonfires, songs and community gathering."]], food:[["Sarson da saag and makki di roti","Classic Punjabi winter meal built around mustard greens and maize bread."]], architecture:[["Golden Temple complex","Major Sikh sacred and architectural centre at Amritsar."]], language:[["Punjabi","Indo-Aryan language written in Gurmukhi in Punjab and central to Sikh literary culture."]] },
  "Rajasthan": { art:[["Phad painting","Scroll painting tradition depicting epic and devotional narratives."]], craft:[["Blue pottery","Decorative pottery tradition associated strongly with Jaipur."]], dance:[["Ghoomar","Graceful Rajasthani folk dance performed at celebrations."]], festival:[["Gangaur","Festival celebrating Gauri and marked by processions, songs and ritual."]], food:[["Dal baati churma","Iconic Rajasthani meal combining baked wheat balls, lentils and sweet crumble."]], architecture:[["Rajput forts","Fortified landscapes such as Chittorgarh and Jaisalmer express Rajasthan's architectural heritage."]], language:[["Rajasthani languages","A group of regional Indo-Aryan speech traditions with rich oral literature."]] },
  "Sikkim": { craft:[["Sikkimese carpet weaving","Traditional Tibetan-influenced handwoven carpets with geometric and symbolic motifs."]], dance:[["Cham","Masked Buddhist ritual dance performed at monasteries."]], festival:[["Losar","Tibetan Buddhist New Year celebrated by Sikkim's Himalayan communities."]], food:[["Momos","Steamed dumplings widely integrated into Sikkim's food culture."]], architecture:[["Rumtek Monastery","Important Buddhist monastery and cultural landmark."]], language:[["Nepali","One of Sikkim's major languages alongside several Indigenous Himalayan languages."]] },
  "Tamil Nadu": { art:[["Tanjore painting","Devotional painting style known for rich colours, relief work and gold foil."]], craft:[["Kanchipuram silk","Handwoven silk sarees famous for zari borders and traditional motifs."]], dance:[["Bharatanatyam","Classical dance tradition with codified movement, gesture and expression."]], festival:[["Pongal","Four-day harvest celebration centred on gratitude, food and family rituals."]], food:[["Pongal","Rice-and-lentil dish prepared in sweet and savoury forms, especially during the harvest festival."]], architecture:[["Brihadisvara Temple","Chola-era temple celebrated for monumental Dravidian architecture."]], language:[["Tamil","One of India's classical languages with a very long literary history."]] },
  "Telangana": { art:[["Cheriyal painting","Narrative scroll painting tradition depicting stories in bold folk imagery."]], craft:[["Bidri craft","Metal inlay craft strongly associated with the Deccan and practiced in Hyderabad region."]], dance:[["Perini Shivatandavam","Historic warrior dance tradition revived and performed in Telangana."]], festival:[["Bathukamma","Floral festival celebrated especially by women across Telangana."]], food:[["Hyderabadi biryani","Layered rice dish that became a defining part of Hyderabad's food culture."]], architecture:[["Charminar","Iconic Qutb Shahi monument and symbol of Hyderabad."]], language:[["Telugu","Major Dravidian language of Telangana with a rich literary tradition."]] },
  "Tripura": { craft:[["Bamboo and cane craft","Skilled basketry and household craft using local bamboo and cane."]], dance:[["Hojagiri","Acrobatic folk dance of the Reang/Bru community."]], festival:[["Garia Puja","Agricultural and community festival observed by Indigenous communities."]], food:[["Mui Borok cuisine","Traditional Tripuri food culture featuring rice, vegetables and fermented preparations."]], architecture:[["Ujjayanta Palace","Historic palace and cultural landmark in Agartala."]] },
  "Uttar Pradesh": { art:[["Banarasi brocade","Rich silk weaving tradition of Varanasi with intricate zari patterns."]], craft:[["Chikankari","Fine hand embroidery strongly associated with Lucknow."]], dance:[["Kathak","North Indian classical dance tradition with major historical centres in Lucknow and nearby regions."]], festival:[["Holi","Major North Indian festival celebrated with colour, music and community gatherings."]], food:[["Awadhi cuisine","Culinary tradition of Lucknow known for kebabs, breads and slow-cooked dishes."]], architecture:[["Taj Mahal","Mughal-era marble monument at Agra and one of India's best-known heritage sites."]], language:[["Awadhi and Braj","Major regional literary and oral language traditions of Uttar Pradesh."]] },
  "Uttarakhand": { art:[["Aipan painting","Ritual floor and wall art made with geometric and sacred motifs."]], craft:[["Ringaal bamboo craft","Handmade baskets and household objects using Himalayan bamboo."]], dance:[["Chholiya","Traditional sword dance associated with Kumaon."]], festival:[["Nanda Devi Raj Jat","Major pilgrimage and cultural journey in the Himalayan region."]], food:[["Kafuli","Leafy-green preparation characteristic of Uttarakhand cuisine."]], architecture:[["Kumaoni traditional houses","Stone-and-wood houses adapted to Himalayan terrain and climate."]] },
  "West Bengal": { music:[["Baul music","Mystic singer tradition combining devotional poetry, philosophy and travelling performance."]], festival:[["Durga Puja","Major festival combining ritual, art, community celebration and temporary public installations."]], food:[["Machher jhol","Everyday Bengali fish curry representing the region's rice-and-fish food culture."]], language:[["Bengali","Major Indo-Aryan language with one of South Asia's richest literary traditions."]] },
  "Jammu and Kashmir": { art:[["Kashmiri papier-mâché","Decorative painted craft known for floral and natural motifs."]], craft:[["Kashmir carpet weaving","Fine hand-knotted carpet tradition with elaborate patterns."]], music:[["Sufiana kalam","Kashmiri devotional music tradition with Persianate influences."]], dance:[["Rouff","Traditional group dance performed especially by women during festive occasions."]], festival:[["Herath","Kashmiri Hindu festival with distinctive household and community rituals."]], food:[["Rogan josh","Well-known Kashmiri meat dish with aromatic spices."]], architecture:[["Mughal gardens of Kashmir","Terraced gardens shaped by Mughal landscape design and Himalayan geography."]] },
  "Ladakh": { dance:[["Cham","Masked monastic dance performed in Ladakh's Buddhist monasteries."]], food:[["Thukpa","Hearty noodle soup widely associated with Ladakhi and Himalayan food culture."]], architecture:[["Leh Palace","Historic palace overlooking Leh and a major landmark of Ladakh."]], language:[["Ladakhi","Tibetic language varieties spoken across Ladakh."]], history:[["Alchi Monastery","Historic Buddhist complex famous for its early wall paintings and sculpture."]] }
};

for (const [stateName, categories] of Object.entries(STATE_HIGHLIGHTS)) {
  STATE_HERITAGE_STORIES[stateName] ||= {};
  for (const [categoryId, entries] of Object.entries(categories)) {
    if (STATE_HERITAGE_STORIES[stateName][categoryId]?.length) continue;
    STATE_HERITAGE_STORIES[stateName][categoryId] = entries.map(([title, description], index) => ({
      id: `${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${categoryId}-${index + 1}`,
      title,
      short: description,
      image: null,
      place: stateName,
      period: "Living heritage tradition",
      medium: "Community practice, craft or performance",
      theme: "Living culture and community memory",
      description,
      facts: ["Practised or remembered within the region", "Knowledge is carried through communities and generations", "The tradition forms part of the state's living cultural landscape"],
      gallery: [],
      source: "Living India curated heritage index"
    }));
  }
}

function getStateStories(stateName, categoryId) {
  return STATE_HERITAGE_STORIES[stateName]?.[categoryId] || [];
}

const HERITAGE_UI_CSS = `
  .li-geo-map {
    position: relative;
    width: 100%;
    min-height: 520px;
    overflow: hidden;
    border-radius: 28px;
    background:
      radial-gradient(circle at 50% 40%, rgba(214, 158, 73, .12), transparent 48%),
      linear-gradient(135deg, #182522 0%, #0f1a18 100%);
    border: 1px solid rgba(205, 164, 92, .28);
    box-shadow: inset 0 0 90px rgba(0,0,0,.22), 0 20px 60px rgba(20,25,20,.14);
    touch-action: none;
    user-select: none;
  }

  .li-geo-map.full {
    min-height: min(760px, 72vh);
  }

  .li-geo-map svg {
    display: block;
    width: 100%;
    height: 100%;
    min-height: inherit;
  }

  .li-map-path {
    fill: #cfa86a;
    fill-opacity: .72;
    stroke: rgba(73, 53, 31, .85);
    stroke-width: 1.35;
    vector-effect: non-scaling-stroke;
    cursor: pointer;
    transition: fill .18s ease, fill-opacity .18s ease, filter .18s ease;
  }

  .li-map-path:hover,
  .li-map-path.is-hovered {
    fill: #e6b968;
    fill-opacity: .98;
    filter: drop-shadow(0 0 9px rgba(236, 184, 93, .45));
  }

  .li-map-hint {
    position: absolute;
    left: 20px;
    top: 18px;
    padding: 9px 13px;
    border: 1px solid rgba(226, 194, 132, .22);
    border-radius: 999px;
    background: rgba(8, 18, 16, .62);
    color: rgba(250, 238, 211, .9);
    font-size: 12px;
    letter-spacing: .04em;
    backdrop-filter: blur(12px);
    pointer-events: none;
  }

  .li-map-controls {
    position: absolute;
    right: 18px;
    top: 18px;
    display: flex;
    gap: 7px;
    z-index: 3;
  }

  .li-map-controls button {
    width: 38px;
    height: 38px;
    border: 1px solid rgba(238, 214, 167, .25);
    border-radius: 12px;
    background: rgba(8, 18, 16, .7);
    color: #f4e5c5;
    font-size: 20px;
    cursor: pointer;
    backdrop-filter: blur(12px);
  }

  .li-map-controls button:hover {
    background: rgba(121, 61, 39, .9);
    transform: translateY(-1px);
  }

  .li-map-tooltip {
    position: absolute;
    z-index: 4;
    transform: translate(-50%, calc(-100% - 12px));
    padding: 7px 11px;
    border-radius: 10px;
    background: #fff5df;
    color: #4a281c;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(0,0,0,.22);
    pointer-events: none;
    white-space: nowrap;
  }

  .li-map-bottom-note {
    position: absolute;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    color: rgba(246, 230, 198, .72);
    font-size: 11px;
    letter-spacing: .08em;
    text-transform: uppercase;
    pointer-events: none;
  }

  .li-category-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 22px;
    background: rgba(7, 13, 12, .78);
    backdrop-filter: blur(13px) saturate(.8);
    animation: liOverlayIn .22s ease both;
  }

  .li-category-modal {
    position: relative;
    width: min(1080px, 96vw);
    max-height: min(850px, 94vh);
    overflow: auto;
    display: grid;
    grid-template-columns: .78fr 1.22fr;
    border: 1px solid rgba(124, 74, 41, .28);
    border-radius: 30px;
    background:
      radial-gradient(circle at 78% 15%, rgba(194, 138, 60, .12), transparent 25%),
      linear-gradient(145deg, #fbf0d8 0%, #f4e3c2 100%);
    box-shadow: 0 35px 100px rgba(0,0,0,.48), inset 0 0 0 1px rgba(255,255,255,.35);
    animation: liModalIn .32s cubic-bezier(.2,.8,.2,1) both;
  }

  .li-category-modal::before {
    content: "";
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(124, 74, 41, .16);
    border-radius: 23px;
    pointer-events: none;
  }

  .li-state-art {
    position: relative;
    min-height: 680px;
    overflow: hidden;
    display: grid;
    place-items: center;
    padding: 36px;
    background:
      radial-gradient(circle, rgba(201, 143, 65, .17), transparent 62%),
      linear-gradient(155deg, #ead1a2, #d8b477);
    border-radius: 29px 0 0 29px;
  }

  .li-state-art::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 15% 15%, rgba(117,57,35,.1) 0 2px, transparent 2.5px),
      radial-gradient(circle at 80% 75%, rgba(117,57,35,.08) 0 2px, transparent 2.5px);
    background-size: 26px 26px, 31px 31px;
    pointer-events: none;
  }

  .li-state-map-watermark {
    position: absolute;
    inset: 8%;
    width: 84%;
    height: 84%;
    opacity: .28;
    overflow: visible;
  }

  .li-state-map-watermark path {
    fill: rgba(124, 65, 39, .36);
    stroke: rgba(103, 51, 31, .58);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .li-state-art-copy {
    position: relative;
    z-index: 2;
    align-self: end;
    width: 100%;
    color: #4e2d21;
  }

  .li-state-art-copy .mini-label {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 11px;
    letter-spacing: .22em;
    font-weight: 800;
    text-transform: uppercase;
    opacity: .72;
  }

  .li-state-art-copy h3 {
    margin: 0;
    max-width: 350px;
    font-family: Georgia, serif;
    font-size: clamp(28px, 3vw, 46px);
    line-height: 1.02;
  }

  .li-state-art-copy p {
    max-width: 330px;
    margin: 14px 0 0;
    line-height: 1.65;
    color: rgba(78,45,33,.78);
  }

  .li-category-content {
    position: relative;
    z-index: 2;
    padding: 46px 48px 40px;
  }

  .li-category-close {
    position: absolute;
    right: 27px;
    top: 24px;
    z-index: 4;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: #743421;
    color: #fff4df;
    font-size: 25px;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 7px 20px rgba(92,44,29,.2);
  }

  .li-category-close:hover {
    transform: rotate(5deg) scale(1.04);
    background: #8b3e28;
  }

  .li-category-eyebrow {
    margin-bottom: 8px;
    color: #875033;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .22em;
    text-transform: uppercase;
  }

  .li-category-title {
    margin: 0;
    padding-right: 45px;
    color: #572b20;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(38px, 5vw, 64px);
    line-height: .98;
  }

  .li-category-rule {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 15px 0 10px;
    color: #9b613d;
  }

  .li-category-rule::before,
  .li-category-rule::after {
    content: "";
    height: 1px;
    flex: 1;
    background: rgba(130,75,47,.22);
  }

  .li-category-subtitle {
    margin: 0 0 23px;
    color: #795846;
    line-height: 1.55;
    font-size: 14px;
  }

  .li-category-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 11px;
  }

  .li-category-card {
    position: relative;
    min-height: 78px;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 15px;
    border: 1px solid rgba(119, 72, 45, .17);
    border-radius: 17px;
    color: #513026;
    background: rgba(255, 249, 235, .64);
    cursor: pointer;
    text-align: left;
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
  }

  .li-category-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 9px 22px rgba(101,61,39,.11);
    border-color: rgba(128, 68, 40, .32);
  }

  .li-category-card.selected {
    border-color: #8a3f28;
    background: linear-gradient(135deg, rgba(155,75,47,.17), rgba(230,187,111,.17));
    box-shadow: 0 0 0 2px rgba(138,63,40,.08), 0 9px 24px rgba(104,55,37,.12);
  }

  .li-category-card .cat-icon {
    flex: 0 0 43px;
    width: 43px;
    height: 43px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: rgba(255,255,255,.58);
    font-size: 22px;
    box-shadow: inset 0 0 0 1px rgba(102,64,40,.08);
  }

  .li-category-card .cat-label {
    font-family: Georgia, serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.15;
  }

  .li-category-check {
    margin-left: auto;
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border: 1.5px solid rgba(104,65,43,.35);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    transition: all .18s ease;
  }

  .li-category-card.selected .li-category-check {
    border-color: #7d3524;
    background: #7d3524;
    box-shadow: 0 3px 8px rgba(106,48,34,.22);
  }

  .li-category-card.selected .li-category-check::after {
    content: "✓";
  }

  .li-category-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 25px;
  }

  .li-category-count {
    color: #856451;
    font-size: 12px;
  }

  .li-category-continue {
    min-width: 190px;
    padding: 13px 22px;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(135deg, #7d3524, #a54c31);
    color: #fff8e9;
    font-family: Georgia, serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(116,48,33,.22);
    transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
  }

  .li-category-continue:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 27px rgba(116,48,33,.28);
  }

  .li-category-continue:disabled {
    opacity: .45;
    cursor: not-allowed;
    box-shadow: none;
  }

  @keyframes liOverlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes liModalIn {
    from { opacity: 0; transform: translateY(18px) scale(.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .li-story-list {
    display: grid;
    gap: 12px;
    margin-top: 18px;
  }

  .li-story-card {
    width: 100%;
    display: grid;
    grid-template-columns: 78px 1fr auto;
    align-items: center;
    gap: 15px;
    padding: 10px 13px 10px 10px;
    border: 1px solid rgba(119,72,45,.17);
    border-radius: 16px;
    background: rgba(255,249,235,.72);
    color: #513026;
    text-align: left;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  }

  .li-story-card:hover {
    transform: translateY(-2px);
    border-color: rgba(128,68,40,.38);
    box-shadow: 0 10px 24px rgba(101,61,39,.12);
  }

  .li-story-thumb {
    width: 78px;
    height: 64px;
    overflow: hidden;
    border-radius: 11px;
    background: #e4c996;
  }

  .li-story-thumb img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .li-story-placeholder {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at 50% 35%, #f7e7c4, #dfc18a);
    color: #8c3f28;
    font-size: 27px;
  }


  .li-story-copy { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .li-story-copy h3 { margin: 0 0 4px; color: #5a2e21; font: 700 17px/1.15 Georgia, serif; }
  .li-story-copy p { margin: 0; color: #7b604e; font-size: 12px; line-height: 1.45; }
  .story-number { flex: 0 0 30px; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 9px; background: #efd7a4; color: #805037; font-size: 10px; font-weight: 800; }
  .story-arrow { color: #8c3f28; font-size: 22px; }

  .li-empty-category {
    margin-top: 22px;
    padding: 34px 26px;
    border: 1px dashed rgba(119,72,45,.28);
    border-radius: 20px;
    background: rgba(255,249,235,.58);
    text-align: center;
  }
  .li-empty-icon { font-size: 42px; margin-bottom: 8px; }
  .li-empty-category h3 { margin: 0 0 8px; color: #5a2e21; font: 700 22px/1.15 Georgia, serif; }
  .li-empty-category p { max-width: 520px; margin: 0 auto 20px; color: #7b604e; line-height: 1.6; font-size: 13px; }

  .li-story-detail { margin-top: 8px; }
  .li-detail-heading { display: flex; align-items: flex-start; gap: 13px; margin: 10px 0 16px; }
  .detail-cat-icon { flex: 0 0 46px; width: 46px; height: 46px; display: grid; place-items: center; border-radius: 14px; background: #fff6e5; font-size: 27px; box-shadow: inset 0 0 0 1px rgba(102,64,40,.08); }
  .li-detail-heading h2 { margin: 0; color: #572b20; font: 700 clamp(30px,4vw,50px)/.98 Georgia, serif; }
  .li-detail-heading p { margin: 7px 0 0; color: #795846; font-size: 13px; line-height: 1.45; }
  .li-detail-hero { position: relative; height: 290px; overflow: hidden; border-radius: 18px; background: #dfc38f; }
  .li-detail-hero > img { display: block; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: center; }

  .li-detail-hero-placeholder {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 10px;
    background: radial-gradient(circle at 50% 35%, #f7e7c4, #dcb982);
    color: #6d3827;
    text-align: center;
    padding: 30px;
  }
  .li-detail-hero-placeholder span { font-size: 52px; }
  .li-detail-hero-placeholder strong { font: 700 28px/1.1 Georgia, serif; max-width: 520px; }

  .li-detail-quote { position: absolute; left: 18px; right: 18px; bottom: 16px; padding: 12px 15px; border-radius: 13px; background: rgba(63,35,24,.78); color: #fff4df; font: italic 17px/1.3 Georgia, serif; }
  .li-detail-quote small { display: block; margin-top: 4px; color: #f0d9ad; font: 600 10px/1.2 Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
  .li-detail-description { margin: 18px 0; color: #654a3b; font-size: 14px; line-height: 1.75; }
  .li-detail-meta { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 18px; }
  .li-detail-meta span { min-width: 0; padding: 11px 12px; border-radius: 12px; background: rgba(255,249,235,.72); color: #654a3b; font-size: 11px; line-height: 1.35; }
  .li-detail-meta b { display: block; margin-bottom: 4px; color: #8a442d; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
  .li-detail-lower { display: grid; grid-template-columns: 1.5fr .85fr; gap: 15px; }
  .li-gallery, .li-facts { padding: 15px; border-radius: 16px; background: rgba(255,249,235,.62); border: 1px solid rgba(119,72,45,.12); }
  .li-gallery h3, .li-facts h3 { margin: 0 0 11px; color: #5a2e21; font: 700 18px Georgia, serif; }
  .li-gallery-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
  .li-gallery-grid img { display: block; width: 100%; height: 105px; object-fit: cover; border-radius: 10px; }
  .li-facts ul { margin: 0; padding-left: 18px; color: #725847; font-size: 12px; line-height: 1.55; }
  .li-facts li { margin-bottom: 7px; }
  .li-detail-source { margin-top: 14px; padding: 12px 14px; border-top: 1px solid rgba(119,72,45,.14); color: #8a6a56; font-size: 10px; }
  .li-detail-source button { float: right; border: 0; background: transparent; color: #8c3f28; font-weight: 800; cursor: pointer; }

  @media (max-width: 820px) {
    .li-category-modal {
      grid-template-columns: 1fr;
      max-height: 94vh;
    }

    .li-state-art {
      min-height: 230px;
      max-height: 280px;
      padding: 26px;
      border-radius: 29px 29px 0 0;
    }

    .li-state-map-watermark {
      inset: 5%;
      width: 90%;
      height: 90%;
    }

    .li-state-art-copy {
      align-self: end;
    }

    .li-state-art-copy h3 {
      font-size: 34px;
    }

    .li-state-art-copy p {
      display: none;
    }

    .li-category-content {
      padding: 30px 24px 27px;
    }

    .li-category-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

    .li-detail-meta { grid-template-columns: 1fr 1fr; }
    .li-detail-lower { grid-template-columns: 1fr; }
    .li-detail-hero { height: 220px; }
    .li-story-card { grid-template-columns: 64px 1fr auto; }
    .li-story-thumb { width: 64px; height: 58px; }
    .li-gallery-grid { grid-template-columns: repeat(2,1fr); }

  @media (max-width: 540px) {
    .li-geo-map {
      min-height: 440px;
      border-radius: 20px;
    }

    .li-category-overlay {
      padding: 10px;
    }

    .li-category-modal {
      border-radius: 23px;
    }

    .li-category-grid {
      grid-template-columns: 1fr;
    }

    .li-category-card {
      min-height: 68px;
    }

    .li-category-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .li-category-continue {
      width: 100%;
    }

    .li-category-count {
      text-align: center;
    }
  }
`;

function getGeoName(feature) {
  const p = feature?.properties || {};
  return (
    p.State_Name ||
    p.STATE_NAME ||
    p.ST_NM ||
    p.st_nm ||
    p.name ||
    p.NAME_1 ||
    p.NAME ||
    p.state ||
    p.State ||
    "Unknown State"
  );
}

function projectPoint([lon, lat]) {
  return [
    ((lon - MAP_VIEW.minLon) / (MAP_VIEW.maxLon - MAP_VIEW.minLon)) * MAP_VIEW.width,
    ((MAP_VIEW.maxLat - lat) / (MAP_VIEW.maxLat - MAP_VIEW.minLat)) * MAP_VIEW.height
  ];
}

function ringToSvgPath(ring) {
  if (!Array.isArray(ring) || !ring.length) return "";
  return ring
    .map((point, index) => {
      const [x, y] = projectPoint(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

function geometryToSvgPath(geometry) {
  if (!geometry) return "";

  if (geometry.type === "Polygon") {
    return geometry.coordinates.map(ringToSvgPath).join(" ");
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map(polygon => polygon.map(ringToSvgPath).join(" "))
      .join(" ");
  }

  if (geometry.type === "GeometryCollection") {
    return geometry.geometries.map(geometryToSvgPath).join(" ");
  }

  return "";
}

function geometryBounds(geometry) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const visit = coords => {
    if (!Array.isArray(coords)) return;

    if (
      coords.length >= 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      const [x, y] = projectPoint(coords);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      return;
    }

    coords.forEach(visit);
  };

  if (geometry?.type === "GeometryCollection") {
    geometry.geometries.forEach(g => visit(g.coordinates));
  } else {
    visit(geometry?.coordinates);
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 1100 };
  }

  return { minX, minY, maxX, maxY };
}

function stateFeatureKey(feature, index) {
  const p = feature?.properties || {};
  return (
    p.ID ||
    p.id ||
    p.STATE_ID ||
    p.state_id ||
    p.ISO ||
    p.iso ||
    `${getGeoName(feature)}-${index}`
  );
}

function CulturalMap({ full, onStateSelect, riskPulse = false }) {
  const [geojson, setGeojson] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const drag = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    let alive = true;

    fetch(INDIA_GEOJSON_URL)
      .then(r => {
        if (!r.ok) throw new Error(`Map request failed: ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (!alive) return;
        const features = Array.isArray(data?.features)
          ? data.features
          : [];

        setGeojson({
          ...data,
          features
        });
      })
      .catch(() => {
        if (alive) {
          setLoadError(
            "The geographic map could not be loaded. Please refresh once."
          );
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const features = geojson?.features || [];

  const changeZoom = amount => {
    setZoom(value => Math.min(6, Math.max(1, value + amount)));
  };

  const resetMap = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const startDrag = e => {
    drag.current = {
      active: true,
      moved: false,
      x: e.clientX,
      y: e.clientY
    };

    // Intentionally do not capture the pointer here. State SVG paths
    // need to receive their own pointer/click events.
  };

  const moveDrag = e => {
    if (!drag.current.active) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = MAP_VIEW.width / Math.max(rect.width, 1);
    const scaleY = MAP_VIEW.height / Math.max(rect.height, 1);

    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;

    if (Math.abs(dx) + Math.abs(dy) > 3) {
      drag.current.moved = true;
    }

    setPan(current => ({
      x: current.x + (dx * scaleX) / zoom,
      y: current.y + (dy * scaleY) / zoom
    }));

    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  const handleWheel = e => {
    e.preventDefault();
    changeZoom(e.deltaY > 0 ? -0.18 : 0.18);
  };

  return (
    <>
      <style>{HERITAGE_UI_CSS}</style>

      <div
        className={full ? "li-geo-map full" : "li-geo-map"}
        onWheel={handleWheel}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          setHovered(null);
          setTooltip(null);
        }}
      >
        <div className="li-map-hint">
          Drag to explore · Scroll to zoom
        </div>

        <div className="li-map-controls">
          <button
            type="button"
            aria-label="Zoom in"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => changeZoom(0.45)}
          >
            +
          </button>

          <button
            type="button"
            aria-label="Zoom out"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => changeZoom(-0.45)}
          >
            −
          </button>

          <button
            type="button"
            aria-label="Reset map"
            onPointerDown={e => e.stopPropagation()}
            onClick={resetMap}
          >
            ↺
          </button>
        </div>

        {loadError ? (
          <div
            style={{
              height: "100%",
              minHeight: "inherit",
              display: "grid",
              placeItems: "center",
              padding: 30,
              color: "#f4e5c5",
              textAlign: "center"
            }}
          >
            {loadError}
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`}
            role="img"
            aria-label="Interactive map of Indian states and union territories"
          >
            <defs>
              <filter id="li-map-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="4"
                  floodColor="#2d2116"
                  floodOpacity=".35"
                />
              </filter>
            </defs>

            <rect
              width={MAP_VIEW.width}
              height={MAP_VIEW.height}
              fill="transparent"
            />

            <g
              transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}
              filter="url(#li-map-shadow)"
            >
              {features.map((feature, index) => {
                const name = getGeoName(feature);
                const path = geometryToSvgPath(feature.geometry);

                if (!path) return null;

                const normalizedName = String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                let pulseLevel = "";
                if (riskPulse) {
                  if (normalizedName.includes("westbengal") || normalizedName.includes("kerala")) pulseLevel = "high";
                  else if (normalizedName.includes("tamilnadu")) pulseLevel = "medium";
                  else if (normalizedName.includes("assam") || normalizedName.includes("nagaland") || normalizedName.includes("manipur") || normalizedName.includes("mizoram") || normalizedName.includes("tripura") || normalizedName.includes("meghalaya") || normalizedName.includes("arunachal")) pulseLevel = "watch";
                }

                const pulseFill = pulseLevel === "high" ? "#b84d32" : pulseLevel === "medium" ? "#d59a2c" : pulseLevel === "watch" ? "#6f8870" : "#cfa86a";

                return (
                  <path
                    key={stateFeatureKey(feature, index)}
                    d={path}
                    className={`li-map-path${pulseLevel ? ` risk-${pulseLevel}` : ""}${hovered?.name === name ? " is-hovered" : ""}`}
                    style={riskPulse ? { fill: pulseFill, fillOpacity: pulseLevel ? 0.95 : 0.72 } : undefined}
                    onMouseEnter={e => {
                      setHovered({ name });
                      const rect = e.currentTarget
                        .ownerSVGElement
                        ?.getBoundingClientRect();

                      if (rect) {
                        setTooltip({
                          name,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top
                        });
                      }
                    }}
                    onMouseMove={e => {
                      const rect = e.currentTarget
                        .ownerSVGElement
                        ?.getBoundingClientRect();

                      if (rect) {
                        setTooltip({
                          name,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHovered(null);
                      setTooltip(null);
                    }}
                    onPointerDown={e => {
                      // Stop the map's drag handler from taking ownership of
                      // a direct state tap/click.
                      e.stopPropagation();
                      drag.current.active = false;
                      drag.current.moved = false;
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setTooltip(null);
                      setHovered(null);
                      onStateSelect?.({
                        name,
                        feature
                      });
                    }}
                  />
                );
              })}
            </g>
          </svg>
        )}

        {tooltip && (
          <div
            className="li-map-tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y
            }}
          >
            {tooltip.name}
          </div>
        )}

        <div className="li-map-bottom-note">
          States &amp; Union Territories · click any region to begin
        </div>
      </div>
    </>
  );
}

function HeritageCategoryModal({ state, onClose }) {
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    setView("categories");
    setSelectedCategory(null);
    setSelectedStory(null);
  }, [state]);

  if (!state?.feature) return null;

  const path = geometryToSvgPath(state.feature.geometry);
  const bounds = geometryBounds(state.feature.geometry);
  const width = Math.max(bounds.maxX - bounds.minX, 1);
  const height = Math.max(bounds.maxY - bounds.minY, 1);
  const scale = Math.min(14, 760 / Math.max(width, height));
  const centeredX = 500 - (bounds.minX + width / 2) * scale;
  const centeredY = 420 - (bounds.minY + height / 2) * scale;

  const stories = selectedCategory
    ? getStateStories(state.name, selectedCategory.id)
    : [];

  const availableCategories = HERITAGE_CATEGORIES.filter(category =>
    getStateStories(state.name, category.id).length > 0
  );

  const openCategory = category => {
    setSelectedCategory(category);
    setSelectedStory(null);
    setView("category");
  };

  const openStory = story => {
    setSelectedStory(story);
    setView("story");
  };

  const back = () => {
    if (view === "story") {
      setSelectedStory(null);
      setView("category");
    } else if (view === "category") {
      setSelectedCategory(null);
      setView("categories");
    } else {
      onClose();
    }
  };

  return (
    <>
      <style>{HERITAGE_UI_CSS}</style>
      <div className="li-category-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className={`li-category-modal ${view === "story" ? "story-mode" : ""}`} onClick={e => e.stopPropagation()}>
          <button type="button" className="li-category-close" aria-label="Close" onClick={onClose}>×</button>

          <section className="li-state-art">
            <svg className="li-state-map-watermark" viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`} aria-hidden="true">
              <g transform={`translate(${centeredX} ${centeredY}) scale(${scale})`}>
                <path d={path} />
              </g>
            </svg>
            <div className="li-state-art-copy">
              <span className="mini-label">A Living India · State Heritage</span>
              <h3>{view === "categories" ? `Explore the stories that belong to ${state.name}.` : (selectedStory?.title || selectedCategory?.label || state.name)}</h3>
              <p>{view === "story" ? "Look closer, learn the story, and visualise the living tradition." : `Discover the living heritage of ${state.name} through stories, places and people.`}</p>
            </div>
          </section>

          <section className="li-category-content">
            {view !== "categories" && (
              <button type="button" className="li-back-link" onClick={back}>← {view === "story" ? `Back to ${selectedCategory?.label}` : "Back to categories"}</button>
            )}

            {view === "categories" && (
              <>
                <div className="li-category-eyebrow">Selected region · {state.name}</div>
                <h2 className="li-category-title">{state.name}</h2>
                <div className="li-category-rule"><span>✦</span></div>
                <p className="li-category-subtitle">What kind of living heritage are you looking for?<br />Choose one path to explore.</p>
                <div className="li-category-grid">
                  {HERITAGE_CATEGORIES.map(category => {
                    const count = getStateStories(state.name, category.id).length;
                    return (
                      <button type="button" key={category.id} className={`li-category-card ${count ? "has-content" : "is-empty"}`} onClick={() => openCategory(category)}>
                        <span className="cat-icon">{category.icon}</span>
                        <span className="cat-label">{category.label}</span>
                        <span className="cat-arrow">→</span>
                      </button>
                    );
                  })}
                </div>
                <div className="li-category-footer"><span className="li-category-count">Select one category to enter</span></div>
              </>
            )}

            {view === "category" && selectedCategory && (
              <>
                <div className="li-category-eyebrow">{state.name} · {selectedCategory.label}</div>
                <h2 className="li-category-title category-page-title"><span className="big-cat-icon">{selectedCategory.icon}</span>{selectedCategory.label}</h2>
                <div className="li-category-rule"><span>✦</span></div>
                <p className="li-category-subtitle">Visual stories that help you see, understand and remember {state.name}'s living heritage.</p>
                {stories.length ? (
                  <div className="li-story-list">
                    {stories.map((story, index) => (
                      <button type="button" className="li-story-card" key={story.id} onClick={() => openStory(story)}>
                        <div className="li-story-thumb"><WikimediaHeritageImage story={story} stateName={state.name} category={selectedCategory} alt="" /></div>
                        <div className="li-story-copy"><span className="story-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{story.title}</h3><p>{story.short}</p></div></div>
                        <span className="story-arrow">→</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="li-empty-category">
                    <div className="li-empty-icon">{selectedCategory.icon}</div>
                    <h3>Stories for {selectedCategory.label} are being curated</h3>
                    <p>This path is ready for the Living India archive. More verified stories, photographs and community contributions can be added here.</p>
                    <button type="button" className="li-category-continue" onClick={() => notify(`${state.name} · ${selectedCategory.label} contribution path ready ✓`)}>Share a story →</button>
                  </div>
                )}
                <div className="li-category-footer"><span className="li-category-count">{stories.length ? `${stories.length} heritage ${stories.length === 1 ? "story" : "stories"}` : "Archive path ready"}</span></div>
              </>
            )}

            {view === "story" && selectedStory && (
              <HeritageStoryDetail story={selectedStory} stateName={state.name} category={selectedCategory} onBack={back} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}


const WIKIMEDIA_IMAGE_CACHE = new Map();

function WikimediaHeritageImage({ story, stateName, category, className = "", alt = "", gallery = false, onImageClick, onImagesReady }) {
  const [images, setImages] = useState(() => story.image ? [story.image] : []);
  const [loading, setLoading] = useState(!story.image);

  useEffect(() => {
    let cancelled = false;
    if (story.image) {
      const directImages = [story.image, ...(story.gallery || []).filter(Boolean)];
      setImages(directImages);
      onImagesReady?.(directImages);
      setLoading(false);
      return () => { cancelled = true; };
    }

    const query = [story.title, stateName, category?.label].filter(Boolean).join(" ");
    const cacheKey = query.toLowerCase();
    const cached = WIKIMEDIA_IMAGE_CACHE.get(cacheKey);
    if (cached) {
      setImages(cached);
      onImagesReady?.(cached);
      setLoading(false);
      return () => { cancelled = true; };
    }
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;

    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(new Error("image search failed")))
      .then(data => {
        if (cancelled) return;
        const pages = Object.values(data?.query?.pages || {});
        const found = pages
          .map(page => page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url)
          .filter(Boolean)
          .filter((value, index, arr) => arr.indexOf(value) === index);
        WIKIMEDIA_IMAGE_CACHE.set(cacheKey, found);
        setImages(found);
        onImagesReady?.(found);
      })
      .catch(() => {
        if (!cancelled) setImages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [story.id, story.image, story.title, stateName, category?.label, onImagesReady]);

  if (gallery) {
    if (loading) return <div className="li-gallery-loading">Finding heritage photographs…</div>;
    if (!images.length) return <div className="li-gallery-empty">Photographs will be added to this story.</div>;
    return (
      <div className="li-gallery-grid">
        {images.slice(0, 4).map((image, i) => (
          <button
            type="button"
            className="li-gallery-photo-button"
            key={image + i}
            onClick={() => onImageClick?.(i)}
            aria-label={`Open ${story.title} photograph ${i + 1} in large view`}
          >
            <img src={image} alt={`${story.title} view ${i + 1}`} loading="lazy" />
            <span className="li-gallery-zoom">↗</span>
          </button>
        ))}
      </div>
    );
  }

  if (loading) return <div className={`li-detail-hero-placeholder ${className}`}><span>{category?.icon}</span><strong>Finding photographs of {story.title}…</strong></div>;
  if (!images.length) return <div className={`li-detail-hero-placeholder ${className}`}><span>{category?.icon}</span><strong>{story.title}</strong><small>Photograph coming soon</small></div>;

  return <img className={className} src={images[0]} alt={alt || story.title} />;
}

function HeritageStoryDetail({ story, stateName, category, onBack }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight" && lightboxImages.length) setLightboxIndex(i => (i + 1) % lightboxImages.length);
      if (event.key === "ArrowLeft" && lightboxImages.length) setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, lightboxImages.length]);

  const openPhoto = (index, images) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  return (
    <div className="li-story-detail">
      <div className="li-category-eyebrow">{stateName} · {category?.label}</div>
      <div className="li-detail-heading"><span className="detail-cat-icon">{category?.icon}</span><div><h2>{story.title}</h2><p>{story.short}</p></div></div>
      <div className="li-detail-hero"><WikimediaHeritageImage story={story} stateName={stateName} category={category} alt={story.title} /><div className="li-detail-quote">“{story.theme}”<small>{story.place}</small></div></div>
      <p className="li-detail-description">{story.description}</p>
      <div className="li-detail-meta">
        <span><b>Region</b>{story.place}</span><span><b>Period</b>{story.period}</span><span><b>Medium</b>{story.medium}</span><span><b>Theme</b>{story.theme}</span>
      </div>
      <div className="li-detail-lower">
        <div className="li-gallery">
          <h3>See it closer</h3>
          <WikimediaHeritageImage
            story={story}
            stateName={stateName}
            category={category}
            gallery
            onImageClick={(index) => {
              if (lightboxImages.length) setLightboxIndex(index);
            }}
            onImagesReady={setLightboxImages}
          />
          <p className="li-gallery-hint">Click any photograph to open it larger.</p>
        </div>
        <div className="li-facts"><h3>Interesting facts</h3><ul>{(story.facts || []).map(f => <li key={f}>✦ {f}</li>)}</ul></div>
      </div>
      <div className="li-detail-source">Images / visual references: {story.source}. <button type="button" onClick={onBack}>Explore more in {stateName} →</button></div>

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <div className="li-photo-viewer" role="dialog" aria-modal="true" aria-label={`${story.title} photograph viewer`} onClick={() => setLightboxIndex(null)}>
          <button type="button" className="li-photo-viewer-close" aria-label="Close photo viewer" onClick={() => setLightboxIndex(null)}>×</button>
          <button type="button" className="li-photo-nav prev" aria-label="Previous photograph" onClick={(event) => { event.stopPropagation(); setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length); }}>‹</button>
          <div className="li-photo-viewer-stage" onClick={event => event.stopPropagation()}>
            <img src={lightboxImages[lightboxIndex]} alt={`${story.title} — photograph ${lightboxIndex + 1}`} />
            <div className="li-photo-viewer-caption">
              <strong>{story.title}</strong>
              <span>{lightboxIndex + 1} / {lightboxImages.length}</span>
            </div>
            <div className="li-photo-thumbs">
              {lightboxImages.slice(0, 8).map((image, i) => (
                <button type="button" key={image + i} className={i === lightboxIndex ? "active" : ""} onClick={() => setLightboxIndex(i)} aria-label={`View photograph ${i + 1}`}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="li-photo-nav next" aria-label="Next photograph" onClick={(event) => { event.stopPropagation(); setLightboxIndex(i => (i + 1) % lightboxImages.length); }}>›</button>
          <div className="li-photo-viewer-help">Click outside or press Esc to close · ← → to browse</div>
        </div>
      )}
    </div>
  );
}

function Detail({ h, close, onContribute }) {

  return (
    <div
      className="detail-overlay"
      onClick={close}
    >

      <div
        className="detail"
        onClick={e => e.stopPropagation()}
      >

        <button
          className="close"
          onClick={close}
        >
          ×
        </button>

        <div className="detail-image">

          <img
            src={h.image}
            alt=""
          />

          <div>
            <span>{h.type}</span>
            <span>{h.period}</span>
          </div>

        </div>

        <div className="detail-body">

          <div className="eyebrow">
            {h.place}
          </div>

          <h1>
            {h.title}
          </h1>

          <p className="lead">
            {h.desc}
          </p>

          <div className="fact-grid">

            {(h.facts || []).map(x => (
              <div key={x}>
                <span>✦</span>
                {x}
              </div>
            ))}

          </div>

          <div className="detail-actions">

            <button
              className="primary"
              onClick={onContribute}
            >
              Add your story ＋
            </button>

            <button
              className="outline"
              onClick={close}
            >
              Continue exploring
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function Modal({ type, close, notify }) {

  const contribute = type === "contribute";
  const experience =
    type && type.type === "experience";

  if (!contribute && !experience)
    return null;

  if (experience) {

    const data =
      experienceDetails[type.id] ||
      [
        "Heritage Experience",
        "This interaction is planned as part of the Living India experience layer."
      ];

    return (
      <div
        className="modal-overlay"
        onClick={close}
      >

        <div
          className="modal feature-modal"
          onClick={e => e.stopPropagation()}
        >

          <button
            className="close"
            onClick={close}
          >
            ×
          </button>

          <div className="eyebrow">
            COMING TO LIVING INDIA
          </div>

          <h2>
            {data[0]}
          </h2>

          <p>
            {data[1]}
          </p>

          <div className="feature-preview">

            <span>✦</span>

            <b>
              Interactive module
            </b>

            <small>
              Option added · full interaction will be implemented next
            </small>

          </div>

          <button
            className="primary"
            onClick={close}
          >
            Back to exploring →
          </button>

        </div>

      </div>
    );
  }

  return (
    <div
      className="modal-overlay"
      onClick={close}
    >

      <div
        className="modal"
        onClick={e => e.stopPropagation()}
      >

        <button
          className="close"
          onClick={close}
        >
          ×
        </button>

        <div className="eyebrow">
          COMMUNITY ARCHIVE
        </div>

        <h2>
          Share a living story
        </h2>

        <p>
          Your memory, craft, recipe, song or local tradition can become part of India's digital heritage.
        </p>

        <form
          onSubmit={e => {
            e.preventDefault();
            close();
            notify("Story submitted for review ✓");
          }}
        >

          <input
            name="title"
            required
            placeholder="Story title"
          />

          <input
            name="topic"
            placeholder="Place or tradition"
          />

          <textarea
            name="story"
            required
            placeholder="Tell us the story..."
          />

          <button
            className="primary"
            type="submit"
          >
            Submit for review →
          </button>

        </form>

      </div>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);
