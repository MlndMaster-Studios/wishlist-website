(() => {
  const items = Array.from(document.querySelectorAll('.wish'));

  const searchInput = document.getElementById('search');
  const filterStars = document.getElementById('filterStars');
  const toggleVIP = document.getElementById('toggleVIP');
  const vipGroup = document.getElementById('vipGroup');

  const STORAGE_KEY = 'liam_wishlist_purchased_v2';

  function loadPurchased() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function savePurchased(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }

  let purchasedMap = loadPurchased();

  function getItemId(el) {
    return el.dataset.id;
  }

  function refreshPurchased() {
    items.forEach(el => {
      const id = getItemId(el);
      el.classList.toggle('purchased', !!purchasedMap[id]);
    });
  }

  items.forEach(el => {
    const btn = document.createElement('button');
    btn.className = 'mark-purchased';
    btn.textContent = '✓';
    el.querySelector('.wish-actions').appendChild(btn);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = getItemId(el);
      purchasedMap[id] = !purchasedMap[id];
      savePurchased(purchasedMap);
      refreshPurchased();
    });

    el.addEventListener('dblclick', () => {
      const id = getItemId(el);
      purchasedMap[id] = !purchasedMap[id];
      savePurchased(purchasedMap);
      refreshPurchased();
    });

    el.addEventListener('click', e => {
      if (e.target.closest('.mark-purchased')) return;
      const link = el.dataset.link;
      if (link && link !== '#') window.open(link, '_blank', 'noopener');
    });
  });

  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const minStars = filterStars.value === 'all' ? 0 : Number(filterStars.value);

    items.forEach(el => {
      const stars = Number(el.dataset.stars);
      const text = el.innerText.toLowerCase();
      el.style.display =
        stars >= minStars && text.includes(query) ? '' : 'none';
    });
  }

  function toggleVip() {
    const hidden = vipGroup.hasAttribute('hidden');
    vipGroup.toggleAttribute('hidden');
    toggleVIP.textContent = hidden ? 'Hide VIP list' : 'Show VIP list';
  }

  searchInput.addEventListener('input', applyFilters);
  filterStars.addEventListener('change', applyFilters);
  toggleVIP.addEventListener('click', toggleVip);

  refreshPurchased();
  applyFilters();
})();
