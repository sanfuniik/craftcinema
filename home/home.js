document.addEventListener("DOMContentLoaded", async () => {

  // HERO IMAGE
  const heroImg = document.getElementById("hero-img");
  if (heroImg) {
    if (heroImg.complete) {
      heroImg.classList.add("visible");
    } else {
      heroImg.addEventListener("load", () => {
        heroImg.classList.add("visible");
      });
    }
  }

  // REVEAL ANIMACE
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    }
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // NEWS
  const container = document.getElementById("news-list");
  if (!container) return;

  async function loadNews() {
    try {
      const res = await fetch(
        "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-news"
      );

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const raw = await res.text();

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Invalid JSON");
      }

      const news = Array.isArray(data)
        ? data
        : data.data || data.news || [];

      container.innerHTML = "";

      if (!news.length) {
        container.textContent = "Žádné novinky.";
        return;
      }

      for (const item of news.slice(0, 5)) {

        const el = document.createElement("a");
        el.className = "home-news-item";

        // link na detail
        el.href = `/novinky/`;

        const title = document.createElement("div");
        title.className = "home-news-title";
        title.textContent = item.title || "Bez názvu";

        const update = document.createElement("div");
        update.className = "home-news-update";
        update.textContent = item.update_number ?? "";

        el.appendChild(title);
        el.appendChild(update);

        container.appendChild(el);
      }

    } catch (err) {
      container.textContent = "Nepodařilo se načíst novinky.";
    }
  }

  loadNews();
});
