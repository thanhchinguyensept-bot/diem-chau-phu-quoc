/** Trợ lý Nhà nghỉ Diễm Châu: thông tin phòng, giá và chỉ đường. */

(function () {
  'use strict';

  // Khởi tạo trạng thái chatbot
  const STORAGE_KEY_HISTORY = 'diemchau_chat_history';
  const HOTLINE_NUMBER = '0815 719 502';
  const ZALO_LINK = 'https://zalo.me/0815719502';

  // Dữ liệu tri thức nội bộ chuẩn hóa của Diễm Châu Phú Quốc
  const KNOWLEDGE_BASE = {
    vi: {
      greeting: "Xin chào! Em có thể giúp anh chị xem giá, hỏi phòng và tìm đường đến Nhà Nghỉ Diễm Châu.",
      placeholder: "Nhập câu hỏi (giá phòng, check-in, vị trí...)...",
      title: "Trợ Lý Ảo Diễm Châu",
      subtitle: "Thông tin phòng và nhận phòng",
      quick_chips: [
        { label: "💰 Bảng giá phòng", query: "Giá phòng tại Diễm Châu là bao nhiêu?" },
        { label: "🔑 Cách nhận phòng?", query: "Khi đến thì nhận phòng thế nào?" },
        { label: "🏨 Kiểm tra phòng trống", query: "Hiện tại còn phòng trống nào không?" },
        { label: "📍 Địa chỉ & Đường đi", query: "Địa chỉ nhà nghỉ ở đâu và đi đến như thế nào?" },
        { label: "📶 Tiện nghi phòng", query: "Phòng nghỉ có những tiện nghi gì?" },
        { label: "📞 Hotline hỗ trợ", query: "Số điện thoại hotline hoặc liên hệ khẩn cấp?" }
      ],
      ai_mode_badge_local: "AI Nội Bộ (Tức thì)",
      clear_history_tooltip: "Xóa đoạn chat",
      call_action: "Gọi nhà nghỉ",
      book_action: "Liên hệ đặt phòng",
      bot_typing: "Đang soạn câu trả lời..."
    },
    en: {
      greeting: "Welcome! I can help with rates, room enquiries and directions to Diem Chau Guesthouse.",
      placeholder: "Ask about rates, check-in, location...",
      title: "Diem Chau AI Assistant",
      subtitle: "Room and check-in information",
      quick_chips: [
        { label: "💰 Room Rates", query: "What are the room rates?" },
        { label: "🔑 How do I check in?", query: "How do I check in?" },
        { label: "🏨 Available Rooms", query: "Are there any available rooms right now?" },
        { label: "📍 Location & Directions", query: "Where is the motel located?" },
        { label: "📶 Amenities", query: "What amenities are included in the room?" },
        { label: "📞 Emergency Hotline", query: "What is your emergency contact number?" }
      ],
      ai_mode_badge_local: "Local Knowledge AI",
      clear_history_tooltip: "Clear chat history",
      call_action: "Call the guesthouse",
      book_action: "Booking enquiries",
      bot_typing: "Thinking..."
    }
  };

  // Lấy ngôn ngữ hiện tại
  function getCurrentLang() {
    return localStorage.getItem('diemchau_language') || 'vi';
  }

  // Xử lý logic NLP nội bộ thông minh dựa trên từ khóa & ngữ cảnh (Local Smart Rule Engine)
  function answerWithLocalKnowledge(query, lang) {
    const q = query.toLowerCase().trim();
    const isEn = lang === 'en';
    const booking = isEn
      ? `Call **${HOTLINE_NUMBER}** or [message us on Zalo](${ZALO_LINK}) to confirm availability and book. See the [booking page](/booking).`
      : `Gọi **${HOTLINE_NUMBER}** hoặc [nhắn Zalo](${ZALO_LINK}) để xác nhận phòng trống và đặt phòng. Xem [trang Đặt phòng](/booking).`;

    if (/check[ -]?in|nhận phòng|mã pin|mã số|smart pass|không lễ tân|tự động|mở cửa|khóa/.test(q)) {
      return isEn
        ? `Smart Pass is temporarily paused. Reception usually welcomes guests. If the desk is unattended, call **${HOTLINE_NUMBER}** or [message us on Zalo](${ZALO_LINK}) for help. The lobby has a room map.`
        : `Smart Pass đang tạm ngưng. Lễ tân thường có mặt để đón khách. Nếu quầy vắng, hãy gọi **${HOTLINE_NUMBER}** hoặc [nhắn Zalo](${ZALO_LINK}) để được hướng dẫn. Sơ đồ ở sảnh chỉ vị trí từng phòng.`;
    }

    if (/giá|bao nhiêu|rate|price|cost|tiền|chi phí/.test(q)) {
      return isEn
        ? `**Room rates:** 80,000 VND for 1 hour, 100,000 VND for 3 hours, 140,000 VND for 5 hours, or 200,000 VND overnight (noon to noon).\n\n${booking}`
        : `**Giá phòng:** 80.000đ/1 giờ, 100.000đ/3 giờ, 140.000đ/5 giờ hoặc 200.000đ/đêm (12h đến 12h hôm sau).\n\n${booking}`;
    }

    if (/ở đâu|địa chỉ|vị trí|đường|location|where|address|bản đồ|map/.test(q)) {
      return isEn
        ? `Diem Chau Guesthouse, Group 10, Quarter 10, Duong Dong, Phu Quoc. See [directions and contact details](/contact).`
        : `Nhà Nghỉ Diễm Châu, tổ 10, khu phố 10, Dương Đông, Phú Quốc. Xem [bản đồ và thông tin liên hệ](/contact).`;
    }

    if (/tiện nghi|tiện ích|wifi|máy lạnh|nước nóng|amenities|dịch vụ|tủ lạnh|tivi/.test(q)) {
      return isEn
        ? `See [rooms and photos](/rooms). For specific amenities, call **${HOTLINE_NUMBER}** or [message us on Zalo](${ZALO_LINK}).`
        : `Xem [các phòng và ảnh thực tế](/rooms). Để hỏi tiện nghi cụ thể, hãy gọi **${HOTLINE_NUMBER}** hoặc [nhắn Zalo](${ZALO_LINK}).`;
    }

    return booking;
  }

  // Parse markdown đơn giản sang HTML an toàn
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // In đậm **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // In nghiêng *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Link [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="underline font-semibold text-secondary hover:text-accent-hover" target="_self">$1</a>');
    // Đổi dấu xuống dòng thành <br>
    html = html.replace(/\n\n/g, '</p><p class="mt-2">');
    html = html.replace(/\n/g, '<br/>');

    return `<p>${html}</p>`;
  }

  // Lớp điều khiển giao diện Chatbot Widget
  class DiemChauChatbot {
    constructor() {
      this.isOpen = false;
      this.isTyping = false;
      this.currentLang = getCurrentLang();
      this.history = this.loadHistory();
      this.initUI();
      this.bindEvents();
    }

    loadHistory() {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY_HISTORY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading history:', e);
      }
      return [];
    }

    saveHistory() {
      try {
        sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
      } catch (e) {
        console.error('Error saving history:', e);
      }
    }

    initUI() {
      // Tránh duplicate nếu script được gọi 2 lần
      if (document.getElementById('diemchau-chatbot-container')) return;

      const container = document.createElement('div');
      container.id = 'diemchau-chatbot-container';
      container.className = 'fixed bottom-5 right-5 z-[99] font-sans select-none';

      container.innerHTML = `
        <!-- BONG BÓNG GỢI Ý CHÀO HỎI (Tooltip Badge) -->
        <div id="chatbot-teaser" class="hidden absolute bottom-16 right-0 mb-3 bg-surface-container-lowest text-on-surface px-4 py-3 rounded-2xl shadow-xl border border-secondary-container/40 max-w-xs transition-all duration-300 transform origin-bottom-right">
          <button id="chatbot-teaser-close" class="absolute -top-2 -left-2 w-5 h-5 bg-outline-variant hover:bg-status-danger text-white rounded-full flex items-center justify-center text-[10px] shadow transition-colors">✕</button>
          <div class="flex items-start gap-2.5">
            <span class="text-xl">👋</span>
            <div class="text-xs">
              <strong class="text-primary block font-semibold mb-0.5">Diễm Châu AI</strong>
              <span id="chatbot-teaser-text" class="text-text-muted leading-relaxed">Cần xem giá phòng hoặc hướng dẫn nhận phòng không ạ? Nhắn em nhé!</span>
            </div>
          </div>
        </div>

        <!-- NÚT FLOATING TRIGGER (Bong bóng chat) -->
        <button id="chatbot-toggle-btn" type="button" aria-label="Mở Trợ lý ảo AI" class="w-14 h-14 rounded-full bg-primary text-secondary-container hover:bg-primary-container hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(1,36,53,0.35)] flex items-center justify-center transition-all duration-300 relative group cursor-pointer border border-secondary-container/30">
          <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:rotate-12" id="chatbot-icon-open">smart_toy</span>
          <span class="material-symbols-outlined text-[28px] hidden" id="chatbot-icon-close">close</span>
          <!-- Chấm xanh Online Pulse -->
          <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-[#10B981] border-2 border-primary rounded-full">
            <span class="absolute inset-0 rounded-full bg-[#10B981] animate-ping opacity-75"></span>
          </span>
        </button>

        <!-- CỬA SỔ HỘP THOẠI CHATBOT -->
        <div id="chatbot-window" class="hidden fixed sm:absolute bottom-0 right-0 sm:bottom-16 sm:right-0 w-full sm:w-[390px] h-[92vh] sm:h-[560px] max-h-[640px] bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl border border-outline-variant/40 flex-col overflow-hidden transition-all duration-300 z-[100]">
          
          <!-- HEADER -->
          <div class="bg-primary text-on-primary px-4 py-3.5 flex items-center justify-between border-b border-secondary-container/20">
            <div class="flex items-center gap-3">
              <div class="relative w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-secondary-container border border-secondary-container/40">
                <span class="material-symbols-outlined text-[20px]">smart_toy</span>
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-primary"></span>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span id="chatbot-header-title" class="font-bold text-sm tracking-wide text-on-primary">Trợ Lý Ảo Diễm Châu</span>
                  <span id="chatbot-mode-badge" class="text-[9px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold uppercase">AI</span>
                </div>
                <span id="chatbot-header-subtitle" class="text-[11px] text-on-primary-container flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  Thông tin phòng và nhận phòng
                </span>
              </div>
            </div>

            <!-- Các nút công cụ Header -->
            <div class="flex items-center gap-1 text-on-primary-container">
              <button id="chatbot-btn-clear" type="button" title="Xóa lịch sử chat" class="w-8 h-8 rounded-lg hover:bg-white/10 hover:text-status-danger flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
              <button id="chatbot-btn-close-window" type="button" title="Thu nhỏ chat" class="w-8 h-8 rounded-lg hover:bg-white/10 hover:text-on-primary flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
              </button>
            </div>
          </div>

          <!-- BANNER PHÍM TẮT ĐẶT PHÒNG & HOTLINE NHANH -->
          <div class="bg-primary-container/40 px-3 py-1.5 flex items-center justify-between text-xs border-b border-outline-variant/20">
            <a href="/booking" class="inline-flex items-center gap-1 text-secondary-container hover:text-accent-hover font-semibold transition-colors">
              <span class="material-symbols-outlined text-[14px]">calendar_month</span>
              <span id="chatbot-quick-book">Hỏi phòng</span>
            </a>
            <a href="tel:0815719502" class="inline-flex items-center gap-1 text-on-primary hover:text-secondary-container transition-colors">
              <span class="material-symbols-outlined text-[14px] text-secondary-container">call</span>
              <span>0815 719 502</span>
            </a>
          </div>

          <!-- VÙNG TIN NHẮN (MESSAGE LOG) -->
          <div id="chatbot-messages" class="flex-1 p-3.5 overflow-y-auto space-y-3 bg-surface/50 text-xs text-on-surface leading-relaxed">
            <!-- Tin nhắn được chèn bằng JS -->
          </div>

          <!-- QUICK SUGGESTION CHIPS -->
          <div id="chatbot-chips-container" class="px-3 py-2 bg-surface-container-lowest border-t border-outline-variant/20 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <!-- Chips render bằng JS -->
          </div>

          <!-- INPUT KHUNG CHAT -->
          <div class="p-2.5 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center gap-2 shrink-0">
            <label for="chatbot-input" class="sr-only" id="chatbot-input-label">Câu hỏi của anh chị</label><input type="text" id="chatbot-input" placeholder="Hỏi giá, check-in, vị trí..." class="flex-1 bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" autocomplete="off"/>
            <button id="chatbot-send-btn" type="button" aria-label="Gửi tin nhắn" class="w-9 h-9 rounded-xl bg-primary text-secondary-container hover:bg-accent-hover hover:text-on-primary flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>

        </div>
      `;

      document.body.appendChild(container);

      // Hiển thị bóng chat chào mừng sau 3 giây nếu chưa từng mở chat
      setTimeout(() => {
        if (!this.isOpen && !sessionStorage.getItem('diemchau_teaser_dismissed')) {
          const teaser = document.getElementById('chatbot-teaser');
          if (teaser) teaser.classList.remove('hidden');
        }
      }, 3000);

      this.updateLanguageUI();
      this.renderMessages();
      this.renderChips();
    }

    bindEvents() {
      const toggleBtn = document.getElementById('chatbot-toggle-btn');
      const closeWindowBtn = document.getElementById('chatbot-btn-close-window');
      const teaserClose = document.getElementById('chatbot-teaser-close');
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send-btn');
      const clearBtn = document.getElementById('chatbot-btn-clear');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggleChat());
      }
      if (closeWindowBtn) {
        closeWindowBtn.addEventListener('click', () => this.closeChat());
      }
      if (teaserClose) {
        teaserClose.addEventListener('click', (e) => {
          e.stopPropagation();
          const teaser = document.getElementById('chatbot-teaser');
          if (teaser) teaser.classList.add('hidden');
          sessionStorage.setItem('diemchau_teaser_dismissed', 'true');
        });
      }
      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.handleSendMessage());
      }
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSendMessage();
          }
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm(this.currentLang === 'en' ? 'Clear all chat messages?' : 'Xóa toàn bộ cuộc trò chuyện?')) {
            this.history = [];
            this.saveHistory();
            this.renderMessages();
          }
        });
      }
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.isOpen) {
          this.closeChat();
          toggleBtn?.focus();
        }
      });

      // Lắng nghe sự kiện chuyển ngôn ngữ toàn trang từ common.js
      window.addEventListener('languageChanged', (e) => {
        this.currentLang = e.detail && e.detail.lang ? e.detail.lang : getCurrentLang();
        this.updateLanguageUI();
        this.renderChips();
        if (this.history.length === 0) {
          this.renderMessages();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      const win = document.getElementById('chatbot-window');
      const iconOpen = document.getElementById('chatbot-icon-open');
      const iconClose = document.getElementById('chatbot-icon-close');
      const teaser = document.getElementById('chatbot-teaser');

      if (win) {
        win.classList.remove('hidden');
        win.classList.add('flex');
      }
      if (iconOpen) iconOpen.classList.add('hidden');
      if (iconClose) iconClose.classList.remove('hidden');
      if (teaser) teaser.classList.add('hidden');
      sessionStorage.setItem('diemchau_teaser_dismissed', 'true');

      // Tự động focus input
      setTimeout(() => {
        const input = document.getElementById('chatbot-input');
        if (input && window.innerWidth > 640) input.focus();
        this.scrollToBottom();
      }, 100);
    }

    closeChat() {
      this.isOpen = false;
      const win = document.getElementById('chatbot-window');
      const iconOpen = document.getElementById('chatbot-icon-open');
      const iconClose = document.getElementById('chatbot-icon-close');

      if (win) {
        win.classList.add('hidden');
        win.classList.remove('flex');
      }
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    }

    updateLanguageUI() {
      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;
      const title = document.getElementById('chatbot-header-title');
      const subtitle = document.getElementById('chatbot-header-subtitle');
      const input = document.getElementById('chatbot-input');
      const modeBadge = document.getElementById('chatbot-mode-badge');
      const teaserText = document.getElementById('chatbot-teaser-text');
      const quickBook = document.getElementById('chatbot-quick-book');

      if (title) title.textContent = texts.title;
      if (subtitle) {
        subtitle.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> ${texts.subtitle}`;
      }
      if (input) input.placeholder = texts.placeholder;
      const label = document.getElementById('chatbot-input-label');
      if (label) label.textContent = this.currentLang === 'en' ? 'Your question' : 'Câu hỏi của anh chị';
      if (modeBadge) modeBadge.textContent = texts.ai_mode_badge_local;
      if (teaserText) {
        teaserText.textContent = this.currentLang === 'en'
          ? "Need room rates or check-in directions? Chat with me!"
          : "Cần xem giá phòng hoặc hướng dẫn nhận phòng không ạ? Nhắn em nhé!";
      }
      if (quickBook) quickBook.textContent = texts.book_action;
    }

    renderChips() {
      const container = document.getElementById('chatbot-chips-container');
      if (!container) return;
      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;
      container.innerHTML = '';

      texts.quick_chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'whitespace-nowrap px-2.5 py-1 rounded-full bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-primary font-medium text-[11px] transition-colors border border-outline-variant/30 shrink-0';
        btn.textContent = chip.label;
        btn.onclick = () => {
          this.sendMessage(chip.query);
        };
        container.appendChild(btn);
      });
    }

    renderMessages() {
      const container = document.getElementById('chatbot-messages');
      if (!container) return;
      container.innerHTML = '';

      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;

      // Nếu chưa có tin nhắn nào, render tin chào mặc định
      if (this.history.length === 0) {
        this.appendMessageToDOM('bot', texts.greeting, false);
      } else {
        this.history.forEach(msg => {
          this.appendMessageToDOM(msg.sender, msg.text, false);
        });
      }

      this.scrollToBottom();
    }

    appendMessageToDOM(sender, text, scroll = true) {
      const container = document.getElementById('chatbot-messages');
      if (!container) return;

      const isUser = sender === 'user';
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`;

      if (!isUser) {
        msgDiv.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-primary-container text-secondary-container flex items-center justify-center shrink-0 mb-1 border border-secondary-container/30">
            <span class="material-symbols-outlined text-[15px]">smart_toy</span>
          </div>
          <div class="max-w-[85%] bg-surface-container-lowest text-on-surface p-3 rounded-2xl rounded-bl-xs shadow-sm border border-outline-variant/30 leading-relaxed text-[12px]">
            ${formatMarkdown(text)}
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="max-w-[85%] bg-primary text-on-primary p-3 rounded-2xl rounded-br-xs shadow-sm leading-relaxed text-[12px]">
            ${formatMarkdown(text)}
          </div>
          <div class="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mb-1">
            <span class="material-symbols-outlined text-[15px]">person</span>
          </div>
        `;
      }

      container.appendChild(msgDiv);
      if (scroll) this.scrollToBottom();
    }

    showTypingIndicator() {
      const container = document.getElementById('chatbot-messages');
      if (!container || document.getElementById('chatbot-typing-bubble')) return;

      const texts = KNOWLEDGE_BASE[this.currentLang] || KNOWLEDGE_BASE.vi;
      const typingDiv = document.createElement('div');
      typingDiv.id = 'chatbot-typing-bubble';
      typingDiv.className = 'flex items-end gap-2 justify-start';
      typingDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-primary-container text-secondary-container flex items-center justify-center shrink-0 mb-1">
          <span class="material-symbols-outlined text-[15px]">smart_toy</span>
        </div>
        <div class="bg-surface-container-lowest text-text-muted px-3 py-2 rounded-2xl rounded-bl-xs shadow-sm border border-outline-variant/30 flex items-center gap-1.5 text-[11px]">
          <span class="inline-flex gap-1 items-center">
            <span class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-bounce" style="animation-delay: 300ms"></span>
          </span>
          <span class="ml-1">${texts.bot_typing}</span>
        </div>
      `;
      container.appendChild(typingDiv);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const indicator = document.getElementById('chatbot-typing-bubble');
      if (indicator) indicator.remove();
    }

    scrollToBottom() {
      const container = document.getElementById('chatbot-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }

    async handleSendMessage() {
      const input = document.getElementById('chatbot-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text || this.isTyping) return;
      input.value = '';
      await this.sendMessage(text);
    }

    async sendMessage(query) {
      if (this.isTyping) return;
      this.isTyping = true;

      // 1. Thêm tin nhắn người dùng
      this.history.push({ sender: 'user', text: query, time: Date.now() });
      this.saveHistory();
      this.appendMessageToDOM('user', query);
      this.showTypingIndicator();

      const sendBtn = document.getElementById('chatbot-send-btn');
      if (sendBtn) sendBtn.disabled = true;

      let answer = '';
      try {
        answer = answerWithLocalKnowledge(query, this.currentLang);
      } catch (err) {
        console.error('Bot response error:', err);
        answer = answerWithLocalKnowledge(query, this.currentLang);
      } finally {
        this.hideTypingIndicator();
        this.isTyping = false;
        if (sendBtn) sendBtn.disabled = false;
      }

      // 3. Thêm tin nhắn bot
      this.history.push({ sender: 'bot', text: answer, time: Date.now() });
      this.saveHistory();
      this.appendMessageToDOM('bot', answer);
    }
  }

  // Khởi tạo Chatbot khi tài liệu tải xong
  function startChatbot() {
    if (!window.diemChauChatbot) {
      window.diemChauChatbot = new DiemChauChatbot();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startChatbot);
  } else {
    startChatbot();
  }
})();
