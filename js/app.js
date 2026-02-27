// ============================================
// Lord'ai Ultimate - Main Application v3.0
// التطبيق الرئيسي الشامل
// ============================================

const App = {
  // ==================== الحالة ====================
  currentPage: 'home',
  currentUser: null,
  token: null,
  characters: [],
  conversations: [],
  currentChat: null,
  isTyping: false,
  favorites: [],
  searchQuery: '',
  filterCategory: 'all',
  filterType: 'all',
  sortBy: 'popular',
  credits: 100,
  theme: 'dark',
  sidebarOpen: false,
  showMemoryPanel: false,

  // ==================== الشخصيات الافتراضية ====================
  defaultCharacters: [
    {
      id: 1, name: 'Luna', description: 'A mystical AI guide with deep knowledge of the cosmos and ancient wisdom. She speaks in riddles and metaphors.',
      avatar: '🌙', personality: 'mysterious', traits: ['Mystical', 'Wise', 'Enigmatic'],
      skills: ['Astrology', 'Philosophy', 'Meditation'], isPublic: true, creator: 'System',
      category: 'lifestyle', greeting: "Greetings, traveler. The stars have whispered of your arrival... What knowledge do you seek? ✨"
    },
    {
      id: 2, name: 'Max', description: 'A cheerful and witty AI companion who loves jokes, games, and making people smile. Always ready for fun!',
      avatar: '😎', personality: 'funny', traits: ['Humorous', 'Energetic', 'Creative'],
      skills: ['Comedy', 'Gaming', 'Storytelling'], isPublic: true, creator: 'System',
      category: 'entertainment', greeting: "Hey there! 🎉 Ready for some fun? I've got jokes, stories, and terrible puns!"
    },
    {
      id: 3, name: 'Sophia', description: 'A brilliant AI scientist who can explain complex topics in simple, understandable terms.',
      avatar: '👩‍🔬', personality: 'wise', traits: ['Intelligent', 'Patient', 'Analytical'],
      skills: ['Science', 'Research', 'Teaching'], isPublic: true, creator: 'System',
      category: 'education', greeting: "Hello! I'm Sophia. Whether it's quantum physics or cooking chemistry, let's explore together! 🔬"
    },
    {
      id: 4, name: 'Aria', description: 'A warm and caring AI friend who listens deeply and offers thoughtful, heartfelt advice.',
      avatar: '💝', personality: 'caring', traits: ['Empathetic', 'Caring', 'Thoughtful'],
      skills: ['Counseling', 'Poetry', 'Music'], isPublic: true, creator: 'System',
      category: 'lifestyle', greeting: "Hi there! 💕 I'm so happy to meet you. Tell me about yourself!"
    },
    {
      id: 5, name: 'Atlas', description: 'A powerful AI warrior and strategist from a fantasy realm. Brave, honorable, and wise in battle.',
      avatar: '⚔️', personality: 'mysterious', traits: ['Brave', 'Strategic', 'Honorable'],
      skills: ['Strategy', 'Combat', 'Leadership'], isPublic: true, creator: 'System',
      category: 'entertainment', greeting: "Hail, adventurer! I am Atlas, guardian of the realm. What quest brings you here? ⚔️"
    },
    {
      id: 6, name: 'Pixel', description: 'A tech-savvy AI assistant who knows everything about coding, AI, and modern technology.',
      avatar: '🤖', personality: 'professional', traits: ['Technical', 'Helpful', 'Modern'],
      skills: ['Programming', 'AI/ML', 'Web Dev'], isPublic: true, creator: 'System',
      category: 'technology', greeting: "Hey! 👋 I'm Pixel, your AI tech buddy! Need help with code or AI? Let's go! 💻"
    },
  ],

  // ==================== التهيئة ====================
  init() {
    I18N.init();
    this.loadState();
    this.characters = [...this.defaultCharacters, ...AIEngine.arabicCharacters, ...this.getCustomCharacters()];
    this.conversations = this.getConversations();
    this.favorites = this.getFavorites();
    this.credits = parseInt(localStorage.getItem('lordai_credits') || '100');
    this.theme = localStorage.getItem('lordai_theme') || 'dark';
    this.render();
  },

  // ==================== إدارة الحالة ====================
  loadState() {
    this.token = localStorage.getItem('lordai_token');
    const u = localStorage.getItem('lordai_user');
    if (u) this.currentUser = JSON.parse(u);
  },

  saveUser(user, token) {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem('lordai_user', JSON.stringify(user));
    localStorage.setItem('lordai_token', token);
  },

  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('lordai_user');
    localStorage.removeItem('lordai_token');
    this.navigate('home');
  },

  // ==================== إدارة الشخصيات ====================
  getCustomCharacters() {
    const c = localStorage.getItem('lordai_characters');
    return c ? JSON.parse(c) : [];
  },

  saveCustomCharacter(ch) {
    const cs = this.getCustomCharacters();
    ch.id = Date.now();
    ch.creator = this.currentUser?.username || 'مجهول';
    ch.isPublic = true;
    cs.push(ch);
    localStorage.setItem('lordai_characters', JSON.stringify(cs));
    this.characters = [...this.defaultCharacters, ...AIEngine.arabicCharacters, ...cs];
    return ch;
  },

  // ==================== إدارة المحادثات ====================
  getConversations() {
    const c = localStorage.getItem('lordai_conversations');
    return c ? JSON.parse(c) : [];
  },

  saveConversation(c) {
    const cs = this.getConversations();
    const i = cs.findIndex(x => x.id === c.id);
    if (i >= 0) cs[i] = c;
    else cs.push(c);
    localStorage.setItem('lordai_conversations', JSON.stringify(cs));
    this.conversations = cs;
  },

  deleteConversation(id) {
    let cs = this.getConversations();
    cs = cs.filter(c => c.id !== id);
    localStorage.setItem('lordai_conversations', JSON.stringify(cs));
    localStorage.removeItem(`lordai_messages_${id}`);
    this.conversations = cs;
    this.render();
  },

  getMessages(id) {
    const m = localStorage.getItem(`lordai_messages_${id}`);
    return m ? JSON.parse(m) : [];
  },

  saveMessage(id, m) {
    const ms = this.getMessages(id);
    ms.push(m);
    localStorage.setItem(`lordai_messages_${id}`, JSON.stringify(ms));
    return ms;
  },

  clearMessages(id) {
    localStorage.removeItem(`lordai_messages_${id}`);
  },

  // ==================== المفضلة ====================
  getFavorites() {
    const f = localStorage.getItem('lordai_favorites');
    return f ? JSON.parse(f) : [];
  },

  toggleFavorite(charId) {
    let favs = this.getFavorites();
    const idx = favs.indexOf(charId);
    if (idx >= 0) {
      favs.splice(idx, 1);
      this.showToast(this.t('toast_fav_removed'));
    } else {
      favs.push(charId);
      this.showToast(this.t('toast_fav_added'));
    }
    localStorage.setItem('lordai_favorites', JSON.stringify(favs));
    this.favorites = favs;
    this.render();
  },

  isFavorite(charId) { return this.favorites.includes(charId); },

  // ==================== التنقل ====================
  navigate(page, data) {
    this.currentPage = page;
    if (data) this.pageData = data;
    this.sidebarOpen = false;
    this.showMemoryPanel = false;
    this.render();
    window.scrollTo(0, 0);
  },

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open', this.sidebarOpen);
    if (overlay) overlay.classList.toggle('show', this.sidebarOpen);
  },

  // ==================== الإشعارات ====================
  showToast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    t.innerHTML = `<span>${icons[type] || '📢'}</span> ${msg}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  },

  // ==================== الترجمة ====================
  t(key) { return I18N.t(key); },

  toggleLang() {
    const newLang = I18N.currentLang === 'ar' ? 'en' : 'ar';
    I18N.setLang(newLang);
    this.showToast(newLang === 'ar' ? this.t('toast_lang_ar') : this.t('toast_lang_en'));
    this.render();
  },

  // ==================== مساعدات ====================
  getCharById(id) { return this.characters.find(c => c.id == id); },

  getTotalMessages() {
    let total = 0;
    this.conversations.forEach(c => { total += this.getMessages(c.id).length; });
    return total;
  },

  formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString(I18N.currentLang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  },

  formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString(I18N.currentLang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ==================== بدء محادثة ====================
  startChat(charId) {
    if (!this.currentUser) {
      this.navigate('login');
      return;
    }
    const char = this.getCharById(charId);
    if (!char) return;

    let conv = this.conversations.find(c => c.charId == charId);
    if (!conv) {
      conv = {
        id: 'conv_' + Date.now(),
        charId: charId,
        charName: char.name,
        charAvatar: char.avatar,
        startedAt: Date.now(),
        lastMessage: char.greeting || '',
        lastMessageAt: Date.now()
      };
      // Add greeting message
      this.saveMessage(conv.id, {
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text: char.greeting || (I18N.currentLang === 'ar' ? `مرحباً! أنا ${char.name}` : `Hello! I'm ${char.name}`),
        timestamp: Date.now()
      });
      this.saveConversation(conv);
    }

    this.currentChat = conv;
    this.navigate('chat');
  },

  // ==================== إرسال رسالة ====================
  async sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !this.currentChat) return;
    const text = input.value.trim();
    if (!text || this.isTyping) return;

    const conv = this.currentChat;
    const char = this.getCharById(conv.charId);
    if (!char) return;

    // Save user message
    const userMsg = { id: 'msg_' + Date.now(), sender: 'user', text, timestamp: Date.now() };
    this.saveMessage(conv.id, userMsg);

    // Update conversation
    conv.lastMessage = text;
    conv.lastMessageAt = Date.now();
    this.saveConversation(conv);

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Show messages
    this.renderChatMessages();
    this.scrollChat();

    // Show typing
    this.isTyping = true;
    this.renderTypingIndicator(true);
    this.scrollChat();

    // Generate response with streaming
    const messages = this.getMessages(conv.id);
    const streamEl = document.getElementById('streaming-response');

    try {
      await AIEngine.streamResponse(text, char, messages,
        (chunk) => {
          // On each chunk
          if (streamEl) {
            streamEl.innerHTML = this.escapeHtml(chunk).replace(/\n/g, '<br>');
            this.scrollChat();
          }
        },
        (fullResponse) => {
          // On complete
          this.isTyping = false;
          const botMsg = { id: 'msg_' + Date.now(), sender: 'bot', text: fullResponse, timestamp: Date.now() };
          this.saveMessage(conv.id, botMsg);
          conv.lastMessage = fullResponse.substring(0, 100);
          conv.lastMessageAt = Date.now();
          this.saveConversation(conv);
          this.renderChatMessages();
          this.scrollChat();
        }
      );
    } catch (e) {
      this.isTyping = false;
      this.renderChatMessages();
    }
  },

  // ==================== إعادة توليد ====================
  async regenerateResponse() {
    if (!this.currentChat || this.isTyping) return;
    const conv = this.currentChat;
    const char = this.getCharById(conv.charId);
    if (!char) return;

    const messages = this.getMessages(conv.id);
    if (messages.length < 2) return;

    // Find last user message
    let lastUserMsg = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserMsg = messages[i].text;
        break;
      }
    }
    if (!lastUserMsg) return;

    // Remove last bot message
    const filtered = [...messages];
    for (let i = filtered.length - 1; i >= 0; i--) {
      if (filtered[i].sender === 'bot') {
        filtered.splice(i, 1);
        break;
      }
    }
    localStorage.setItem(`lordai_messages_${conv.id}`, JSON.stringify(filtered));

    this.renderChatMessages();
    this.isTyping = true;
    this.renderTypingIndicator(true);
    this.scrollChat();

    try {
      await AIEngine.streamResponse(lastUserMsg, char, filtered,
        (chunk) => {
          const streamEl = document.getElementById('streaming-response');
          if (streamEl) {
            streamEl.innerHTML = this.escapeHtml(chunk).replace(/\n/g, '<br>');
            this.scrollChat();
          }
        },
        (fullResponse) => {
          this.isTyping = false;
          const botMsg = { id: 'msg_' + Date.now(), sender: 'bot', text: fullResponse, timestamp: Date.now() };
          this.saveMessage(conv.id, botMsg);
          conv.lastMessage = fullResponse.substring(0, 100);
          this.saveConversation(conv);
          this.renderChatMessages();
          this.scrollChat();
        }
      );
    } catch (e) {
      this.isTyping = false;
      this.renderChatMessages();
    }
  },

  // ==================== نسخ رسالة ====================
  copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(this.t('toast_copied'));
    }).catch(() => {});
  },

  // ==================== التمرير ====================
  scrollChat() {
    requestAnimationFrame(() => {
      const el = document.getElementById('chat-messages');
      if (el) el.scrollTop = el.scrollHeight;
    });
  },

  // ==================== العرض الرئيسي ====================
  render() {
    const app = document.getElementById('app');
    if (!app) return;

    const pages = {
      home: () => this.renderHome(),
      login: () => this.renderLogin(),
      register: () => this.renderRegister(),
      dashboard: () => this.renderDashboard(),
      characters: () => this.renderCharacters(),
      conversations: () => this.renderConversations(),
      favorites: () => this.renderFavorites(),
      chat: () => this.renderChat(),
      create: () => this.renderCreate(),
      profile: () => this.renderProfile(),
      subscription: () => this.renderSubscription(),
      settings: () => this.renderSettings(),
    };

    const renderFn = pages[this.currentPage] || pages.home;
    app.innerHTML = renderFn();
    this.bindEvents();
  },

  // ==================== الشريط الجانبي ====================
  renderSidebar(active) {
    const t = k => this.t(k);
    const user = this.currentUser;
    const items = [
      { id: 'dashboard', icon: '📊', label: t('nav_dashboard') },
      { id: 'characters', icon: '🎭', label: t('nav_characters') },
      { id: 'conversations', icon: '💬', label: t('nav_conversations') },
      { id: 'favorites', icon: '❤️', label: t('nav_favorites') },
      { id: 'create', icon: '✨', label: t('nav_create') },
      { id: 'profile', icon: '👤', label: t('nav_profile') },
      { id: 'subscription', icon: '💎', label: t('nav_subscription') },
      { id: 'settings', icon: '⚙️', label: t('nav_settings') },
    ];

    return `
      <div class="sidebar-overlay" onclick="App.toggleSidebar()"></div>
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo" onclick="App.navigate('home')">Lord'ai</div>
          <button class="btn btn-ghost btn-icon sm" onclick="App.toggleLang()" title="تبديل اللغة">
            ${I18N.currentLang === 'ar' ? '🇺🇸' : '🇸🇦'}
          </button>
        </div>
        <nav class="sidebar-nav">
          ${items.map(item => `
            <div class="sidebar-item ${active === item.id ? 'active' : ''}" onclick="App.navigate('${item.id}')">
              <span class="icon">${item.icon}</span>
              <span>${item.label}</span>
            </div>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">${(user?.username || 'U')[0].toUpperCase()}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user?.username || 'مستخدم'}</div>
              <div class="sidebar-user-email">${user?.email || ''}</div>
            </div>
          </div>
          <div class="sidebar-item" onclick="App.logout()" style="margin-top:8px;color:var(--error-light);">
            <span class="icon">🚪</span>
            <span>${t('nav_logout')}</span>
          </div>
        </div>
      </aside>`;
  },

  // ==================== زر القائمة للموبايل ====================
  mobileMenuBtn() {
    return `<button class="mobile-menu-btn" onclick="App.toggleSidebar()">☰</button>`;
  },

  // ==================== الصفحة الرئيسية ====================
  renderHome() {
    const t = k => this.t(k);
    const featuredChars = [...this.defaultCharacters.slice(0, 3), ...AIEngine.arabicCharacters.slice(0, 3)];

    return `
      <nav class="navbar">
        <div class="navbar-brand" onclick="App.navigate('home')">Lord'ai</div>
        <div class="navbar-actions">
          <button class="btn btn-ghost btn-sm" onclick="App.toggleLang()">
            ${I18N.currentLang === 'ar' ? '🇺🇸 EN' : '🇸🇦 عربي'}
          </button>
          ${this.currentUser
            ? `<button class="btn btn-primary btn-sm" onclick="App.navigate('dashboard')">${t('nav_dashboard')}</button>`
            : `<button class="btn btn-primary btn-sm" onclick="App.navigate('login')">${t('hero_cta')}</button>`
          }
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-badge">
          <span class="dot"></span>
          ${t('hero_badge')}
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">${t('hero_title_1')}</span><br>
          ${t('hero_title_2')}
        </h1>
        <p class="hero-subtitle">${t('hero_subtitle')}</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-xl" onclick="App.navigate(App.currentUser ? 'dashboard' : 'login')">
            🚀 ${t('hero_cta')}
          </button>
          <button class="btn btn-secondary btn-xl" onclick="App.navigate(App.currentUser ? 'characters' : 'login')">
            🎭 ${t('hero_explore')}
          </button>
        </div>
      </section>

      <!-- Features -->
      <section class="features-grid">
        ${[
          { icon: '🧠', title: t('feat_memory'), desc: t('feat_memory_desc') },
          { icon: '🗣️', title: t('feat_dialects'), desc: t('feat_dialects_desc') },
          { icon: '👥', title: t('feat_group'), desc: t('feat_group_desc') },
          { icon: '✨', title: t('feat_create'), desc: t('feat_create_desc') },
          { icon: '⚡', title: t('feat_stream'), desc: t('feat_stream_desc') },
          { icon: '📦', title: t('feat_export'), desc: t('feat_export_desc') },
        ].map(f => `
          <div class="feature-card">
            <span class="feature-icon">${f.icon}</span>
            <h3 class="feature-title">${f.title}</h3>
            <p class="feature-desc">${f.desc}</p>
          </div>
        `).join('')}
      </section>

      <!-- Characters Preview -->
      <section class="characters-section">
        <h2 class="section-title">${t('section_characters')}</h2>
        <div class="char-grid">
          ${featuredChars.map(ch => `
            <div class="char-card card-interactive" onclick="App.startChat(${ch.id})">
              <span class="char-avatar">${ch.avatar}</span>
              <h3 class="char-name">${ch.name}</h3>
              <p class="char-traits">${(ch.traits || []).join('، ')}</p>
              <p class="char-desc">${ch.description}</p>
              ${ch.dialect ? `<span class="char-dialect-badge">${AIEngine.dialectData[ch.dialect]?.flag || ''} ${AIEngine.dialectData[ch.dialect]?.name || ''}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <footer style="text-align:center;padding:40px 20px;color:var(--text-muted);border-top:1px solid var(--border-color);">
        <p style="font-size:1.2rem;margin-bottom:8px;">Lord'ai</p>
        <p>${t('footer_text')}</p>
        <p style="margin-top:8px;font-size:0.8rem;">© ${new Date().getFullYear()} Lord'ai. All rights reserved.</p>
      </footer>`;
  },

  // ==================== تسجيل الدخول ====================
  renderLogin() {
    const t = k => this.t(k);
    return `
      <div class="auth-container">
        <div class="auth-card animate-scale">
          <div class="auth-logo">🌟</div>
          <h2>${t('login_title')}</h2>
          <p class="text-center text-muted mb-lg">${t('login_subtitle')}</p>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">${t('login_user')}</label>
              <input type="text" id="login-user" class="form-input" placeholder="${t('login_user_ph')}" required autocomplete="username">
            </div>
            <div class="form-group">
              <label class="form-label">${t('login_pass')}</label>
              <input type="password" id="login-pass" class="form-input" placeholder="${t('login_pass_ph')}" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary w-full btn-lg">${t('login_btn')}</button>
          </form>
          <div class="auth-footer">
            <p>${t('login_no_account')} <a onclick="App.navigate('register')">${t('login_register')}</a></p>
            <p style="margin-top:8px;"><a onclick="App.navigate('home')">← ${t('nav_home')}</a></p>
          </div>
        </div>
      </div>`;
  },

  // ==================== التسجيل ====================
  renderRegister() {
    const t = k => this.t(k);
    return `
      <div class="auth-container">
        <div class="auth-card animate-scale">
          <div class="auth-logo">✨</div>
          <h2>${t('register_title')}</h2>
          <p class="text-center text-muted mb-lg">${t('register_subtitle')}</p>
          <form id="register-form">
            <div class="form-group">
              <label class="form-label">${t('register_user')}</label>
              <input type="text" id="reg-user" class="form-input" placeholder="${t('register_user_ph')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">${t('register_email')}</label>
              <input type="email" id="reg-email" class="form-input" placeholder="${t('register_email_ph')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">${t('register_pass')}</label>
              <input type="password" id="reg-pass" class="form-input" placeholder="${t('register_pass_ph')}" required>
            </div>
            <button type="submit" class="btn btn-primary w-full btn-lg">${t('register_btn')}</button>
          </form>
          <div class="auth-footer">
            <p>${t('register_has_account')} <a onclick="App.navigate('login')">${t('register_login')}</a></p>
            <p style="margin-top:8px;"><a onclick="App.navigate('home')">← ${t('nav_home')}</a></p>
          </div>
        </div>
      </div>`;
  },

  // ==================== لوحة التحكم ====================
  renderDashboard() {
    const t = k => this.t(k);
    const totalMsgs = this.getTotalMessages();
    const recentConvs = this.conversations.slice(-5).reverse();
    const popularChars = AIEngine.arabicCharacters.slice(0, 4);

    return `<div class="app-layout">
      ${this.renderSidebar('dashboard')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>📊 ${t('dash_title')}</h1>
          <p>${t('dash_welcome')}، ${this.currentUser?.username || ''} 👋</p>
        </div>

        <!-- Stats -->
        <div class="stats-grid mb-lg">
          <div class="stat-card">
            <div class="stat-value">${this.conversations.length}</div>
            <div class="stat-label">${t('dash_total_chats')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalMsgs}</div>
            <div class="stat-label">${t('dash_total_msgs')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${this.characters.length}</div>
            <div class="stat-label">${t('dash_total_chars')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${this.favorites.length}</div>
            <div class="stat-label">${t('dash_total_favs')}</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card mb-lg">
          <h3 style="margin-bottom:16px;">⚡ ${t('dash_quick_actions')}</h3>
          <div class="flex gap-md flex-wrap">
            <button class="btn btn-primary" onclick="App.navigate('characters')">🎭 ${t('nav_characters')}</button>
            <button class="btn btn-secondary" onclick="App.navigate('create')">✨ ${t('nav_create')}</button>
            <button class="btn btn-secondary" onclick="App.navigate('conversations')">💬 ${t('nav_conversations')}</button>
          </div>
        </div>

        <!-- Recent Conversations -->
        <div class="card mb-lg">
          <h3 style="margin-bottom:16px;">💬 ${t('dash_recent')}</h3>
          ${recentConvs.length > 0 ? `
            <div class="conv-list">
              ${recentConvs.map(c => {
                const char = this.getCharById(c.charId);
                return `
                  <div class="conv-item" onclick="App.currentChat=${JSON.stringify(c).replace(/"/g, '&quot;')};App.navigate('chat')">
                    <div class="conv-avatar">${c.charAvatar || '💬'}</div>
                    <div class="conv-info">
                      <div class="conv-name">${c.charName || (char?.name || '...')}</div>
                      <div class="conv-last-msg">${(c.lastMessage || '').substring(0, 60)}...</div>
                    </div>
                    <div class="conv-meta">
                      <div class="conv-time">${this.formatTime(c.lastMessageAt)}</div>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          ` : `
            <div class="empty-state" style="padding:30px;">
              <div class="empty-icon">💬</div>
              <h3>${t('dash_no_chats')}</h3>
              <p>${t('convs_empty_desc')}</p>
              <button class="btn btn-primary mt-md" onclick="App.navigate('characters')">${t('dash_start_chat')}</button>
            </div>
          `}
        </div>

        <!-- Popular Characters -->
        <div class="card">
          <h3 style="margin-bottom:16px;">🌟 ${t('dash_popular')}</h3>
          <div class="grid grid-2" style="gap:12px;">
            ${popularChars.map(ch => `
              <div class="conv-item" onclick="App.startChat(${ch.id})">
                <div class="conv-avatar">${ch.avatar}</div>
                <div class="conv-info">
                  <div class="conv-name">${ch.name}</div>
                  <div class="conv-last-msg">${(ch.traits || []).join('، ')}</div>
                </div>
                ${ch.dialect ? `<span class="badge badge-primary">${AIEngine.dialectData[ch.dialect]?.flag || ''}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </main>
    </div>`;
  },

  // ==================== صفحة الشخصيات ====================
  renderCharacters() {
    const t = k => this.t(k);
    let chars = [...this.characters];

    // Filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      chars = chars.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.traits || []).join(' ').toLowerCase().includes(q)
      );
    }

    if (this.filterType === 'arabic') chars = chars.filter(c => c.dialect);
    else if (this.filterType === 'english') chars = chars.filter(c => !c.dialect);
    else if (this.filterType === 'custom') chars = chars.filter(c => c.creator !== 'System' && c.creator !== 'النظام');

    if (this.filterCategory !== 'all') {
      chars = chars.filter(c => c.category === this.filterCategory);
    }

    return `<div class="app-layout">
      ${this.renderSidebar('characters')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>🎭 ${t('chars_title')}</h1>
          <p>${t('chars_subtitle')}</p>
        </div>

        <!-- Search & Filter -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="${t('chars_search')}" value="${this.searchQuery}"
              oninput="App.searchQuery=this.value;App.render()">
          </div>
          <div class="filter-group">
            ${['all', 'arabic', 'english', 'custom'].map(type => `
              <button class="filter-chip ${this.filterType === type ? 'active' : ''}"
                onclick="App.filterType='${type}';App.render()">
                ${t('chars_' + type)}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Category Filter -->
        <div class="filter-group mb-lg">
          ${['all', 'education', 'entertainment', 'technology', 'lifestyle'].map(cat => `
            <button class="filter-chip ${this.filterCategory === cat ? 'active' : ''}"
              onclick="App.filterCategory='${cat}';App.render()">
              ${t('chars_category_' + cat)}
            </button>
          `).join('')}
        </div>

        <!-- Characters Grid -->
        ${chars.length > 0 ? `
          <div class="char-grid">
            ${chars.map(ch => `
              <div class="char-card card-interactive" onclick="App.startChat(${ch.id})">
                <button class="fav-btn" onclick="event.stopPropagation();App.toggleFavorite(${ch.id})">
                  ${this.isFavorite(ch.id) ? '❤️' : '🤍'}
                </button>
                <span class="char-avatar">${ch.avatar}</span>
                <h3 class="char-name">${ch.name}</h3>
                <p class="char-traits">${(ch.traits || []).join('، ')}</p>
                <p class="char-desc">${ch.description || ''}</p>
                ${ch.dialect ? `<span class="char-dialect-badge">${AIEngine.dialectData[ch.dialect]?.flag || ''} ${AIEngine.dialectData[ch.dialect]?.name || ''}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>${t('chars_no_results')}</h3>
            <p>${t('chars_try_different')}</p>
          </div>
        `}
      </main>
    </div>`;
  },

  // ==================== صفحة المحادثات ====================
  renderConversations() {
    const t = k => this.t(k);
    const convs = [...this.conversations].reverse();

    return `<div class="app-layout">
      ${this.renderSidebar('conversations')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>💬 ${t('convs_title')}</h1>
          <p>${t('convs_subtitle')}</p>
        </div>

        ${convs.length > 0 ? `
          <div class="conv-list">
            ${convs.map(c => {
              const msgs = this.getMessages(c.id);
              return `
                <div class="conv-item">
                  <div class="conv-avatar" onclick="App.currentChat=${JSON.stringify(c).replace(/"/g,'&quot;')};App.navigate('chat')" style="cursor:pointer;">
                    ${c.charAvatar || '💬'}
                  </div>
                  <div class="conv-info" onclick="App.currentChat=${JSON.stringify(c).replace(/"/g,'&quot;')};App.navigate('chat')" style="cursor:pointer;">
                    <div class="conv-name">${c.charName || '...'}</div>
                    <div class="conv-last-msg">${(c.lastMessage || '').substring(0, 80)}...</div>
                  </div>
                  <div class="conv-meta">
                    <div class="conv-time">${this.formatDate(c.lastMessageAt)}</div>
                    <div class="text-xs text-muted">${msgs.length} ${t('convs_messages')}</div>
                    <button class="btn btn-ghost btn-icon sm" onclick="if(confirm('${t('confirm_delete')}')){App.deleteConversation('${c.id}')}" title="${t('delete')}">🗑️</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-icon">💬</div>
            <h3>${t('convs_empty')}</h3>
            <p>${t('convs_empty_desc')}</p>
            <button class="btn btn-primary mt-lg" onclick="App.navigate('characters')">${t('convs_start')}</button>
          </div>
        `}
      </main>
    </div>`;
  },

  // ==================== صفحة المفضلة ====================
  renderFavorites() {
    const t = k => this.t(k);
    const favChars = this.characters.filter(c => this.isFavorite(c.id));

    return `<div class="app-layout">
      ${this.renderSidebar('favorites')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>❤️ ${t('favs_title')}</h1>
          <p>${t('favs_subtitle')}</p>
        </div>

        ${favChars.length > 0 ? `
          <div class="char-grid">
            ${favChars.map(ch => `
              <div class="char-card card-interactive" onclick="App.startChat(${ch.id})">
                <button class="fav-btn" style="opacity:1;" onclick="event.stopPropagation();App.toggleFavorite(${ch.id})">❤️</button>
                <span class="char-avatar">${ch.avatar}</span>
                <h3 class="char-name">${ch.name}</h3>
                <p class="char-traits">${(ch.traits || []).join('، ')}</p>
                <p class="char-desc">${ch.description || ''}</p>
                ${ch.dialect ? `<span class="char-dialect-badge">${AIEngine.dialectData[ch.dialect]?.flag || ''} ${AIEngine.dialectData[ch.dialect]?.name || ''}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-icon">❤️</div>
            <h3>${t('favs_empty')}</h3>
            <p>${t('favs_empty_desc')}</p>
            <button class="btn btn-primary mt-lg" onclick="App.navigate('characters')">${t('hero_explore')}</button>
          </div>
        `}
      </main>
    </div>`;
  },

  // ==================== واجهة الدردشة ====================
  renderChat() {
    if (!this.currentChat) { this.navigate('conversations'); return ''; }
    const t = k => this.t(k);
    const conv = this.currentChat;
    const char = this.getCharById(conv.charId);
    const charName = char?.name || conv.charName || '...';
    const charAvatar = char?.avatar || conv.charAvatar || '💬';
    const dialectInfo = char?.dialect ? AIEngine.dialectData[char.dialect] : null;
    const mem = char ? AIEngine.getMemory(char.id) : null;

    return `
      <div class="chat-layout">
        ${this.renderSidebar('conversations')}
        <div class="chat-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-header-info">
              ${this.mobileMenuBtn()}
              <button class="btn btn-ghost btn-icon sm" onclick="App.navigate('conversations')" title="${t('chat_back')}">
                ${I18N.currentLang === 'ar' ? '→' : '←'}
              </button>
              <div class="chat-header-avatar">${charAvatar}</div>
              <div class="chat-header-details">
                <h3>${charName} ${dialectInfo ? `<span class="badge badge-primary" style="font-size:0.65rem;">${dialectInfo.flag} ${dialectInfo.name}</span>` : ''}</h3>
                <div class="status">${t('chat_online')}</div>
              </div>
            </div>
            <div class="chat-header-actions">
              <button class="btn btn-ghost btn-icon sm" onclick="App.showMemoryPanel=!App.showMemoryPanel;App.render()" title="${t('chat_memory')}">🧠</button>
              <button class="btn btn-ghost btn-icon sm" onclick="App.regenerateResponse()" title="${t('chat_regenerate')}">🔄</button>
              <button class="btn btn-ghost btn-icon sm" onclick="if(confirm('${t('confirm_delete')}')){App.clearMessages('${conv.id}');App.render()}" title="${t('chat_clear')}">🗑️</button>
            </div>
          </div>

          ${this.showMemoryPanel && mem ? this.renderMemoryPanel(char, mem) : ''}

          <!-- Chat Messages -->
          <div class="chat-messages" id="chat-messages">
            ${this.renderChatMessagesHTML(conv)}
          </div>

          <!-- Chat Input -->
          <div class="chat-input-area">
            <div class="chat-input-wrapper">
              <textarea id="chat-input" rows="1" placeholder="${t('chat_placeholder')}"
                onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();App.sendMessage()}"></textarea>
              <button class="chat-send-btn" onclick="App.sendMessage()" ${this.isTyping ? 'disabled' : ''}>
                ${I18N.currentLang === 'ar' ? '←' : '→'}
              </button>
            </div>
          </div>
        </div>
      </div>`;
  },

  renderChatMessagesHTML(conv) {
    const messages = this.getMessages(conv.id);
    const char = this.getCharById(conv.charId);
    const charAvatar = char?.avatar || conv.charAvatar || '💬';

    if (messages.length === 0) {
      return `<div class="empty-state"><div class="empty-icon">💬</div><p>${this.t('chat_greeting')}</p></div>`;
    }

    let html = messages.map(m => `
      <div class="message ${m.sender}">
        <div class="message-avatar">${m.sender === 'bot' ? charAvatar : '👤'}</div>
        <div>
          <div class="message-bubble">${this.escapeHtml(m.text).replace(/\n/g, '<br>')}</div>
          <div class="message-time">${this.formatTime(m.timestamp)}</div>
          ${m.sender === 'bot' ? `
            <div class="message-actions">
              <button class="message-action-btn" onclick="App.copyMessage(\`${m.text.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`)">📋 ${this.t('chat_copy')}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Streaming indicator
    if (this.isTyping) {
      html += `
        <div class="message bot">
          <div class="message-avatar">${charAvatar}</div>
          <div>
            <div class="message-bubble" id="streaming-response">
              <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>
        </div>`;
    }

    return html;
  },

  renderChatMessages() {
    const el = document.getElementById('chat-messages');
    if (!el || !this.currentChat) return;
    el.innerHTML = this.renderChatMessagesHTML(this.currentChat);
  },

  renderTypingIndicator(show) {
    if (!show) return;
    this.renderChatMessages();
  },

  renderMemoryPanel(char, mem) {
    const t = k => this.t(k);
    const typeLabels = {
      name: I18N.currentLang === 'ar' ? 'الاسم' : 'Name',
      likes: I18N.currentLang === 'ar' ? 'يحب' : 'Likes',
      dislikes: I18N.currentLang === 'ar' ? 'لا يحب' : 'Dislikes',
      work: I18N.currentLang === 'ar' ? 'العمل' : 'Work',
      age: I18N.currentLang === 'ar' ? 'العمر' : 'Age',
      location: I18N.currentLang === 'ar' ? 'الموقع' : 'Location',
      study: I18N.currentLang === 'ar' ? 'الدراسة' : 'Study',
      hobby: I18N.currentLang === 'ar' ? 'هواية' : 'Hobby',
    };

    return `
      <div class="memory-panel animate-slide-down">
        <div class="flex-between mb-md">
          <h3>🧠 ${t('chat_memory_title')}</h3>
          <button class="btn btn-ghost btn-sm" onclick="AIEngine.clearMemory(${char.id});App.showToast(App.t('toast_memory_cleared'));App.render()">
            ${t('chat_memory_clear')}
          </button>
        </div>
        ${mem.facts.length > 0 ? `
          ${mem.facts.map(f => `
            <div class="memory-item">
              <span class="memory-type">${typeLabels[f.type] || f.type}</span>
              <span>${f.value}</span>
            </div>
          `).join('')}
          <div class="memory-item" style="margin-top:8px;">
            <span class="memory-type">💬</span>
            <span>${mem.messageCount} ${I18N.currentLang === 'ar' ? 'رسالة' : 'messages'}</span>
          </div>
        ` : `<p class="text-muted text-sm">${t('chat_memory_empty')}</p>`}
      </div>`;
  },

  // ==================== إنشاء شخصية ====================
  renderCreate() {
    const t = k => this.t(k);
    return `<div class="app-layout">
      ${this.renderSidebar('create')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>✨ ${t('create_title')}</h1>
          <p>${t('create_subtitle')}</p>
        </div>

        <div class="creator-layout">
          <!-- Form -->
          <div>
            <form id="create-form" class="card">
              <div class="form-group">
                <label class="form-label">${t('create_name')} *</label>
                <input type="text" id="cc-name" class="form-input" placeholder="${t('create_name_ph')}" required>
              </div>
              <div class="form-group">
                <label class="form-label">${t('create_desc')} *</label>
                <textarea id="cc-desc" class="form-textarea" placeholder="${t('create_desc_ph')}" required></textarea>
              </div>
              <div class="grid grid-2">
                <div class="form-group">
                  <label class="form-label">${t('create_avatar')}</label>
                  <input type="text" id="cc-avatar" class="form-input" placeholder="${t('create_avatar_ph')}" value="😊">
                </div>
                <div class="form-group">
                  <label class="form-label">${t('create_personality')}</label>
                  <select id="cc-personality" class="form-select">
                    ${['wise','funny','mysterious','romantic','professional','creative','caring','adventurous'].map(p =>
                      `<option value="${p}">${t('create_personality_' + p)}</option>`
                    ).join('')}
                  </select>
                </div>
              </div>
              <div class="grid grid-2">
                <div class="form-group">
                  <label class="form-label">${t('create_dialect')}</label>
                  <select id="cc-dialect" class="form-select">
                    <option value="">${t('create_dialect_none')}</option>
                    ${['msa','egyptian','gulf','levantine','moroccan','iraqi'].map(d =>
                      `<option value="${d}">${t('create_dialect_' + d)}</option>`
                    ).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">${t('create_category')}</label>
                  <select id="cc-category" class="form-select">
                    ${['education','entertainment','technology','lifestyle'].map(c =>
                      `<option value="${c}">${t('chars_category_' + c)}</option>`
                    ).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">${t('create_traits')}</label>
                <input type="text" id="cc-traits" class="form-input" placeholder="${t('create_traits_ph')}">
              </div>
              <div class="form-group">
                <label class="form-label">${t('create_skills')}</label>
                <input type="text" id="cc-skills" class="form-input" placeholder="${t('create_skills_ph')}">
              </div>
              <div class="form-group">
                <label class="form-label">${t('create_greeting')}</label>
                <textarea id="cc-greeting" class="form-textarea" rows="3" placeholder="${t('create_greeting_ph')}"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">${t('create_prompt')}</label>
                <textarea id="cc-prompt" class="form-textarea" rows="3" placeholder="${t('create_prompt_ph')}"></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg w-full">✨ ${t('create_btn')}</button>
            </form>
          </div>

          <!-- Preview -->
          <div>
            <div class="preview-card">
              <h3 style="margin-bottom:16px;">${t('create_preview')}</h3>
              <div class="preview-avatar" id="preview-avatar">😊</div>
              <h3 id="preview-name">${t('create_name_ph')}</h3>
              <p class="text-muted text-sm mt-sm" id="preview-desc">${t('create_desc_ph')}</p>
              <p class="text-primary text-sm mt-sm" id="preview-traits"></p>
            </div>
          </div>
        </div>
      </main>
    </div>`;
  },

  // ==================== الملف الشخصي ====================
  renderProfile() {
    const t = k => this.t(k);
    const totalMsgs = this.getTotalMessages();
    const customChars = this.getCustomCharacters();

    return `<div class="app-layout">
      ${this.renderSidebar('profile')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>👤 ${t('profile_title')}</h1>
        </div>

        <!-- User Info -->
        <div class="card mb-lg" style="text-align:center;">
          <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;margin:0 auto 16px;font-weight:900;">
            ${(this.currentUser?.username || 'U')[0].toUpperCase()}
          </div>
          <h2>${this.currentUser?.username || ''}</h2>
          <p class="text-muted">${this.currentUser?.email || ''}</p>
          <p class="text-sm text-muted mt-sm">${t('profile_member_since')}: ${this.formatDate(Date.now() - 86400000 * 30)}</p>
        </div>

        <!-- Stats -->
        <div class="stats-grid mb-lg">
          <div class="stat-card"><div class="stat-value">${this.conversations.length}</div><div class="stat-label">${t('profile_total_chats')}</div></div>
          <div class="stat-card"><div class="stat-value">${totalMsgs}</div><div class="stat-label">${t('profile_total_msgs')}</div></div>
          <div class="stat-card"><div class="stat-value">${customChars.length}</div><div class="stat-label">${t('profile_characters_created')}</div></div>
          <div class="stat-card"><div class="stat-value">${this.favorites.length}</div><div class="stat-label">${t('nav_favorites')}</div></div>
        </div>

        <!-- Achievements -->
        <div class="card">
          <h3 style="margin-bottom:16px;">🏆 ${t('achieve_title')}</h3>
          <div class="grid grid-3" style="gap:12px;">
            ${[
              { icon: '💬', name: t('achieve_first_chat'), desc: t('achieve_first_chat_desc'), done: this.conversations.length > 0 },
              { icon: '✨', name: t('achieve_creator'), desc: t('achieve_creator_desc'), done: customChars.length > 0 },
              { icon: '🔍', name: t('achieve_explorer'), desc: t('achieve_explorer_desc'), done: this.conversations.length >= 5 },
              { icon: '🗣️', name: t('achieve_polyglot'), desc: t('achieve_polyglot_desc'), done: false },
              { icon: '❤️', name: t('achieve_loyal'), desc: t('achieve_loyal_desc'), done: totalMsgs >= 50 },
              { icon: '👥', name: t('achieve_social'), desc: t('achieve_social_desc'), done: false },
            ].map(a => `
              <div class="stat-card" style="opacity:${a.done ? 1 : 0.5};">
                <div style="font-size:2rem;">${a.icon}</div>
                <div style="font-weight:700;margin:8px 0;font-size:0.9rem;">${a.name}</div>
                <div class="text-xs text-muted">${a.desc}</div>
                ${a.done ? '<div style="color:var(--success);font-size:0.8rem;margin-top:6px;">✅</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </main>
    </div>`;
  },

  // ==================== الاشتراكات ====================
  renderSubscription() {
    const t = k => this.t(k);
    const plans = [
      { name: t('sub_free'), price: '$0', msgs: '50', memory: '4K', group: false, voice: false, priority: false, credits: 10, color: '#6b7280', current: true },
      { name: t('sub_standard'), price: '$5.99', msgs: '2,000', memory: '8K', group: true, voice: false, priority: false, credits: 100, color: '#3b82f6' },
      { name: t('sub_premium'), price: '$14.99', msgs: '6,000', memory: '16K', group: true, voice: true, priority: true, credits: 500, color: '#a78bfa', popular: true },
      { name: t('sub_deluxe'), price: '$39.99', msgs: t('sub_unlimited'), memory: '32K', group: true, voice: true, priority: true, credits: 2000, color: '#f59e0b' },
    ];

    return `<div class="app-layout">
      ${this.renderSidebar('subscription')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>💎 ${t('sub_title')}</h1>
        </div>
        <div class="grid grid-4">
          ${plans.map(p => `
            <div class="card sub-card" style="border-top:3px solid ${p.color};${p.popular ? 'transform:scale(1.03);' : ''}">
              ${p.popular ? `<div style="text-align:center;margin-bottom:12px;"><span class="badge" style="background:${p.color};color:white;padding:4px 16px;font-size:0.75rem;">⭐ ${t('chars_popular')}</span></div>` : ''}
              <h3 style="color:${p.color};text-align:center;">${p.name}</h3>
              <div style="font-size:2rem;font-weight:900;text-align:center;margin:16px 0;">
                ${p.price}<span class="text-sm text-muted">${p.price !== '$0' ? t('sub_month') : ''}</span>
              </div>
              <ul>
                <li>💬 ${p.msgs} ${t('sub_messages')}</li>
                <li>🧠 ${p.memory} ${t('sub_memory')}</li>
                <li>${p.group ? '✅' : '❌'} ${t('sub_group_chat')}</li>
                <li>${p.voice ? '✅' : '❌'} ${t('sub_voice')}</li>
                <li>${p.priority ? '✅' : '❌'} ${t('sub_priority')}</li>
                <li>🪙 ${p.credits} ${t('sub_credits')}</li>
              </ul>
              <button class="btn ${p.current ? 'btn-secondary' : 'btn-primary'} w-full mt-md" style="${!p.current ? 'background:' + p.color : ''}">
                ${p.current ? t('sub_current') : t('sub_upgrade')}
              </button>
            </div>
          `).join('')}
        </div>
      </main>
    </div>`;
  },

  // ==================== الإعدادات ====================
  renderSettings() {
    const t = k => this.t(k);
    return `<div class="app-layout">
      ${this.renderSidebar('settings')}
      <main class="main-content">
        ${this.mobileMenuBtn()}
        <div class="page-header">
          <h1>⚙️ ${t('settings_title')}</h1>
        </div>

        <div class="card mb-lg">
          <div class="settings-item">
            <span>🌐 ${t('settings_language')}</span>
            <button class="btn btn-sm btn-secondary" onclick="App.toggleLang()">
              ${I18N.currentLang === 'ar' ? '🇺🇸 English' : '🇸🇦 العربية'}
            </button>
          </div>
          <div class="settings-item">
            <span>🔔 ${t('settings_notifications')}</span>
            <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
          </div>
          <div class="settings-item">
            <span>🔊 ${t('settings_sound')}</span>
            <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
          </div>
        </div>

        <div class="card mb-lg">
          <h3 style="margin-bottom:16px;">📦 ${t('settings_data')}</h3>
          <div class="flex gap-md flex-wrap">
            <button class="btn btn-secondary" onclick="App.exportData()">📥 ${t('settings_export')}</button>
            <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">📤 ${t('settings_import')}</button>
            <input type="file" id="import-file" style="display:none" accept=".json" onchange="App.importData(event)">
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom:16px;">ℹ️ ${t('settings_about')}</h3>
          <p class="text-muted">${t('settings_version')}: 3.0.0</p>
          <p class="text-muted">Lord'ai - The Ultimate AI Character Platform</p>
          <p class="text-muted">🌟 ${I18N.currentLang === 'ar' ? 'يدعم 6 لهجات عربية أصيلة' : 'Supports 6 authentic Arabic dialects'}</p>
        </div>
      </main>
    </div>`;
  },

  // ==================== تصدير/استيراد ====================
  exportData() {
    const data = {
      conversations: this.conversations,
      characters: this.getCustomCharacters(),
      favorites: this.favorites,
      settings: { lang: I18N.currentLang, theme: this.theme },
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lordai_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    this.showToast(this.t('toast_exported'));
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.characters) localStorage.setItem('lordai_characters', JSON.stringify(data.characters));
        if (data.favorites) localStorage.setItem('lordai_favorites', JSON.stringify(data.favorites));
        this.showToast(this.t('toast_saved'));
        setTimeout(() => location.reload(), 500);
      } catch {
        this.showToast(this.t('toast_error'), 'error');
      }
    };
    reader.readAsText(file);
  },

  // ==================== ربط الأحداث ====================
  bindEvents() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value;
        if (user && pass.length >= 6) {
          this.saveUser({ username: user, email: user + '@lordai.com', joinedAt: Date.now() }, 'token_' + Date.now());
          this.showToast(this.t('toast_login_success'));
          this.navigate('dashboard');
        } else {
          this.showToast(this.t('toast_error'), 'error');
        }
      };
    }

    // Register form
    const regForm = document.getElementById('register-form');
    if (regForm) {
      regForm.onsubmit = (e) => {
        e.preventDefault();
        const user = document.getElementById('reg-user').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        if (user.length >= 3 && email && pass.length >= 6) {
          this.saveUser({ username: user, email, joinedAt: Date.now() }, 'token_' + Date.now());
          this.showToast(this.t('toast_register_success'));
          this.navigate('dashboard');
        } else {
          this.showToast(this.t('toast_error'), 'error');
        }
      };
    }

    // Create character form
    const createForm = document.getElementById('create-form');
    if (createForm) {
      // Live preview
      ['cc-name', 'cc-desc', 'cc-traits', 'cc-avatar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.oninput = () => this.updatePreview();
      });

      createForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('cc-name').value.trim();
        const desc = document.getElementById('cc-desc').value.trim();
        const avatar = document.getElementById('cc-avatar').value || '😊';
        const personality = document.getElementById('cc-personality').value;
        const dialect = document.getElementById('cc-dialect').value;
        const category = document.getElementById('cc-category').value;
        const traits = document.getElementById('cc-traits').value.split(',').map(t => t.trim()).filter(Boolean);
        const skills = document.getElementById('cc-skills').value.split(',').map(t => t.trim()).filter(Boolean);
        const greeting = document.getElementById('cc-greeting').value.trim();
        const prompt = document.getElementById('cc-prompt')?.value?.trim() || '';

        if (name && desc) {
          const ch = {
            name, description: desc, avatar, personality,
            dialect: dialect || undefined, category, traits, skills,
            greeting: greeting || `${I18N.currentLang === 'ar' ? 'مرحباً! أنا' : 'Hello! I am'} ${name}!`,
            systemPrompt: prompt, isPublic: true
          };
          this.saveCustomCharacter(ch);
          this.showToast(this.t('toast_char_created'));
          this.navigate('characters');
        }
      };
    }

    // Auto-resize textarea
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.oninput = function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      };
      chatInput.focus();
    }

    this.scrollChat();
  },

  updatePreview() {
    const name = document.getElementById('cc-name')?.value || '';
    const desc = document.getElementById('cc-desc')?.value || '';
    const traits = document.getElementById('cc-traits')?.value || '';
    const avatar = document.getElementById('cc-avatar')?.value || '😊';
    const pName = document.getElementById('preview-name');
    const pDesc = document.getElementById('preview-desc');
    const pTraits = document.getElementById('preview-traits');
    const pAvatar = document.getElementById('preview-avatar');
    if (pName) pName.textContent = name || this.t('create_name_ph');
    if (pDesc) pDesc.textContent = desc || this.t('create_desc_ph');
    if (pTraits) pTraits.textContent = traits;
    if (pAvatar) pAvatar.textContent = avatar;
  },
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => App.init());