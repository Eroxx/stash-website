// One place for the Discord invite. Paste the link between the quotes and every Discord button on
// every page uses it; until then they lead to the Support page's community section.
var DISCORD = "https://discord.gg/Sv66Tua6hX";

(function () {
  if (DISCORD) {
    document.querySelectorAll("[data-discord]").forEach(function (a) {
      a.href = DISCORD; a.target = "_blank"; a.rel = "noopener";
    });
  }
})();

// Support email: fill this in once support@<domain> forwards, and it appears on the Support page.
var SUPPORT_EMAIL = "support@stashlibraryapp.com";
(function () {
  var row = document.querySelector("[data-email]");
  if (!row || !SUPPORT_EMAIL) return;
  row.hidden = false;
  document.getElementById("email").textContent = SUPPORT_EMAIL;
  document.getElementById("copy-email").addEventListener("click", function () {
    var b = this;
    var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(SUPPORT_EMAIL).then(done, function () {});
  });
})();

/* --- the screenshots open full size -----------------------------------------------------------
 * Each shot is a real 2x or 3x capture of the app, so there is detail on it worth reading: the
 * struck-through price, the keyboard line above the queue, the tags on a card. At the size they
 * sit on the page none of that is legible, which left them as decoration.
 *
 * Keyboard-operable on purpose, since the app itself is: every shot is tabbable, Enter or Space
 * opens it, ← and → move between them, Escape closes and puts focus back where it was. `currentSrc`
 * is what gets opened, not `src`, so a dark-mode reader who clicks a dark screenshot gets the dark
 * one full size rather than the light original.
 */
(function () {
  var shots = [].slice.call(document.querySelectorAll(".hero-art img, .shot img"));
  if (!shots.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = '<button class="lb-close" type="button" aria-label="Close">✕</button>'
                + '<img alt=""><p class="lb-cap"></p>';
  document.body.appendChild(box);
  var img = box.querySelector("img");
  var cap = box.querySelector(".lb-cap");
  var closeBtn = box.querySelector(".lb-close");
  var lastFocus = null;
  var at = -1;

  function show(i) {
    at = (i + shots.length) % shots.length;
    var s = shots[at];
    img.src = s.currentSrc || s.src;
    img.alt = s.alt || "";
    cap.textContent = s.alt || "";
    box.classList.add("on");
    closeBtn.focus();
  }
  function open(i) { lastFocus = document.activeElement; show(i); }
  function close() {
    box.classList.remove("on");
    img.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    at = -1;
  }

  shots.forEach(function (s, i) {
    s.classList.add("zoomable");
    s.tabIndex = 0;
    s.setAttribute("role", "button");
    s.setAttribute("aria-label", (s.alt ? s.alt + " — " : "") + "open full size");
    s.addEventListener("click", function () { open(i); });
    s.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (at < 0) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(at + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); show(at - 1); }
  });
})();
