console.log("script.js loaded");

// 1️⃣ Panorama setup
const panoElement = document.getElementById("pano");
const viewer = new Marzipano.Viewer(panoElement);

const source = Marzipano.ImageUrlSource.fromString("panorama.jpg");
const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

const view = new Marzipano.RectilinearView();

const MIN_FOV = Math.PI / 4; // zoom IN limit
const MAX_FOV = Math.PI * 1.4; // zoom OUT limit (safe)

viewer.addEventListener("viewChange", () => {
  const params = view.parameters();
  let fov = params.fov;

  if (fov < MIN_FOV) {
    view.setParameters({ fov: MIN_FOV });
  }

  if (fov > MAX_FOV) {
    view.setParameters({ fov: MAX_FOV });
  }
});

const scene = viewer.createScene({
  source,
  geometry,
  view,
});

scene.switchTo();

panoElement.addEventListener("click", function (e) {
  const coords = viewer.view().screenToCoordinates({
    x: e.clientX,
    y: e.clientY,
  });

  console.log("Pitch:", coords.pitch.toFixed(3), "Yaw:", coords.yaw.toFixed(3));
});

// 2️⃣ Fetch plots data
fetch("/api/plots")
  .then((res) => res.json())
  .then((plots) => {
    console.log("PLOTS ARRAY:", plots);
    plots.forEach((plot) => addHotspot(plot));
  })
  .catch((err) => console.error("Fetch error:", err));

// 3️⃣ Create hotspot
function addHotspot(plot) {
  const el = document.createElement("div");
  el.className = `hotspot ${plot.Status}`;
  el.innerText = plot.PlotNo;

  el.onclick = () => showPlotCard(plot);

  scene.hotspotContainer().createHotspot(el, {
    pitch: Number(plot.Pitch),
    yaw: Number(plot.Yaw),
  });
}

// 4️⃣ Search feature
document.getElementById("search").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  document.querySelectorAll(".hotspot").forEach((h) => {
    h.style.display = h.innerText.toLowerCase().includes(val)
      ? "block"
      : "none";
  });
});

// function showPlotCard(plot) {
//   document.getElementById("cardPlotNo").innerText = `Plot ${plot.PlotNo}`;

//   const statusEl = document.getElementById("cardStatus");
//   statusEl.innerText = plot.Status;
//   statusEl.className = plot.Status; // color apply

//   document.getElementById("cardSize").innerText = plot.Size;
//   document.getElementById("cardRemarks").innerText = plot.Remarks;

//   document.getElementById("plotCard").classList.remove("hidden");
// }

function showPlotCard(plot) {
  // 🔒 safe status read
  const status = plot.Status.toLowerCase().trim();

  // Plot number
  document.getElementById("cardPlotNo").innerText = `Plot ${plot.PlotNo}`;

  // Status
  const statusEl = document.getElementById("cardStatus");

  // 🔥 set text
  statusEl.innerText = status;

  if (status === "booked") {
    statusEl.style.color = "red";
    statusEl.style.fontWeight = "bold";
  } else if (status === "available") {
    statusEl.style.color = "blue";
    statusEl.style.fontWeight = "bold";
  } else {
    statusEl.style.color = "orange";
    statusEl.style.fontWeight = "bold";
  }

  // 🔥 apply color class
  //   statusEl.classList.add(status);

  // Size & remarks
  document.getElementById("cardSize").innerText = plot.Size;
  document.getElementById("cardRemarks").innerText = plot.Remarks;

  // Show card
  document.getElementById("plotCard").classList.remove("hidden");
}

function closeCard() {
  document.getElementById("plotCard").classList.add("hidden");
}
