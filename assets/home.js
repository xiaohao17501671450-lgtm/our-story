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
