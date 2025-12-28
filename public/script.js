console.log("script.js loaded");

// ===== Panorama Setup =====
const panoElement = document.getElementById("pano");
const viewer = new Marzipano.Viewer(panoElement);

// IMPORTANT: absolute path for Vercel
const source = Marzipano.ImageUrlSource.fromString("/panorama.jpg");
const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

const view = new Marzipano.RectilinearView();

// Zoom limits (both IN & OUT, no half image)
const MIN_FOV = Math.PI / 4;     // zoom IN limit
const MAX_FOV = Math.PI * 1.4;   // zoom OUT limit (safe)

view.addEventListener("change", () => {
  const fov = view.parameters().fov;
  if (fov < MIN_FOV) view.setParameters({ fov: MIN_FOV });
  if (fov > MAX_FOV) view.setParameters({ fov: MAX_FOV });
});

const scene = viewer.createScene({ source, geometry, view });
scene.switchTo();

// Click to read pitch/yaw (helper)
panoElement.addEventListener("click", (e) => {
  const c = viewer.view().screenToCoordinates({
    x: e.clientX,
    y: e.clientY
  });
  console.log("Pitch:", c.pitch.toFixed(3), "Yaw:", c.yaw.toFixed(3));
});

// ===== Fetch Data =====
fetch("/api/plots")
  .then(res => res.json())
  .then(plots => {
    console.log("PLOTS:", plots);
    plots.forEach(addHotspot);
  })
  .catch(err => console.error(err));

// ===== Hotspots =====
function addHotspot(plot) {
  const status = plot.Status.toLowerCase().trim();

  const el = document.createElement("div");
  el.className = `hotspot ${status}`;
  el.innerText = plot.PlotNo;

  el.onclick = () => showPlotCard(plot);

  scene.hotspotContainer().createHotspot(el, {
    pitch: parseFloat(plot.Pitch),
    yaw: parseFloat(plot.Yaw)
  });
}

// ===== Search =====
document.getElementById("search").addEventListener("input", (e) => {
  const v = e.target.value.toLowerCase();
  document.querySelectorAll(".hotspot").forEach(h => {
    h.style.display = h.innerText.toLowerCase().includes(v) ? "flex" : "none";
  });
});

// ===== Plot Card =====
function showPlotCard(plot) {
  const status = plot.Status.toLowerCase().trim();

  document.getElementById("cardPlotNo").innerText = `Plot ${plot.PlotNo}`;

  const statusEl = document.getElementById("cardStatus");
  statusEl.className = "";
  statusEl.innerText = status;
  statusEl.classList.add(status);

  document.getElementById("cardSize").innerText = plot.Size;
  document.getElementById("cardRemarks").innerText = plot.Remarks;

  document.getElementById("plotCard").classList.remove("hidden");
}

function closeCard() {
  document.getElementById("plotCard").classList.add("hidden");
}
