(() => {
  function initBlogIndex() {
    const grid = document.getElementById('blog-post-grid');
    const featured = document.getElementById('blog-featured-card');
    const filters = document.getElementById('blog-category-filters');
    const search = document.getElementById('blog-search-input');
    const searchButton = document.getElementById('blog-search-button');
    const emptyState = document.getElementById('blog-empty-state');
    const resultCount = document.getElementById('blog-result-count');
    if (!grid || !featured || !filters || !search) return;

    const cards = Array.from(grid.querySelectorAll(':scope > .blog-card'));
    if (!cards.length) return;

    const featuredIndex = cards.findIndex(card => card.querySelector('a.blog-card-link')?.getAttribute('href') === '/blog/thue-phong-theo-gio-duong-dong');
    const featuredCard = featuredIndex >= 0 ? cards.splice(featuredIndex, 1)[0] : cards.shift();
    featuredCard.classList.add('blog-featured-post');
    const featuredImage = featuredCard.querySelector('img');
    if (featuredImage) {
      featuredImage.loading = 'eager';
      featuredImage.fetchPriority = 'high';
    }
    featured.append(featuredCard);

    const allCards = [featuredCard, ...cards];
    function categoryGroup(category) {
      const value = category.toLocaleLowerCase('vi');
      if (value.includes('ăn uống')) return 'Ăn uống';
      if (value.includes('di chuyển') || value.includes('chỉ đường')) return 'Di chuyển';
      if (value.includes('lưu trú') || value.includes('phòng nghỉ') || value.includes('đặt phòng') || value.includes('tạm ngưng')) return 'Lưu trú';
      if (value.includes('lịch trình') || value.includes('chuẩn bị')) return 'Lịch trình';
      return 'Khám phá Phú Quốc';
    }
    const categories = [...new Set(allCards.map(card => {
      const label = card.querySelector('.blog-card-link > div > p:first-child')?.textContent.trim() || '';
      return categoryGroup(label);
    }).filter(Boolean))];
    const buttons = [];
    const filterValues = [['all', 'Tất cả'], ...categories.map(category => [category, category])];
    for (const [value, label] of filterValues) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'blog-category-button';
      button.textContent = label;
      button.dataset.category = value;
      button.setAttribute('aria-pressed', value === 'all' ? 'true' : 'false');
      if (value === 'all') button.classList.add('is-active');
      filters.append(button);
      buttons.push(button);
    }

    let selectedCategory = 'all';
    function filterPosts() {
      const query = search.value.trim().toLocaleLowerCase('vi');
      let visibleCount = 0;
      for (const card of allCards) {
        const category = card.querySelector('.blog-card-link > div > p:first-child')?.textContent.trim() || '';
        const matchesCategory = selectedCategory === 'all' || categoryGroup(category) === selectedCategory;
        const matchesQuery = !query || card.textContent.toLocaleLowerCase('vi').includes(query);
        const visible = matchesCategory && matchesQuery;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      }
      emptyState.hidden = visibleCount !== 0;
      resultCount.textContent = query || selectedCategory !== 'all' ? `${visibleCount} bài viết` : `${allCards.length} bài viết`;
    }

    filters.addEventListener('click', event => {
      const button = event.target.closest('button[data-category]');
      if (!button) return;
      selectedCategory = button.dataset.category;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      filterPosts();
    });
    search.addEventListener('input', filterPosts);
    searchButton?.addEventListener('click', filterPosts);
    search.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        filterPosts();
      }
    });
    filterPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogIndex, { once: true });
  } else {
    initBlogIndex();
  }
})();
