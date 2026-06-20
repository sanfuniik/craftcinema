const API_URL =
  "https://ghaiizikzetdoepigdvs.supabase.co/functions/v1/get-news";

const listEl = document.getElementById("news-list");

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

async function loadNews() {
  if (!listEl) {
    return;
  }

  listEl.innerHTML = '<p class="loading">Načítám novinky...</p>';

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${raw.slice(0, 160)}`);
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error("Backend nevrátil platný JSON.");
    }

    const news = extractNewsArray(payload);
    renderNews(news);
  } catch (error) {
    console.error("NEWS LOAD ERROR:", error);
    listEl.innerHTML = '<p class="loading error">Nepodařilo se načíst novinky.</p>';
  }
}

function extractNewsArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.news)) {
    return payload.news;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

function renderNews(news) {
  if (!news.length) {
    listEl.innerHTML = '<p class="loading">Žádné novinky.</p>';
    return;
  }

  listEl.innerHTML = news
    .map((item) => {
      const title = escapeHtml(item.title || "Bez názvu");
      const description = escapeHtml(item.description || "");
      const author = escapeHtml(item.author || "Unknown");
      const updateNumber = item.update_number ?? "";
      const createdAt = formatDate(item.created_at);

      return `
        <article class="news-card">
          <div class="news-top">
            <span class="news-meta">Update ${escapeHtml(String(updateNumber))}</span>
            <span class="news-meta">${author}</span>
          </div>

          <div class="news-title">${title}</div>

          <div class="news-desc">${description}</div>

          <div class="news-meta-row">
            ${createdAt ? `<span class="news-date">${escapeHtml(createdAt)}</span>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
