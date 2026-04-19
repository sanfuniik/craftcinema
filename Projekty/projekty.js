const API_URL =
  "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-projects";

const PLACEHOLDER_IMAGE = "https://placehold.co/400x250?text=No+Image";

let allProjects = [];

document.addEventListener("DOMContentLoaded", () => {
  const projectListEl = document.getElementById("project-list");
  const searchInputEl = document.getElementById("filter-title");
  const genreSelectEl = document.getElementById("filter-genre");
  const minDurationEl = document.getElementById("filter-duration-min");
  const maxDurationEl = document.getElementById("filter-duration-max");
  const resultsInfoEl = document.getElementById("results-info");
  const resetButtonEl = document.getElementById("reset-filters");

  if (!projectListEl) return;

  const inputs = [
    searchInputEl,
    genreSelectEl,
    minDurationEl,
    maxDurationEl,
  ];

  inputs.forEach((el) => {
    if (!el) return;
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });

  resetButtonEl?.addEventListener("click", () => {
    if (searchInputEl) searchInputEl.value = "";
    if (genreSelectEl) genreSelectEl.value = "";
    if (minDurationEl) minDurationEl.value = "";
    if (maxDurationEl) maxDurationEl.value = "";
    applyFilters();
  });

  fetchProjects();

  async function fetchProjects() {
    projectListEl.innerHTML =
      '<div class="status-message">Načítám projekty...</div>';

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (!json?.success || !Array.isArray(json.data)) {
        throw new Error("API error");
      }

      allProjects = json.data;

      renderGenres();
      applyFilters();
    } catch (err) {
      console.error(err);

      projectListEl.innerHTML =
        '<div class="status-message error-message">Nepodařilo se načíst projekty.</div>';
    }
  }

  function renderGenres() {
    if (!genreSelectEl) return;

    const genres = new Set();

    allProjects.forEach((p) => {
      if (!p.genre) return;
      p.genre.split(",").forEach((g) => {
        const clean = g.trim();
        if (clean) genres.add(clean);
      });
    });

    genreSelectEl.innerHTML =
      `<option value="">Všechny žánry</option>` +
      [...genres]
        .sort()
        .map((g) => `<option value="${escape(g)}">${escape(g)}</option>`)
        .join("");
  }

  function applyFilters() {
    const title = (searchInputEl?.value || "").toLowerCase();
    const genre = (genreSelectEl?.value || "").toLowerCase();
    const min = Number(minDurationEl?.value || 0);
    const max = Number(maxDurationEl?.value || 9999);

    const filtered = allProjects.filter((p) => {
      const t = (p.title || "").toLowerCase();
      const g = (p.genre || "").toLowerCase();
      const d = Number(p.duration_minutes || 0);

      return (
        (!title || t.includes(title)) &&
        (!genre || g.includes(genre)) &&
        (!min || d >= min) &&
        (!max || d <= max)
      );
    });

    render(filtered);

    const resultsInfoEl = document.getElementById("results-info");
    if (resultsInfoEl) {
      resultsInfoEl.textContent = `Zobrazeno ${filtered.length} / ${allProjects.length}`;
    }
  }

  function render(projects) {
    if (!projects.length) {
      projectListEl.innerHTML =
        '<div class="no-results-container">Žádné projekty</div>';
      return;
    }

    projectListEl.innerHTML = projects
      .map((p) => {
        const img = getImage(p);
        const url = `/Projekty/FILM/film.html?id=${encodeURIComponent(p.id)}`;

        return `
          <article class="project-card">
            <a class="project-card-link" href="${url}">
              <img class="project-image"
                   src="${img}"
                   onerror="this.src='${PLACEHOLDER_IMAGE}'" />

              <div class="project-card-content">
                <h3>${escape(p.title || "Bez názvu")}</h3>

                <p><strong>Žánr:</strong> ${escape(p.genre || "Neuvedeno")}</p>

                <p class="description">
                  ${escape(p.short_description || "")}
                </p>

                <p>
                  ${p.duration_minutes || 0} min • ${p.release_year || "N/A"}
                </p>
              </div>
            </a>
          </article>
        `;
      })
      .join("");
  }

  /* 🔥 KRITICKÁ FIXACE OBRÁZKŮ */
  function getImage(p) {
    const img = p?.project_images?.[0];

    if (!img) return PLACEHOLDER_IMAGE;

    if (typeof img === "string") return img;

    return img?.url || img?.image_url || PLACEHOLDER_IMAGE;
  }

  function escape(v) {
    return String(v)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
});

