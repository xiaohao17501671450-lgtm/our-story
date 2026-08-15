(function () {
  const bgm = document.getElementById("bgm");
  const musicBtn = document.getElementById("musicBtn");
  if (!bgm || !musicBtn) return;

  const MUSIC_KEY = "our-story-music";
  const MUSIC_VOL = 0.35;
  let wantMusic = localStorage.getItem(MUSIC_KEY) !== "0";
  let fading = false;

  bgm.setAttribute("playsinline", "");
  bgm.setAttribute("webkit-playsinline", "");

  function syncBtn() {
    musicBtn.classList.toggle("off", !wantMusic);
    musicBtn.setAttribute("aria-pressed", wantMusic ? "true" : "false");
  }

  function fadeTo(to, ms) {
    const from = bgm.volume;
    const t0 = performance.now();
    fading = true;
    function tick(now) {
      const p = Math.min(1, (now - t0) / ms);
      bgm.volume = from + (to - from) * p;
      if (p < 1) requestAnimationFrame(tick);
      else fading = false;
    }
    requestAnimationFrame(tick);
  }

  function playNow() {
    if (!wantMusic) return;
    try {
      if (bgm.volume < 0.05 && !fading) bgm.volume = MUSIC_VOL;
      const p = bgm.play();
      if (p && p.then) {
        p.then(() => {
          if (wantMusic && bgm.volume < MUSIC_VOL) fadeTo(MUSIC_VOL, 600);
        }).catch(() => {});
      }
    } catch (_) {}
  }

  function pauseNow() {
    fadeTo(0, 280);
    window.setTimeout(() => {
      if (!wantMusic) bgm.pause();
    }, 300);
  }

  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    wantMusic = !wantMusic;
    localStorage.setItem(MUSIC_KEY, wantMusic ? "1" : "0");
    syncBtn();
    if (wantMusic) playNow();
    else pauseNow();
  });

  ["pointerdown", "touchend", "click"].forEach((ev) => {
    document.addEventListener(ev, playNow, { passive: true });
  });
  document.addEventListener("WeixinJSBridgeReady", playNow);

  bgm.addEventListener("canplay", playNow);
  bgm.load();
  syncBtn();
  playNow();
})();
