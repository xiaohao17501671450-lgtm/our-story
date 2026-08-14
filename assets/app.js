const track = document.getElementById("track");
const drawerToc = document.getElementById("drawerToc");
const drawer = document.getElementById("drawer");
const captionEl = document.getElementById("caption");
const jumpBtn = document.getElementById("jumpBtn");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const STORY = window.STORY;
if (!STORY || !STORY.spreads) {
  track.innerHTML = "<article class='spread quiet'><div class='quiet-inner'><p class='body'>缺少相册数据。</p></div></article>";
  throw new Error("STORY missing");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function metaLine(img) {
  return [img.date, img.place].filter(Boolean).join("  ·  ");
}

function mat(img) {
  const orient = img.orient || (img.h > img.w ? "portrait" : "landscape");
  return `<div class="mat">
    <figure class="frame ${orient}">
      <img src="${escapeHtml(img.src)}" alt="${escapeHtml(metaLine(img))}" loading="lazy" data-full="${escapeHtml(img.src)}" />
    </figure>
    <p class="caption">${escapeHtml(metaLine(img))}</p>
  </div>`;
}

function chibi(who, stage) {
  return `<div class="chibi ${who} ${stage}" aria-hidden="true">
    <div class="shadow"></div>
    <div class="figure">
      <div class="head">
        <div class="hair-back"></div>
        <div class="ear l"></div>
        <div class="ear r"></div>
        <div class="face">
          <span class="eye l"><i></i></span>
          <span class="eye r"><i></i></span>
          <span class="glasses"></span>
          <span class="blush l"></span>
          <span class="blush r"></span>
          <span class="mouth"></span>
        </div>
        <div class="hair-front"></div>
        <div class="pigtail l"></div>
        <div class="pigtail r"></div>
        <div class="bow"></div>
      </div>
      <div class="torso">
        <span class="arm l"></span>
        <span class="arm r"></span>
      </div>
      <div class="legs">
        <span class="leg l"></span>
        <span class="leg r"></span>
      </div>
    </div>
  </div>`;
}

function typeLeaf(spread) {
  return `<div class="leaf type">
    ${spread.kicker ? `<p class="kicker">${escapeHtml(spread.kicker)}</p>` : ""}
    ${spread.heading ? `<h2>${escapeHtml(spread.heading)}</h2>` : ""}
    <hr class="rule" />
    ${spread.date ? `<p class="date">${escapeHtml(spread.date)}</p>` : ""}
    ${spread.body ? `<p class="body">${escapeHtml(spread.body)}</p>` : ""}
  </div>`;
}

function renderSpread(spread, i) {
  const images = spread.images || [];
  const extra = spread.extra ? "1" : "";
  const title = escapeHtml(spread.title || `第 ${i + 1} 页`);
  const type = spread.type || "story";

  if (type === "cover") {
    const img = images[0];
    return `<article class="spread cover" data-title="${title}" data-toc="${spread.toc ? "1" : ""}">
      <div class="leaf cloth">
        <span class="cover-flourish t" aria-hidden="true"></span>
        <p class="cover-small">${escapeHtml(spread.kicker || "")}</p>
        <div class="cameo">${img ? `<img src="${escapeHtml(img.src)}" alt="" data-full="${escapeHtml(img.src)}" />` : ""}</div>
        <h1>${escapeHtml(spread.heading || "来时路")}</h1>
        <p class="cover-heart" aria-hidden="true">♡</p>
        <p class="cover-line">${escapeHtml(spread.line || "")}</p>
        <p class="cover-hint">${escapeHtml(spread.hint || "滑动翻页")}</p>
        <span class="cover-flourish b" aria-hidden="true"></span>
      </div>
    </article>`;
  }

  if (type === "back") {
    return `<article class="spread cover back" data-title="${title}" data-toc="1">
      <div class="leaf cloth">
        <p class="cover-small">${escapeHtml(spread.kicker || "来时路")}</p>
      </div>
    </article>`;
  }

  if (type === "toc") {
    return `<article class="spread toc-spread" data-title="${title}" data-toc="1">
      <div class="leaf flyleaf hide-phone">
        <p>只给我们看</p>
      </div>
      <div class="leaf type">
        <p class="kicker">目录</p>
        <h2>来时路</h2>
        <hr class="rule" />
        <ol class="index" data-toc></ol>
      </div>
    </article>`;
  }

  if (type === "origin-birth") {
    const stage = "baby";
    return `<article class="spread origin-birth story" data-title="${title}" data-toc="1">
      <div class="mat stage-pad">
        <div class="nursery ${spread.who}">${chibi(spread.who, stage)}</div>
      </div>
      ${typeLeaf(spread)}
    </article>`;
  }

  if (type === "origin-walk") {
    return `<article class="spread origin-walk" data-title="${title}" data-toc="1">
      <div class="walk-scene">
        <div class="sky"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
        <div class="cloud c2"></div>
        <div class="town">
          <i></i><i></i><i></i><i></i><i></i>
        </div>
        <div class="trees"></div>
        <div class="road"></div>
        <div class="gate"><span>八中</span></div>
        <div class="walker boy-walk">${chibi("boy", "child")}</div>
        <div class="walker girl-walk">${chibi("girl", "child")}</div>
        <ol class="years">
          <li>1991</li><li>1992</li><li>童年</li><li>2009</li>
        </ol>
      </div>
      <div class="walk-copy">
        <p class="kicker">${escapeHtml(spread.kicker || "")}</p>
        <h2>${escapeHtml(spread.heading || "")}</h2>
        <p class="body">${escapeHtml(spread.body || "")}</p>
      </div>
    </article>`;
  }

  if (type === "origin-school") {
    return `<article class="spread origin-school story" data-title="${title}" data-toc="1">
      <div class="mat stage-pad classroom">
        <div class="desk-scene">
          ${chibi("boy", "teen")}
          ${chibi("girl", "teen")}
        </div>
      </div>
      ${typeLeaf(spread)}
    </article>`;
  }

  if (type === "together") {
    return `<article class="spread together story" data-title="${title}" data-toc="1">
      <div class="mat stage-pad together-scene">
        <div class="heart h1">♡</div>
        <div class="heart h2">♡</div>
        <div class="heart h3">♡</div>
        <div class="pair-hold">
          <div class="hold boy-hold">${chibi("boy", "teen")}</div>
          <div class="hold girl-hold">${chibi("girl", "teen")}</div>
        </div>
        <p class="moment-date">2009 · 五月</p>
      </div>
      ${typeLeaf(spread)}
    </article>`;
  }

  if (type === "wedding") {
    return `<article class="spread wedding story" data-title="${title}" data-toc="1">
      <div class="mat stage-pad wedding-scene">
        <div class="arch"><span></span></div>
        <div class="aisle"></div>
        <div class="petals" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="pair-hold altar">
          <div class="hold boy-hold">${chibi("boy", "wedding")}</div>
          <div class="hold girl-hold">${chibi("girl", "wedding")}</div>
        </div>
        <div class="rings" aria-hidden="true"><b></b><b></b></div>
        <p class="moment-date">2016 · 10 · 06</p>
      </div>
      ${typeLeaf(spread)}
    </article>`;
  }

  if (type === "arrive") {
    return `<article class="spread arrive story" data-title="${title}" data-toc="1">
      <div class="mat stage-pad arrive-scene">
        <div class="heart h1">♡</div>
        <div class="heart h2">♡</div>
        <div class="pair-hold family">
          <div class="hold boy-hold">${chibi("boy", "teen")}</div>
          <div class="hold baby-hold">${chibi("boy", "baby")}</div>
          <div class="hold girl-hold">${chibi("girl", "teen")}</div>
        </div>
        <p class="moment-date">2022 · 07 · 03</p>
      </div>
      ${typeLeaf(spread)}
    </article>`;
  }

  if (type === "letter") {
    return `<article class="spread letter" data-title="${title}" data-toc="${spread.toc ? "1" : ""}">
      <div class="leaf flyleaf">
        <p>${escapeHtml(spread.aside || "").replace(/\n/g, "<br />")}</p>
      </div>
      ${typeLeaf(spread)}
    </article>`;
  }

  if (type === "quiet") {
    return `<article class="spread quiet" data-title="${title}" data-toc="${spread.toc ? "1" : ""}">
      <div class="quiet-inner">
        ${spread.kicker ? `<p class="kicker">${escapeHtml(spread.kicker)}</p>` : ""}
        ${spread.heading ? `<h2>${escapeHtml(spread.heading)}</h2>` : ""}
        <hr class="rule" />
        ${spread.date ? `<p class="date">${escapeHtml(spread.date)}</p>` : ""}
        ${spread.body ? `<p class="body">${escapeHtml(spread.body)}</p>` : ""}
      </div>
    </article>`;
  }

  if (type === "pano") {
    const img = images[0];
    return `<article class="spread pano" data-title="${title}" data-toc="${spread.toc ? "1" : ""}">
      ${img ? `<img src="${escapeHtml(img.src)}" alt="" data-full="${escapeHtml(img.src)}" />` : ""}
      <div class="pano-copy">
        <span>${escapeHtml(spread.kicker || "")}</span>
        <h2>${escapeHtml(spread.heading || "")}</h2>
        <p>${escapeHtml(spread.body || "")}</p>
      </div>
    </article>`;
  }

  if (type === "pair" && images.length >= 2) {
    return `<article class="spread pair" data-title="${title}" data-extra="${extra}">
      ${mat(images[0])}
      ${mat(images[1])}
    </article>`;
  }

  if (type === "plate" && images[0]) {
    const img = images[0];
    if (img.orient === "landscape") {
      return `<article class="spread plate wide" data-title="${title}" data-extra="${extra}">
        <div class="bleed"><img src="${escapeHtml(img.src)}" alt="" loading="lazy" data-full="${escapeHtml(img.src)}" /></div>
        <p class="caption bar">${escapeHtml(metaLine(img))}</p>
      </article>`;
    }
    return `<article class="spread story" data-title="${title}" data-extra="${extra}">
      ${mat(img)}
      <div class="leaf type quiet-caption">
        <p class="date">${escapeHtml(img.date || "")}</p>
        ${img.place ? `<p class="body">${escapeHtml(img.place)}</p>` : ""}
      </div>
    </article>`;
  }

  if (images[0]) {
    return `<article class="spread story" data-title="${title}" data-toc="${spread.toc ? "1" : ""}">
      ${mat(images[0])}
      ${typeLeaf(spread)}
    </article>`;
  }

  return `<article class="spread quiet" data-title="${title}" data-toc="${spread.toc ? "1" : ""}">
    <div class="quiet-inner">${typeLeaf(spread)}</div>
  </article>`;
}

track.innerHTML = STORY.spreads.map(renderSpread).join("");

const spreads = [...track.querySelectorAll(".spread")];
const pageToc = track.querySelector("ol[data-toc]");
const tocEntries = spreads
  .map((el, i) => ({ el, i, title: el.dataset.title, listed: el.dataset.toc === "1" }))
  .filter((x) => x.listed);

const openChapters = new Set();

function extrasOf(title) {
  return spreads.filter((el) => el.dataset.title === title && el.dataset.extra === "1");
}

function visList() {
  return spreads.filter((el) => !el.hidden);
}

function applyExtra() {
  spreads.forEach((el) => {
    el.hidden = el.dataset.extra === "1" && !openChapters.has(el.dataset.title);
  });
}

function visiblePageOf(el) {
  const vis = visList();
  const v = vis.indexOf(el);
  if (v >= 0) return v + 1;
  const opener = spreads.find((s) => s.dataset.title === el.dataset.title && s.dataset.extra !== "1" && !s.hidden);
  return vis.indexOf(opener) + 1;
}

function renderToc(target) {
  if (!target) return;
  target.innerHTML = tocEntries
    .map((item) => {
      const page = String(visiblePageOf(item.el)).padStart(2, "0");
      return `<li data-index="${item.i}"><b>${item.title}</b><span>${page}</span></li>`;
    })
    .join("");
}

function refreshMore() {
  document.querySelectorAll(".more-photos").forEach((btn) => {
    const title = btn.dataset.chapter;
    const n = extrasOf(title).length;
    const open = openChapters.has(title);
    if (btn.dataset.role === "fold") {
      btn.hidden = !open;
    } else {
      btn.hidden = open;
      btn.textContent = `还有 ${n} 页照片 · 展开`;
    }
  });
  renderToc(pageToc);
  renderToc(drawerToc);
}

function lastOpenOf(title) {
  return [...spreads].reverse().find((el) => el.dataset.title === title && el.dataset.extra !== "1");
}

function wireMore() {
  const titles = [...new Set(spreads.map((el) => el.dataset.title))];
  titles.forEach((title) => {
    const extras = extrasOf(title);
    if (!extras.length) return;
    const opener = lastOpenOf(title);
    if (!opener) return;
    const host = opener.querySelector(".type") || opener.querySelector(".quiet-inner") || opener;
    const expand = document.createElement("button");
    expand.type = "button";
    expand.className = "more-photos";
    expand.dataset.chapter = title;
    expand.dataset.role = "expand";
    host.appendChild(expand);
    extras.forEach((el) => {
      const fold = document.createElement("button");
      fold.type = "button";
      fold.className = "more-photos fold";
      fold.dataset.chapter = title;
      fold.dataset.role = "fold";
      fold.textContent = "收起其余照片";
      el.appendChild(fold);
    });
  });
}

function resolveVisible(next) {
  const clamped = Math.max(0, Math.min(spreads.length - 1, next));
  const el = spreads[clamped];
  if (el && !el.hidden) return clamped;
  const opener = spreads.find((s) => s.dataset.title === el.dataset.title && s.dataset.extra !== "1" && !s.hidden);
  if (opener) return spreads.indexOf(opener);
  const vis = visList();
  return vis.length ? spreads.indexOf(vis[0]) : 0;
}

let index = 0;

function sync(next) {
  index = resolveVisible(next);
  const spread = spreads[index];
  const vis = visList();
  const v = Math.max(0, vis.indexOf(spread));
  captionEl.textContent = spread.dataset.title || "";
  jumpBtn.textContent = `${String(v + 1).padStart(2, "0")} / ${String(vis.length).padStart(2, "0")}`;
  progressBar.style.width = `${((v + 1) / Math.max(vis.length, 1)) * 100}%`;
  prevBtn.disabled = v === 0;
  nextBtn.disabled = v >= vis.length - 1;
  localStorage.setItem("our-story-page", String(index));
  spreads.forEach((el) => el.classList.toggle("play", el === spread));
}

function go(next, instant = false) {
  const clamped = resolveVisible(next);
  const vis = visList();
  const v = Math.max(0, vis.indexOf(spreads[clamped]));
  track.scrollTo({
    left: v * track.clientWidth,
    behavior: instant ? "auto" : "smooth",
  });
  sync(clamped);
}

function step(delta) {
  const vis = visList();
  const v = vis.indexOf(spreads[index]);
  const nextEl = vis[Math.max(0, Math.min(vis.length - 1, v + delta))];
  if (nextEl) go(spreads.indexOf(nextEl));
}

wireMore();
applyExtra();
refreshMore();

const saved = Number(localStorage.getItem("our-story-page") || 0);
sync(Number.isFinite(saved) ? Math.min(saved, spreads.length - 1) : 0);
requestAnimationFrame(() => go(index, true));

let ticking = false;
track.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const vis = visList();
    const next = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    const el = vis[next];
    if (el) {
      const full = spreads.indexOf(el);
      if (full !== index) sync(full);
    }
    ticking = false;
  });
}, { passive: true });

window.addEventListener("resize", () => go(index, true));

track.addEventListener("click", (e) => {
  const btn = e.target.closest(".more-photos");
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  const title = btn.dataset.chapter;
  if (btn.dataset.role === "expand") {
    openChapters.add(title);
    applyExtra();
    refreshMore();
    const first = extrasOf(title)[0];
    requestAnimationFrame(() => go(spreads.indexOf(first)));
  } else {
    openChapters.delete(title);
    const opener = lastOpenOf(title);
    applyExtra();
    refreshMore();
    requestAnimationFrame(() => go(spreads.indexOf(opener), true));
  }
});

function onTocClick(e) {
  const item = e.target.closest("li");
  if (!item) return;
  go(Number(item.dataset.index));
  drawer.hidden = true;
}

if (pageToc) pageToc.addEventListener("click", onTocClick);
drawerToc.addEventListener("click", onTocClick);

const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
const MUSIC_KEY = "our-story-music";
const MUSIC_VOL = 0.3;
let wantMusic = localStorage.getItem(MUSIC_KEY) !== "0";
let musicReady = false;

bgm.volume = 0;

function syncMusicBtn() {
  musicBtn.classList.toggle("off", !wantMusic);
  musicBtn.setAttribute("aria-pressed", wantMusic ? "true" : "false");
}

function fadeMusic(to, ms) {
  const from = bgm.volume;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - t0) / ms);
    bgm.volume = from + (to - from) * p;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function playMusic() {
  if (!wantMusic || !musicReady) return;
  try {
    await bgm.play();
    fadeMusic(MUSIC_VOL, 1400);
  } catch (_) {
    /* need a tap */
  }
}

function pauseMusic() {
  fadeMusic(0, 400);
  window.setTimeout(() => {
    if (!wantMusic) bgm.pause();
  }, 420);
}

function toggleMusic() {
  wantMusic = !wantMusic;
  localStorage.setItem(MUSIC_KEY, wantMusic ? "1" : "0");
  syncMusicBtn();
  if (wantMusic) playMusic();
  else pauseMusic();
}

bgm.addEventListener("canplaythrough", () => {
  musicReady = true;
  playMusic();
}, { once: true });
bgm.addEventListener("error", () => {
  musicBtn.title = "请把《因为爱情》放到 assets/music/";
  musicBtn.classList.add("off");
});
syncMusicBtn();
musicBtn.addEventListener("click", toggleMusic);
window.addEventListener("pointerdown", () => playMusic(), { once: true, passive: true });

document.getElementById("homeBtn").addEventListener("click", () => go(0));
document.getElementById("tocBtn").addEventListener("click", () => {
  drawer.hidden = false;
});
document.getElementById("closeToc").addEventListener("click", () => {
  drawer.hidden = true;
});
document.getElementById("drawerHome").addEventListener("click", () => {
  drawer.hidden = true;
  go(0);
});
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) drawer.hidden = true;
});

prevBtn.addEventListener("click", () => step(-1));
nextBtn.addEventListener("click", () => step(1));

const jump = document.getElementById("jump");
const jumpForm = document.getElementById("jumpForm");
const jumpInput = document.getElementById("jumpInput");
const jumpMax = document.getElementById("jumpMax");

function openJump() {
  const vis = visList();
  const v = Math.max(0, vis.indexOf(spreads[index]));
  jumpMax.textContent = `/ ${String(vis.length).padStart(2, "0")}`;
  jumpInput.max = String(vis.length);
  jumpInput.value = String(v + 1);
  jump.hidden = false;
  jumpInput.focus();
  jumpInput.select();
}

function closeJump() {
  jump.hidden = true;
}

jumpBtn.addEventListener("click", openJump);
document.getElementById("closeJump").addEventListener("click", closeJump);
jump.addEventListener("click", (e) => {
  if (e.target === jump) closeJump();
});
jumpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const page = Number(jumpInput.value);
  if (!Number.isFinite(page)) return;
  const vis = visList();
  const el = vis[Math.max(0, Math.min(vis.length - 1, page - 1))];
  if (el) go(spreads.indexOf(el));
  closeJump();
});

document.getElementById("book").addEventListener("click", (e) => {
  if (e.target.closest("button, a, li, .index, img, .frame, .cameo")) return;
  const x = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.clientWidth;
  if (x < 0.18) step(-1);
  else if (x > 0.82) step(1);
});

const lightbox = document.getElementById("lightbox");
const lightImg = document.getElementById("lightImg");
const lightCap = document.getElementById("lightCap");

function closeLight() {
  lightbox.hidden = true;
  lightImg.removeAttribute("src");
}

track.addEventListener("click", (e) => {
  if (e.target.closest(".more-photos")) return;
  const img = e.target.closest(".spread img");
  if (!img || !img.src) return;
  e.preventDefault();
  lightImg.src = img.dataset.full || img.src;
  lightCap.textContent = img.alt || "";
  lightbox.hidden = false;
});
document.getElementById("closeLight").addEventListener("click", closeLight);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightImg) closeLight();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!lightbox.hidden) {
      closeLight();
      return;
    }
    drawer.hidden = true;
    closeJump();
    return;
  }
  if (!lightbox.hidden) return;
  if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "Home") go(0);
  if (e.key === "End") {
    const vis = visList();
    go(spreads.indexOf(vis[vis.length - 1]));
  }
  if (e.key === "g" || e.key === "G") openJump();
  if (e.key === "m" || e.key === "M") toggleMusic();
});
