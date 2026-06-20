function renderProjects(projects) {
  const PLACEHOLDER_IMAGE =
    "https://placehold.co/400x250?text=No+Image";

  const STORAGE_BASE =
    "https://ghaiizikzetdoepigdvs.supabase.co/storage/v1/object/public/project-images/";

  if (!projects.length) {
    projectListEl.innerHTML = `
      <div class="no-results-container">
        <p>Žádné projekty nenalezeny.</p>
      </div>
    `;
    return;
  }

  projectListEl.innerHTML = projects.map(p => {

    // 🔥 IMAGE ZE SUPABASE (image_path)
    const imagePath = p?.image_path;

    const image =
      !imagePath
        ? PLACEHOLDER_IMAGE
        : imagePath.startsWith("http")
          ? imagePath
          : STORAGE_BASE + imagePath.split("/").map(encodeURIComponent).join("/");

    return `
      <div class="project-card">
        <img 
          src="${image}" 
          alt="${p.title || "Project"}" 
          class="project-image"
          onerror="this.src='${PLACEHOLDER_IMAGE}'"
        />

        <h3>${p.title || "Bez názvu"}</h3>
        <p><strong>Žánr:</strong> ${p.genre || "N/A"}</p>
        <p><strong>Délka:</strong> ${p.duration_minutes || 0} min</p>
        <p class="description">${p.short_description || "Bez popisku"}</p>
        <p><strong>Rok:</strong> ${p.release_year || "N/A"}</p>
      </div>
    `;
  }).join("");
}
