(() => {
  const button = document.getElementById('load-booking-requests');
  if (!button) return;
  const keyInput = document.getElementById('booking-admin-key');
  const status = document.getElementById('booking-admin-status');
  const list = document.getElementById('booking-request-list');
  const p = (text) => { const el = document.createElement('p'); el.textContent = text; return el; };
  const detail = (label, value) => { const el = document.createElement('div'); const strong=document.createElement('strong'); strong.textContent=label+': ';el.append(strong,document.createTextNode(String(value || '—')));return el; };
  button.addEventListener('click', async () => {
    if (!keyInput.value) {status.textContent='Vui lòng nhập khóa quản trị yêu cầu.';keyInput.focus();return;}
    button.disabled=true;status.textContent='Đang tải yêu cầu…';list.replaceChildren();
    try {
      const response = await fetch('/api/booking-requests',{headers:{Authorization:`Bearer ${keyInput.value}`},cache:'no-store'});
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(response.status===401?'Khóa quản trị không đúng.':'Chưa tải được yêu cầu. Kiểm tra cấu hình Redis.');
      const rows = data.requests || [];
      status.textContent=rows.length ? `${rows.length} yêu cầu gần đây, mới nhất ở trên.` : 'Chưa có yêu cầu nào.';
      rows.forEach(row => {
        const card=document.createElement('article');card.style.cssText='background:#fff;border:1px solid #d9dde0;border-radius:12px;padding:16px;display:grid;gap:5px';
        const title=document.createElement('h3');title.textContent=`${row.id} · ${row.name}`;title.style.cssText='font-weight:700;color:#1b3a4b;margin:0';card.append(title);
        card.append(detail('Gửi lúc',row.createdAt ? new Date(row.createdAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}) : ''),detail('Điện thoại',row.phone),detail('Kênh liên hệ',row.contactMethod==='zalo'?'Zalo':'Điện thoại'),detail('Phòng yêu cầu',row.room==='auto'?'Nhờ xếp phòng':`Phòng ${row.room}`),detail('Gói',row.mode==='hourly'?`${row.hours} giờ`:`${row.nights} đêm`),detail('Nhận phòng',`${row.checkInDate} ${row.checkInTime}`),detail('Trả phòng',row.checkOutDate||'Theo số giờ'),detail('Giá dự kiến',`${new Intl.NumberFormat('vi-VN').format(row.amount)}đ`),detail('Số khách',row.guests),detail('Ghi chú',row.note));
        const call=document.createElement('a');call.href=`tel:${row.phone}`;call.textContent='Gọi khách';call.style.cssText='font-weight:700;color:#1b3a4b';card.append(call);
        list.append(card);
      });
    } catch(error) {status.textContent=error.message || 'Chưa tải được yêu cầu.';}
    finally {button.disabled=false;}
  });
})();
