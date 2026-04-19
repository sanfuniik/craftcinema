function renderProjects(projects) {
  if (!projects.length) {
    projectListEl.innerHTML = `
      <div class="no-results-container">
        <p>Žádné projekty nenalezeny.</p>
      </div>
    `;
    return;
  }

  projectListEl.innerHTML = projects.map(p => {

    // 🔥 bezpečný obrázek ze Supabase
    const image =
      p.project_images?.[0] ||
      "https://placehold.co/400x250?text=No+Image";

    return `
      <div class="project-card">
        <img 
          src="${image}" 
          alt="${p.title}" 
          class="project-image"
          onerror="this.src='https://placehold.co/400x250?text=No+Image'"
        />

        <h3>${p.title}</h3>
        <p><strong>Žánr:</strong> ${p.genre || "N/A"}</p>
        <p><strong>Délka:</strong> ${p.duration_minutes || 0} min</p>
        <p class="description">${p.short_description || "Bez popisku"}</p>
        <p><strong>Rok:</strong> ${p.release_year || "N/A"}</p>
      </div>
    `;
  }).join("");
}
