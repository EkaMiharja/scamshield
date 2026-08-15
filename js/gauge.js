const gauge = (function () {
  const R = 84;
  const CIRC = 2 * Math.PI * R;

  function cssVar(name, fallback) {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  }

  function colorFor(risk) {
    if (risk === "SAFE") return cssVar("--success", "#31a24c");
    if (risk === "SUSPICIOUS") return cssVar("--warning", "#f7b928");
    return cssVar("--critical", "#e41e3f");
  }

  function labelFor(risk) {
    return risk === "SAFE" ? "AMAN" : risk === "SUSPICIOUS" ? "MENURIGAKAN" : "BERBAHAYA";
  }

  function render(container, score, risk) {
    const color = colorFor(risk);
    const label = labelFor(risk);

    container.innerHTML =
      '<div class="gauge-wrap">' +
      '<svg viewBox="0 0 200 200" role="img" aria-label="Skor kepercayaan ' + score + ' dari 100, status ' + label + '">' +
      '<circle class="gauge-track" cx="100" cy="100" r="' + R + '"></circle>' +
      '<circle class="gauge-fill" cx="100" cy="100" r="' + R + '" style="stroke:' + color + ';stroke-dasharray:' + CIRC + ';stroke-dashoffset:' + CIRC + ';"></circle>' +
      "</svg>" +
      '<div class="gauge-center">' +
      '<span class="gauge-value">0</span>' +
      '<span class="gauge-max">/ 100</span>' +
      '<span class="gauge-status" style="color:' + color + '">' + label + "</span>" +
      "</div>" +
      "</div>";

    const fill = container.querySelector(".gauge-fill");
    const valueEl = container.querySelector(".gauge-value");
    const start = performance.now();
    const duration = 700;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      fill.style.strokeDashoffset = String(CIRC * (1 - eased * (score / 100)));
      valueEl.textContent = String(Math.round(eased * score));
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  return { render };
})();