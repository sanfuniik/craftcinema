const API_URL =
  "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-projects";

async function fetchAndRenderProjects() {
  showMessage(loadingMessageEl);
  projectListEl.innerHTML = "<p>Načítám...</p>";

  const title = filterTitleEl.value.toLowerCase().trim();
  const genre = filterGenreEl.value.toLowerCase().trim();
  const length = parseInt(filterLengthEl.value) || 0;

  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    if (!json.success) throw new Error();

    let projects = json.data;

    // 🔎 FILTRY (frontend)
    if (title) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(title)
      );
    }

    if (genre) {
      projects = projects.filter(p =>
        (p.genre || "").toLowerCase().includes(genre)
      );
    }

    if (length > 0) {
      projects = projects.filter(p =>
        p.duration_minutes >= length
      );
    }

    renderProjects(projects);
    showMessage(successMessageEl);

  } catch (err) {
    console.error(err);
    projectListEl.innerHTML =
      '<p class="error-message">Chyba načítání</p>';
    showMessage(errorMessageEl);
  }
}
