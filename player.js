function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const vk_oid = getQueryParam('vk_oid');
const vk_id = getQueryParam('vk_id');
const vk_hash = getQueryParam('vk_hash');

const mediaTitle = document.getElementById('mediaTitle');
const mediaCategory = document.getElementById('mediaCategory');
const mediaPoster = document.getElementById('mediaPoster');
const mediaDescription = document.getElementById('mediaDescription');
const playerContainer = document.getElementById('player-container');

if (vk_oid && vk_id && vk_hash) {
  const vk_url = `https://vk.com/video_ext.php?oid=${vk_oid}&id=${vk_id}&hash=${vk_hash}`;
  playerContainer.innerHTML = `
    <div class="video-responsive">
  <iframe src="${vk_url}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
    </div>`;

  // Получаем инфо из localStorage
  const playlistRaw = localStorage.getItem("vk_playlist");
  if (playlistRaw) {
    try {
      const playlist = JSON.parse(playlistRaw);
      const media = playlist.find(item =>
        item.vk_oid === vk_oid && item.vk_id === vk_id && item.vk_hash === vk_hash
      );
      if (media) {
        mediaTitle.textContent = media.title || "Без названия";
        mediaCategory.textContent = media.category || "Без категории";
        mediaPoster.src = media.poster || "https://vk.com/images/video_placeholder.png";
        mediaDescription.textContent = media.description || "";
      } else {
        mediaTitle.textContent = "Видео не найдено в базе";
      }
    } catch (e) {
      console.warn("Ошибка чтения localStorage:", e);
    }
  }
} else {
  playerContainer.innerHTML = "<p>❌ Ошибка: некорректные параметры VK-видео</p>";
}