const petals = document.getElementById("petals");
const count = window.matchMedia("(min-width: 900px)").matches ? 22 : 14;

for (let i = 0; i < count; i += 1) {
  const el = document.createElement("i");
  el.style.left = `${Math.random() * 100}%`;
  el.style.animationDuration = `${7 + Math.random() * 8}s`;
  el.style.animationDelay = `${Math.random() * 8}s`;
  el.style.transform = `scale(${0.7 + Math.random() * 0.7})`;
  petals.appendChild(el);
}

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

syncMusicBtn();
musicBtn.addEventListener("click", toggleMusic);
window.addEventListener("pointerdown", () => playMusic(), { once: true, passive: true });
