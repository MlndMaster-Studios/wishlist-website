(() => {
  const search = document.getElementById('search');
  const filterStars = document.getElementById('filterStars');
  const copyLinksBtn = document.getElementById('copyLinks');
  const clearPurchasedBtn = document.getElementById('clearPurchased');

  const groups = Array.from(document.querySelectorAll('.group'));
  const STORAGE_KEY = 'wishlist_purchased_v2';

  let purchased = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  function getId(el) {
    return el.querySelector('h3').innerText.trim();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased));
  }

  function refreshPurchased() {
    document.querySelectorAll('.wish').forEach(el => {
      el.classList.toggle('purchased', !!purchased[getId(el)]);
    });
  }

  function applyFilters() {
    const q = search.value.toLowerCase();
    const star = filterStars.value;

    groups.forEach(group => {
      const items = Array.from(group.querySelectorAll('.wish'));
      let visibleCount = 0;

      items.forEach(el => {
        const matchesText = el.innerText.toLowerCase().includes(q);
        const matchesStars =
          star === 'all' || el.dataset.stars === star;

        const show = matchesText && matchesStars;
        el.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      group.style.display = visibleCount ? '' : 'none';
    });
  }

  document.querySelectorAll('.wish').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.mark-purchased')) return;
      const link = el.dataset.link;
      if (link) window.open(link, '_blank');
    });

    el.querySelector('.mark-purchased').addEventListener('click', e => {
      e.stopPropagation();
      const id = getId(el);
      purchased[id] = !purchased[id];
      save();
      refreshPurchased();
    });
  });

  copyLinksBtn.addEventListener('click', async () => {
    const visible = Array.from(document.querySelectorAll('.wish'))
      .filter(el => el.style.display !== 'none');

    const text = visible
      .map(el => `${getId(el)} — ${el.dataset.link || '[no link]'}`)
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
