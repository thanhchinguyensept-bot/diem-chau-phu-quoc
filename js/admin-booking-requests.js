(() => {
  const loadButton = document.getElementById('load-booking-requests');
  if (!loadButton) return;

  const keyInput = document.getElementById('booking-admin-key');
  const status = document.getElementById('booking-admin-status');
  const list = document.getElementById('booking-request-list');
  const navButton = document.getElementById('nav-tab-requests');
  const storageKey = 'diemchau.booking-admin-key';
  let adminKey = '';
  let knownIds = null;
  const unreadIds = new Set();

  const badge = document.createElement('span');
  badge.id = 'booking-request-unread-count';
  badge.className = 'hidden ml-auto px-1 rounded-full text-white text-[11px] font-bold items-center justify-center';
  badge.style.cssText = 'min-width:20px;height:20px;background:#b42318;color:#fff;border-radius:999px;padding:0 4px;';
  badge.setAttribute('aria-label', 'Yêu cầu đặt phòng mới');
  navButton?.appendChild(badge);

  const setStatus = (message) => { status.textContent = message; };
  const makeDetail = (label, value) => {
    const row = document.createElement('p');
    row.className = 'text-sm text-on-surface';
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(String(value || '—')));
    return row;
  };
  const updateBadge = () => {
    badge.textContent = String(unreadIds.size);
    badge.classList.toggle('hidden', unreadIds.size === 0);
    badge.classList.toggle('flex', unreadIds.size > 0);
  };
  const render = (rows) => {
    list.replaceChildren();
    rows.forEach((row) => {
      const card = document.createElement('article');
      card.className = 'bg-white border rounded-2xl p-space-md shadow-sm flex flex-col gap-1.5';
      card.style.borderColor = unreadIds.has(row.id) ? '#b42318' : '#d9dde0';
      card.setAttribute('aria-label', `${unreadIds.has(row.id) ? 'Yêu cầu mới: ' : ''}${row.id} ${row.name}`);

      const title = document.createElement('h3');
      title.className = 'font-headline-sm text-headline-sm text-primary font-bold';
      title.textContent = `${row.id} · ${row.name}`;
      card.append(title);
      card.append(
        makeDetail('Gửi lúc', row.createdAt ? new Date(row.createdAt).toLocaleString('vi-VN', {timeZone:'Asia/Ho_Chi_Minh'}) : ''),
        makeDetail('Điện thoại', row.phone),
        makeDetail('Zalo nhận xác nhận', row.zaloPhone),
        makeDetail('Kênh liên hệ', row.contactMethod === 'zalo' ? 'Zalo' : 'Điện thoại'),
        makeDetail('Phòng yêu cầu', row.room === 'auto' ? 'Nhờ xếp phòng' : `Phòng ${row.room}`),
        makeDetail('Gói', row.mode === 'hourly' ? `${row.hours} giờ` : `${row.nights} đêm`),
        makeDetail('Nhận phòng', `${row.checkInDate} ${row.checkInTime}`),
        makeDetail('Trả phòng', row.checkOutDate || 'Theo số giờ'),
        makeDetail('Giá dự kiến', `${new Intl.NumberFormat('vi-VN').format(row.amount)}đ`),
        makeDetail('Số khách', row.guests),
        makeDetail('Ghi chú', row.note)
      );

      const call = document.createElement('a');
      call.href = `tel:${String(row.phone || '').replace(/\D/g, '')}`;
      call.className = 'mt-2 inline-flex w-fit px-3 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm';
      call.textContent = 'Gọi khách';
      card.append(call);
      list.append(card);
    });
  };

  const loadRequests = async ({silent = false} = {}) => {
    if (!adminKey || document.visibilityState === 'hidden') return;
    const gate = document.getElementById('admin-security-gate');
    if (gate && !gate.classList.contains('hidden')) return;
    if (!silent) {
      loadButton.disabled = true;
      setStatus('Đang tải yêu cầu…');
    }
    try {
      const response = await fetch('/api/booking-requests', {
        headers: {Authorization: `Bearer ${adminKey}`},
        cache: 'no-store'
      });
      const data = await response.json();
      if (response.status === 401) {
        adminKey = '';
        try { sessionStorage.removeItem(storageKey); } catch (_) {}
        keyInput.value = '';
        throw new Error('Khóa quản trị không đúng. Nhập lại khóa để tiếp tục.');
      }
      if (!response.ok || !data.success) throw new Error(data.message || 'Chưa tải được yêu cầu.');

      const rows = data.requests || [];
      const currentIds = new Set(rows.map((row) => row.id));
      const newRows = knownIds ? rows.filter((row) => !knownIds.has(row.id)) : [];
      newRows.forEach((row) => unreadIds.add(row.id));
      knownIds = currentIds;
      updateBadge();
      render(rows);

      if (newRows.length) setStatus(`Có ${newRows.length} yêu cầu đặt phòng mới. Danh sách tự làm mới mỗi 20 giây.`);
      else setStatus(rows.length ? `${rows.length} yêu cầu gần đây, mới nhất ở trên. Danh sách tự làm mới mỗi 20 giây.` : 'Chưa có yêu cầu nào. Danh sách sẽ tự làm mới mỗi 20 giây.');
    } catch (error) {
      setStatus(error.message || 'Chưa tải được yêu cầu.');
    } finally {
      if (!silent) loadButton.disabled = false;
    }
  };

  loadButton.addEventListener('click', () => {
    const value = keyInput.value.trim();
    if (!value) { setStatus('Vui lòng nhập khóa quản trị yêu cầu.'); keyInput.focus(); return; }
    adminKey = value;
    try { sessionStorage.setItem(storageKey, adminKey); } catch (_) {}
    knownIds = null;
    unreadIds.clear();
    updateBadge();
    loadRequests();
  });
  keyInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); loadButton.click(); }
  });
  navButton?.addEventListener('click', () => {
    unreadIds.clear();
    updateBadge();
    loadRequests({silent:true});
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadRequests({silent:true});
  });

  try {
    adminKey = sessionStorage.getItem(storageKey) || '';
    if (adminKey) {
      keyInput.value = adminKey;
      loadRequests();
    }
  } catch (_) {}
  window.setInterval(() => loadRequests({silent:true}), 20000);
})();
