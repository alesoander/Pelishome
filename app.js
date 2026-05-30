const CATALOG_URL = './catalog.json';
const TV_QUERY = '?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true';

const form = document.getElementById('catalog-form');
const typeSelect = document.getElementById('type');
const tvFields = document.getElementById('tv-fields');
const catalogList = document.getElementById('catalog-list');
const player = document.getElementById('player');
const playerTitle = document.getElementById('player-title');
const tabs = Array.from(document.querySelectorAll('.tab'));
const downloadButton = document.getElementById('download-catalog');

let currentFilter = 'movie';
let catalog = [];

function toggleTvFields() {
  tvFields.classList.toggle('hidden', typeSelect.value !== 'tv');
}

function normalizeEntry(entry) {
  const normalized = {
    tmdbId: Number(entry.tmdbId),
    name: String(entry.name || '').trim(),
    type: entry.type === 'tv' ? 'tv' : 'movie',
    image: entry.image ? String(entry.image).trim() : '',
  };

  if (normalized.type === 'tv') {
    normalized.season = Number(entry.season) > 0 ? Number(entry.season) : 1;
    normalized.episode = Number(entry.episode) > 0 ? Number(entry.episode) : 1;
  }

  return normalized;
}

function getPlayerUrl(item) {
  if (item.type === 'tv') {
    return `https://www.vidking.net/embed/tv/${item.tmdbId}/${item.season || 1}/${item.episode || 1}${TV_QUERY}`;
  }

  return `https://www.vidking.net/embed/movie/${item.tmdbId}`;
}

function renderCatalog() {
  const filtered = catalog.filter((item) => item.type === currentFilter);
  catalogList.innerHTML = '';

  if (!filtered.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No hay contenidos para este tipo aún.';
    catalogList.appendChild(empty);
    return;
  }

  filtered.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'catalog-item';

    const img = document.createElement('img');
    img.alt = item.name;
    img.src = item.image || 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

    const content = document.createElement('div');

    const title = document.createElement('strong');
    title.textContent = item.name;

    const details = document.createElement('div');
    details.textContent = `TMDB: ${item.tmdbId}` + (item.type === 'tv' ? ` • T${item.season || 1}E${item.episode || 1}` : '');

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.textContent = 'Ver ahora';
    playButton.addEventListener('click', () => {
      player.src = getPlayerUrl(item);
      playerTitle.textContent = `Reproduciendo: ${item.name}`;
    });

    content.appendChild(title);
    content.appendChild(details);
    content.appendChild(playButton);

    li.appendChild(img);
    li.appendChild(content);
    catalogList.appendChild(li);
  });
}

function activateTab(type) {
  currentFilter = type;
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  renderCatalog();
}

function downloadCatalog() {
  const blob = new Blob([`${JSON.stringify(catalog, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'catalog.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadCatalog() {
  try {
    const response = await fetch(CATALOG_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Error loading catalog: ${response.status}`);
    }

    const data = await response.json();
    catalog = Array.isArray(data) ? data.map(normalizeEntry).filter((entry) => entry.tmdbId && entry.name) : [];
  } catch (error) {
    catalog = [];
  }

  renderCatalog();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const entry = normalizeEntry({
    tmdbId: formData.get('tmdbId'),
    name: formData.get('name'),
    type: formData.get('type'),
    image: formData.get('image'),
    season: formData.get('season'),
    episode: formData.get('episode'),
  });

  if (!entry.tmdbId || !entry.name) {
    return;
  }

  catalog.unshift(entry);
  activateTab(entry.type);
  form.reset();
  typeSelect.value = 'movie';
  toggleTvFields();
});

typeSelect.addEventListener('change', toggleTvFields);
tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.type));
});
downloadButton.addEventListener('click', downloadCatalog);

toggleTvFields();
loadCatalog();
