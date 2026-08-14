const book = document.getElementById("book");
const pages = [...book.querySelectorAll(".page")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const tocBtn = document.getElementById("tocBtn");
const closeToc = document.getElementById("closeToc");
const drawer = document.getElementById("drawer");
const tocList = document.getElementById("tocList");
const drawerToc = document.getElementById("drawerToc");
const progressLabel = document.getElementById("progressLabel");
const pageNo = document.getElementById("pageNo");
const startBtn = document.getElementById("startBtn");

let index = 0;
let startX = 0;

function renderToc(target) {
  target.innerHTML = pages
    .map((page, i) => {
      const title = page.dataset.title || `第 ${i + 1} 页`;
      return `<li data-index="${i}"><b>${title}</b><span>${String(i + 1).padStart(2, "0")}</span></li>`;
    })
    .join("");
}

function go(next, fromCover = false) {
  const clamped = Math.max(0, Math.min(pages.length - 1, next));
  if (clamped === index && !fromCover) return;
  pages[index].classList.remove("is-active");
  index = clamped;
  pages[index].classList.add("is-active");
  progressLabel.textContent = pages[index].dataset.title;
  pageNo.textContent = `${index + 1} / ${pages.length}`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length - 1;
  localStorage.setItem("our-story-page", String(index));
}

renderToc(tocList);
renderToc(drawerToc);

tocList.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (item) go(Number(item.dataset.index));
});
drawerToc.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item) return;
  go(Number(item.dataset.index));
  drawer.hidden = true;
});

prevBtn.addEventListener("click", () => go(index - 1));
nextBtn.addEventListener("click", () => go(index + 1));
startBtn.addEventListener("click", () => go(1, true));
tocBtn.addEventListener("click", () => { drawer.hidden = false; });
closeToc.addEventListener("click", () => { drawer.hidden = true; });
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) drawer.hidden = true;
});

book.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(index + 1);
  if (e.key === "ArrowLeft") go(index - 1);
});

book.addEventListener("pointerdown", (e) => {
  startX = e.clientX;
});
book.addEventListener("pointerup", (e) => {
  const dx = e.clientX - startX;
  if (Math.abs(dx) < 40) {
    const rect = book.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width * 0.22) go(index - 1);
    if (e.clientX - rect.left > rect.width * 0.78) go(index + 1);
    return;
  }
  if (dx < 0) go(index + 1);
  else go(index - 1);
});

const saved = Number(localStorage.getItem("our-story-page") || 0);
go(Number.isFinite(saved) ? saved : 0, true);
book.focus();
