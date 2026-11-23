/* aar desktop project page — shared by /aar-desktop/ (en), /de/ and /zh/.
   Texts that change at runtime come from data attributes of the page
   (theme button: data-dark / data-light, body: data-copy / data-copied). */

/* ── theme (light default) ────────────────────────────── */
const root = document.documentElement, themeBtn = document.getElementById("theme");
function syncTheme() {
  const dark = root.getAttribute("data-theme") === "dark";
  const [ico, label] = (dark ? themeBtn.dataset.light : themeBtn.dataset.dark).split(" ");
  themeBtn.querySelector(".nav-ico").textContent = ico;
  themeBtn.querySelector(".nav-label").textContent = label;
  document.querySelector('meta[name="theme-color"]').content = dark ? "#0c0c0f" : "#fbfaf8";
}
themeBtn.addEventListener("click", () => {
  const dark = root.getAttribute("data-theme") !== "dark";
  root.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("aar-desktop-theme", dark ? "dark" : "light");
  syncTheme();
});
syncTheme();

/* ── language: remember an explicit choice, keep the section ── */
document.querySelectorAll(".nav-lang a[data-lang]").forEach(a => a.addEventListener("click", e => {
  try { localStorage.setItem("aar-desktop-lang", a.dataset.lang); } catch (_) {}
  if (location.hash) { e.preventDefault(); location.href = a.getAttribute("href") + location.hash; }
}));

/* ── tabs + copy ──────────────────────────────────────── */
function switchTab(btn, id) {
  const box = btn.closest(".install-box");
  box.querySelectorAll(".itab").forEach(t => t.classList.remove("on"));
  box.querySelectorAll(".ipanel").forEach(p => p.classList.remove("on"));
  btn.classList.add("on");
  document.getElementById("tab-" + id).classList.add("on");
}
function copyCmd(el) {
  const raw = el.querySelector(".ic").textContent.trim();
  navigator.clipboard.writeText(raw).then(() => {
    const btn = el.querySelector(".copy-btn");
    btn.textContent = document.body.dataset.copied || "copied!";
    setTimeout(() => { btn.textContent = document.body.dataset.copy || "copy"; }, 2000);
  });
}

/* ── lightbox ─────────────────────────────────────────── */
const lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img");
document.querySelectorAll(".screen img").forEach(img => img.addEventListener("click", () => {
  lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("on");
}));
lb.addEventListener("click", () => lb.classList.remove("on"));
document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("on"); });

/* ── scroll reveal ────────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.06, rootMargin: "0px 0px -28px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
