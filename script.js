(() => {
  const items = Array.from(document.querySelectorAll('.wish'));

  const search = document.getElementById('search');
  const filterStars = document.getElementById('filterStars');
  const copyLinksBtn = document.getElementById('copyLinks');
  const clearPurchasedBtn = document.getElementById('clearPurchased');

  const STORAGE_KEY = 'wishlist_purchased_v1';

  let purchased = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  function getId(el) {
    return el.querySelector('h3').innerText.trim();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased));
  }

  function refreshPurchased() {
    items.forEach(el => {
      const id = getId(el);
      el.classList.toggle('purchased', !!purchased[id]);
    });
  }

  function applyFilters() {
    const q = search.value.toLowerCase();
    const star = filterStars.value;

    items.forEach(el => {
      const matchesText =
        el.innerText.toLowerCase().includes(q);

      const matchesStars =
        star === 'all' || el.dataset.stars === star;

      el.style.display = matchesText && matchesStars ? '' : 'none';
    });
  }

  // Card click = open link
  items.forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.mark-purchased')) return;
      const link = el.dataset.link;
      if (link) window.open(link, '_blank');
    });

    const btn = el.querySelector('.mark-purchased');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = getId(el);
      purchased[id] = !purchased[id];
      save();
      refreshPurchased();
    });
  });

  copyLinksBtn.addEventListener('click', async () => {
    const visible = items.filter(i => i.style.display !== 'none');
    const text = visible
      .map(i => `${getId(i)} — ${i.dataset.link || '[no link]'}`)
      .join('\n');

    await navigator.clipboard.writeText(text);
    copyLinksBtn.textContent = 'Copied!';
    setTimeout(() => (copyLinksBtn.textContent = 'Copy visible links'), 1200);
  });

  clearPurchasedBtn.addEventListener('click', () => {
    if (!confirm('Clear all purchased marks?')) return;
    purchased = {};
    save();
    refreshPurchased();
  });

  search.addEventListener('input', applyFilters);
  filterStars.addEventListener('change', applyFilters);

  refreshPurchased();
  applyFilters();
})();
