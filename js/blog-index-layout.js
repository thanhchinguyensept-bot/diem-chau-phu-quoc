(() => {
  async function initBlogIndex() {
    const grid = document.getElementById('blog-post-grid');
    const featured = document.getElementById('blog-featured-card');
    const filters = document.getElementById('blog-category-filters');
    const search = document.getElementById('blog-search-input');
    const searchButton = document.getElementById('blog-search-button');
    const emptyState = document.getElementById('blog-empty-state');
    const resultCount = document.getElementById('blog-result-count');
    if (!grid || !featured || !filters || !search) return;
    let cmsStatus = document.getElementById('blog-cms-status');
    if (!cmsStatus) {
      cmsStatus = document.createElement('p');
      cmsStatus.id = 'blog-cms-status';
      cmsStatus.className = 'hidden text-sm text-text-muted mb-4';
      cmsStatus.setAttribute('role','status');
      cmsStatus.setAttribute('aria-live','polite');
      grid.before(cmsStatus);
    }

    try {
      const response = await fetch('/api/blog-posts', {cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      {
        const data = await response.json();
        if (!Array.isArray(data.posts)) throw new Error('Blog API returned an invalid response');
        for (const slug of data.hiddenSlugs || []) {
          const hiddenPath = `/blog/${encodeURIComponent(slug)}`;
          Array.from(grid.querySelectorAll('a.blog-card-link')).find(link => new URL(link.href, location.origin).pathname.replace(/\/$/,'') === hiddenPath)?.closest('.blog-card')?.remove();
        }
        for (const post of data.posts || []) {
          const path = `/blog/${encodeURIComponent(post.slug)}`;
          const existing = Array.from(grid.querySelectorAll('a.blog-card-link')).find(link => new URL(link.href, location.origin).pathname.replace(/\/$/,'') === path);
          let card = existing?.closest('.blog-card');
          if (!card) {
            card = document.createElement('article');
            card.className = 'blog-card rounded-2xl bg-surface-container-lowest shadow-sm';
            const link = document.createElement('a'); link.className = 'blog-card-link'; link.href = path;
            const image = document.createElement('img'); image.className = 'blog-card-cover'; image.loading = 'lazy'; image.src = '/images/blog/phu-quoc-toan-canh-duong-dong-640.jpg';
            const body = document.createElement('div'); body.className = 'p-6';
            const category = document.createElement('p'); category.className = 'text-secondary text-sm font-semibold mb-2';
            const heading = document.createElement('h2'); heading.className = 'text-xl text-primary font-bold mb-3';
            const description = document.createElement('p');
            body.append(category,heading,description); link.append(image,body); card.append(link); grid.prepend(card);
          }
          const link = card.querySelector('a.blog-card-link');
          const image = link.querySelector('img');
          const body = link.querySelector('div');
          const heading = link.querySelector('h2');
          const paragraphs = body.querySelectorAll('p');
          link.href = path;
          heading.textContent = post.title;
          heading.id = `blog-title-${post.slug}`;
          link.setAttribute('aria-labelledby', heading.id);
          paragraphs[0].textContent = post.category || 'Cẩm Nang Du Lịch';
          if (paragraphs[1]) paragraphs[1].textContent = post.description || '';
          else { const description = document.createElement('p'); description.textContent = post.description || ''; body.append(description); }
          if (post.image) image.src = post.image;
          image.alt = post.title;
        }
      }
      cmsStatus.classList.add('hidden');
      cmsStatus.textContent = '';
    } catch (error) {
      console.warn('Could not load Admin blog posts:',error);
      cmsStatus.textContent = 'Chưa tải được bài mới từ hệ thống. Các bài viết hiện có vẫn được hiển thị.';
      cmsStatus.classList.remove('hidden');
    }

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
