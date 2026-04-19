const API_URL =
  "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-projects";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/500x740?text=No+Image";

console.log("🔥 film.js START");

document.addEventListener("DOMContentLoaded", () => {
  loadProjectDetail();
});

async function loadProjectDetail() {
  const state = document.getElementById("project-state");

  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    if (state) state.textContent = "Chybí ID";
    return;
  }

  try {
    if (state) state.textContent = "Načítám...";

    const res = await fetch(API_URL);
    const json = await res.json();

    console.log("📦 API:", json);

    const project = json.data.find(
      (p) => String(p.id).trim() === String(id).trim()
    );

    if (!project) throw new Error("Projekt nenalezen");

    render(project);

    if (state) state.textContent = "";
  } catch (err) {
    console.error(err);
    if (state) state.textContent = "Chyba při načítání";
  }
}

function getImage(p) {
  const img = p?.project_images?.[0];

  console.log("🖼 RAW IMAGE DATA:", img);

  if (!img) return PLACEHOLDER_IMAGE;

  // 🔥 HLAVNÍ FIX – přesně tvůj DB field
  if (typeof img === "string") return img;

  if (img?.image_url) return img.image_url;

  if (img?.url) return img.url;

  return PLACEHOLDER_IMAGE;
}


function render(p) {
  console.log("🎬 PROJECT:", p);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || "";
  };

  const image = getImage(p);

  // 🎬 BASIC INFO
  set("project-title", p.title);
  set("project-year", p.release_year);
  set(
  "project-duration",
  p.duration_minutes != null ? `${p.duration_minutes} min` : "N/A"
);

  set("project-genre", p.genre);
  set("project-description", p.short_description);
  set("project-long-description", p.full_description);
  set(
  "project-rating-age",
  p.age_rating != null && p.age_rating !== ""
    ? p.age_rating
    : "N/A"
);


  // 🖼 BACKGROUND
  const bg = document.getElementById("project-backdrop");
  if (bg) {
    bg.style.backgroundImage = `url('${image}')`;
  }

  // 👥 CAST FIX (DB: cast_members)
  const castEl = document.getElementById("project-cast");

  if (castEl) {
    const cast = p.cast_members;

    if (Array.isArray(cast)) {
      castEl.innerHTML = cast.map((x) => `<li>${x}</li>`).join("");
    } else if (typeof cast === "string" && cast.trim() !== "") {
      castEl.innerHTML = `<li>${cast}</li>`;
    } else {
      castEl.innerHTML = "<li>Neuvedeno</li>";
    }
  }

  // 🎬 DIRECTOR (bonus)
  const creatorsEl = document.getElementById("project-creators");

  if (creatorsEl) {
    creatorsEl.innerHTML = p.director
      ? `<li>${p.director}</li>`
      : "<li>Neuvedeno</li>";
  }
}
// ▶️ PLAY BUTTON
const playBtn = document.getElementById("play-btn");
const state = document.getElementById("project-state");

if (playBtn) {
  playBtn.onclick = () => {
    const url = p.url;

    if (url && url.trim() !== "") {
      window.location.href = url;
    } else {
      if (state) {
        state.textContent = "Projekt nebyl doposud zveřejněn";
      }
    }
  };
}
