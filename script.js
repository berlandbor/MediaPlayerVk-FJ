const playlistContainer = document.getElementById("playlist");
const clearDbBtn = document.getElementById("clearDbBtn");
const categoryFilter = document.getElementById("categoryFilter");
const reloadBtn = document.getElementById('reloadPlaylistBtn');
const STORAGE_KEY = "vk_playlist";
let currentPlaylist = [];

// --- Загрузка плейлиста при старте ---
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      currentPlaylist = JSON.parse(saved);
      updateFilterOptions(currentPlaylist);
      renderPlaylist(currentPlaylist);
    } catch (e) {
      console.warn("Ошибка чтения localStorage:", e);
      currentPlaylist = [];
      updateFilterOptions([]);
      renderPlaylist([]);
    }
  } else {
    fetch("playlist-vk.json") // Используй только нижний регистр!
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

// --- Кнопка очистки плейлиста ---
clearDbBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  currentPlaylist = [];
  playlistContainer.innerHTML = "<p>📭 Плейлист очищен.</p>";
  updateFilterOptions([]);
});

// --- Кнопка загрузки плейлиста ---
reloadBtn.addEventListener('click', () => {
  fetch('playlist-vk.json')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      currentPlaylist = data;
      renderPlaylist(data);
      updateFilterOptions(data);
      alert('Плейлист обновлён!');
    })
    .catch(() => alert('Ошибка загрузки плейлиста!'));
});

// --- Фильтр по категориям ---
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

// --- Модальное окно ---
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeModal = document.getElementById('closeModal');
aboutBtn.addEventListener('click', () => {
  aboutModal.style.display = 'flex';
});
closeModal.addEventListener('click', () => {
  aboutModal.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === aboutModal) aboutModal.style.display = 'none';
});