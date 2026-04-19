const API_URL =
  "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-news";

const listEl = document.getElementById("news-list");

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

async function loadNews() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    console.log("NEWS API:", json);

    if (!json?.success || !Array.isArray(json.data)) {
      throw new Error("API error");
    }

    renderNews(json.data);
  } catch (err) {
    console.error(err);
    listEl.innerHTML = "<p>Chyba při načítání novinek</p>";
  }
}

function renderNews(news) {
  if (!news.length) {
    listEl.innerHTML = "<p>Žádné novinky</p>";
    return;
  }

  listEl.innerHTML = news
    .map((n) => {
      return `
        <article class="news-card">
          <div class="news-top">
            <span class="news-meta">Update ${n.update_number}</span>
            <span class="news-meta">${n.author || "Unknown"}</span>
          </div>

          <div class="news-title">${n.title}</div>

          <div class="news-desc">${n.description}</div>
        </article>
      `;
    })
    .join("");
}
