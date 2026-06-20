const API_URL =
  "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-projects";

const SUPABASE_STORAGE_BASE =
  "https://ghaiizikzetdoepigdvs.supabase.co/storage/v1/object/public/project-images/";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/500x740?text=No+Image";

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

    const project = json.data.find(
      (p) => String(p.id).trim() === String(id).trim()
    );

    if (!project) throw new Error("Projekt nenalezen");

    render(project);

    if (state) state.textContent = "";
  } catch (err) {
    if (state) state.textContent = "Chyba při načítání";
  }
}

/* 🔥 SPRÁVNÝ SUPABASE IMAGE BUILDER */
function getImage(p) {
  const path = p?.image_path;

  if (!path) return PLACEHOLDER_IMAGE;

  // pokud už je full URL
  if (path.startsWith("http")) return path;

  return SUPABASE_STORAGE_BASE + path;
}

function render(p) {
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

  // 🖼 BACKDROP
  const bg = document.getElementById("project-backdrop");
  if (bg) {
    bg.style.backgroundImage = `url('${image}')`;
  }

  // 👥 CAST
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

  // 🎬 DIRECTOR
  const creatorsEl = document.getElementById("project-creators");
  if (creatorsEl) {
    creatorsEl.innerHTML = p.director
      ? `<li>${p.director}</li>`
      : "<li>Neuvedeno</li>";
  }

  // ▶️ WATCH BUTTON
  const watchBtn = document.getElementById("watch-button");
  const state = document.getElementById("project-state");

  if (watchBtn) {
    const url = p.url;

    watchBtn.hidden = false;
    watchBtn.onclick = null;

    if (url && url.trim() !== "") {
      watchBtn.href = url;
      watchBtn.target = "_blank";
      watchBtn.style.opacity = "1";
      watchBtn.style.pointerEvents = "auto";
    } else {
      watchBtn.href = "#";
      watchBtn.style.opacity = "0.6";

      watchBtn.onclick = (e) => {
        e.preventDefault();
        if (state) {
          state.textContent = "Projekt nebyl doposud zveřejněn";
        }
      };
    }
  }
}
