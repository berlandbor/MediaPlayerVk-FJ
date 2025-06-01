const playlistContainer = document.getElementById("playlist");
const clearDbBtn = document.getElementById("clearDbBtn");
const categoryFilter = document.getElementById("categoryFilter");
const STORAGE_KEY = "vk_playlist";
let currentPlaylist = [];

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      currentPlaylist = JSON.parse(saved);
      updateFilterOptions(currentPlaylist);
      renderPlaylist(currentPlaylist);
    } catch (e) {
      console.warn("Ошибка чтения localStorage:", e);
    }
  } else {
    fetch("Playlist-vk.json")
      .then(res => res.json())
      .then(data => {
        currentPlaylist = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        updateFilterOptions(data);
        renderPlaylist(data);
      })
      .catch(err => {
        console.error("Ошибка загрузки плейлиста:", err);
        playlistContainer.innerHTML = "<p>❌ Не удалось загрузить плейлист.</p>";
      });
  }
});

clearDbBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  currentPlaylist = [];
  playlistContainer.innerHTML = "<p>📭 Плейлист очищен.</p>";
  categoryFilter.innerHTML = `<option value="all">Все категории</option>`;
});

categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;
  if (selected === "all") {
    renderPlaylist(currentPlaylist);
  } else {
    const filtered = currentPlaylist.filter(item => item.category === selected);
    renderPlaylist(filtered);
  }
});

function renderPlaylist(items) {
  playlistContainer.innerHTML = "";
  items.forEach(item => {
    const { title, poster, category, vk_oid, vk_id, vk_hash } = item;
    const imageSrc = poster || "https://vk.com/images/video_placeholder.png";

    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
      <img src="${imageSrc}" />
      <div class="tile-title">${title}</div>
      <div class="tile-category">📁 ${category || "Без категории"}</div>
    `;

    tile.addEventListener("click", () => {
      // Передаем VK параметры в player.html
      const vkParams = `vk_oid=${encodeURIComponent(vk_oid)}&vk_id=${encodeURIComponent(vk_id)}&vk_hash=${encodeURIComponent(vk_hash)}`;
      window.open(`player.html?${vkParams}`, "_blank");
    });

    playlistContainer.appendChild(tile);
  });
}

function updateFilterOptions(items) {
  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
  categoryFilter.innerHTML = `<option value="all">Все категории</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}