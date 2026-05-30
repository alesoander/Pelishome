const CATALOG_URL = './catalog.json';
const TV_QUERY = '?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true';
const FALLBACK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

const catalogList = document.getElementById('catalog-list');
const player = document.getElementById('player');
const playerTitle = document.getElementById('player-title');
const tabs = Array.from(document.querySelectorAll('.tab'));
const featuredTitle = document.getElementById('featured-title');
const featuredDescription = document.getElementById('featured-description');
const featuredPlayButton = document.getElementById('featured-play');
const featuredExploreButton = document.getElementById('featured-explore');
const goCatalogButton = document.getElementById('go-catalog');
const goPlayerButton = document.getElementById('go-player');
const catalogSection = document.getElementById('catalog-section');
const playerSection = document.getElementById('player-section');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

let currentFilter = 'movie';
let catalog = [];
let searchTerm = '';

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

function getFilteredCatalog() {
  return catalog.filter((item) => {
    if (item.type !== currentFilter) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    return item.name.toLowerCase().includes(searchTerm);
  });
}

function getFeaturedItem() {
  const filtered = getFilteredCatalog();
  return filtered[0] || catalog[0] || null;
}

function playItem(item) {
  if (!item) {
    return;
  }

  player.src = getPlayerUrl(item);
  playerTitle.textContent = `Reproduciendo: ${item.name}`;
  playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderFeatured() {
  const featured = getFeaturedItem();

  if (!featured) {
    featuredTitle.textContent = 'No hay contenido disponible';
    featuredDescription.textContent = 'Vuelve más tarde para encontrar contenido disponible.';
    featuredPlayButton.disabled = true;
    return;
  }

  const details = featured.type === 'tv' ? `Serie • T${featured.season || 1}E${featured.episode || 1}` : 'Película';
  featuredTitle.textContent = featured.name;
  featuredDescription.textContent = `${details} • Reproduce en un clic desde Pelishome.`;
  featuredPlayButton.disabled = false;
}

function createCard(item) {
  const li = document.createElement('li');
  li.className = 'catalog-card';

  const img = document.createElement('img');
  img.className = 'catalog-poster';
  img.alt = `Poster de ${item.name}`;
  img.src = item.image || FALLBACK_IMAGE;
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'catalog-overlay';

  const meta = document.createElement('div');
  meta.className = 'catalog-meta';

  const badge = document.createElement('span');
  badge.className = 'catalog-badge';
  badge.textContent = item.type === 'tv' ? 'Serie' : 'Película';

  const title = document.createElement('h3');
  title.textContent = item.name;

  const details = document.createElement('p');
  details.textContent = item.type === 'tv' ? `Serie • T${item.season || 1}E${item.episode || 1}` : 'Película';

  const playButton = document.createElement('button');
  playButton.className = 'card-play';
  playButton.type = 'button';
  playButton.textContent = 'Ver ahora';
  playButton.addEventListener('click', () => playItem(item));

  meta.appendChild(badge);
  meta.appendChild(title);
  meta.appendChild(details);

  const actions = document.createElement('div');
  actions.className = 'catalog-actions';
  actions.appendChild(playButton);
  meta.appendChild(actions);

  overlay.appendChild(meta);
  li.appendChild(img);
  li.appendChild(overlay);

  return li;
}

function renderCatalog() {
  const filtered = getFilteredCatalog();
  catalogList.innerHTML = '';

  if (!filtered.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = searchTerm
      ? `No encontramos coincidencias para "${searchTerm}".`
      : 'No hay contenidos disponibles en este filtro.';
    catalogList.appendChild(empty);
    renderFeatured();
    return;
  }

  filtered.forEach((item) => {
    catalogList.appendChild(createCard(item));
  });

  renderFeatured();
}

function activateTab(type) {
  currentFilter = type === 'tv' ? 'tv' : 'movie';
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.type === currentFilter);
  });
  renderCatalog();
}

function runSearch() {
  searchTerm = String(searchInput?.value || '').trim().toLowerCase();
  renderCatalog();
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

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.type));
});

featuredPlayButton.addEventListener('click', () => {
  playItem(getFeaturedItem());
});

featuredExploreButton.addEventListener('click', () => {
  catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

goCatalogButton.addEventListener('click', () => {
  catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

goPlayerButton.addEventListener('click', () => {
  playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

if (searchButton && searchInput) {
  searchButton.addEventListener('click', runSearch);

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      runSearch();
    }
  });
}

loadCatalog();
