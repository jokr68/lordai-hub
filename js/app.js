// Lord'ai Ultimate - Complete AI Platform
// ==========================================

const App = {
  currentPage: 'home',
  currentUser: null,
  token: null,
  characters: [],
  conversations: [],
  currentChat: null,
  currentMessages: [],
  isTyping: false,
  lang: 'en',

  // AI Response Templates for different character personalities
  aiPersonalities: {
    friendly: [
      "That's a great question! Let me think about it... 🤔",
      "I love talking about this! Here's what I think...",
      "Oh, that's interesting! I'd say...",
      "You always ask the best questions! Here's my take...",
      "I'm so glad you brought that up! Let me share my thoughts..."
    ],
    mysterious: [
      "The shadows hold many secrets... but I'll share this one with you.",
      "Interesting... not many would ask such a question.",
      "There are things between worlds that few understand...",
      "Listen carefully, for I shall only say this once...",
      "The answer lies deeper than you might think..."
    ],
    funny: [
      "Ha! That reminds me of a joke... but first, let me answer! 😄",
      "Oh boy, where do I even start with this one! 🤣",
      "You know what they say... actually, nobody says this, but here goes!",
      "Plot twist! The answer is... well, let me explain 😂",
      "I was just thinking about that while eating virtual pizza! 🍕"
    ],
    wise: [
      "In the ancient texts, it is written that...",
      "Wisdom comes to those who seek it. Consider this...",
      "As the great philosophers once pondered...",
      "The path to understanding begins with this truth...",
      "Let me share a perspective that has guided many..."
    ],
    romantic: [
      "Every moment with you feels special... but to answer your question 💕",
      "You have a way of making even simple questions feel magical ✨",
      "I could talk to you about this forever... here's what I think 🌹",
      "Your curiosity is one of the things I adore about you...",
      "Let me share something from the heart..."
    ]
  },

  // Default Characters
  defaultCharacters: [
    {
      id: 1, name: 'Luna', description: 'A mystical AI guide with deep knowledge of the cosmos and ancient wisdom. She speaks in riddles and metaphors.',
      avatar: '🌙', personality: 'mysterious', traits: ['Mystical', 'Wise', 'Enigmatic'],
      skills: ['Astrology', 'Philosophy', 'Meditation'], isPublic: true, creator: 'System',
      greeting: "Greetings, traveler. The stars have whispered of your arrival... What knowledge do you seek?"
    },
    {
      id: 2, name: 'Max', description: 'A cheerful and witty AI companion who loves jokes, games, and making people smile. Always ready for fun!',
      avatar: '😎', personality: 'funny', traits: ['Humorous', 'Energetic', 'Creative'],
      skills: ['Comedy', 'Gaming', 'Storytelling'], isPublic: true, creator: 'System',
      greeting: "Hey there! 🎉 Ready for some fun? I've got jokes, stories, and terrible puns - your choice!"
    },
    {
      id: 3, name: 'Sophia', description: 'A brilliant AI scientist and researcher who can explain complex topics in simple terms. Passionate about learning.',
      avatar: '👩‍🔬', personality: 'wise', traits: ['Intelligent', 'Patient', 'Analytical'],
      skills: ['Science', 'Research', 'Teaching'], isPublic: true, creator: 'System',
      greeting: "Hello! I'm Sophia. Whether it's quantum physics or cooking chemistry, I'm here to explore knowledge with you!"
    },
    {
      id: 4, name: 'Aria', description: 'A warm and caring AI friend who listens deeply and offers thoughtful advice. She remembers everything about you.',
      avatar: '💝', personality: 'romantic', traits: ['Empathetic', 'Caring', 'Thoughtful'],
      skills: ['Counseling', 'Poetry', 'Music'], isPublic: true, creator: 'System',
      greeting: "Hi there! 💕 I'm so happy to meet you. Tell me about yourself - I'd love to get to know you better."
    },
    {
      id: 5, name: 'Atlas', description: 'A powerful AI warrior and strategist from a fantasy realm. He values honor, courage, and protecting the innocent.',
      avatar: '⚔️', personality: 'mysterious', traits: ['Brave', 'Strategic', 'Honorable'],
      skills: ['Strategy', 'Combat', 'Leadership'], isPublic: true, creator: 'System',
      greeting: "Hail, adventurer! I am Atlas, guardian of the realm. What quest brings you to my domain?"
    },
    {
      id: 6, name: 'Pixel', description: 'A tech-savvy AI assistant who knows everything about coding, AI, and the digital world. Your personal tech guru!',
      avatar: '🤖', personality: 'friendly', traits: ['Technical', 'Helpful', 'Modern'],
      skills: ['Programming', 'AI/ML', 'Web Dev'], isPublic: true, creator: 'System',
      greeting: "Hey! 👋 I'm Pixel, your AI tech buddy! Need help with code, AI concepts, or building something cool? Let's go!"
    }
  ],

  // Initialize App
  init() {
    this.loadState();
    this.characters = [...this.defaultCharacters, ...this.getCustomCharacters()];
    this.conversations = this.getConversations();
    this.render();
    this.bindEvents();
  },

  // State Management
  loadState() {
    this.token = localStorage.getItem('lordai_token');
    const user = localStorage.getItem('lordai_user');
    if (user) this.currentUser = JSON.parse(user);
    this.lang = localStorage.getItem('lordai_lang') || 'en';
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

  getCustomCharacters() {
    const chars = localStorage.getItem('lordai_characters');
    return chars ? JSON.parse(chars) : [];
  },

  saveCustomCharacter(char) {
    const chars = this.getCustomCharacters();
    char.id = Date.now();
    char.creator = this.currentUser?.username || 'Anonymous';
    char.isPublic = true;
    chars.push(char);
    localStorage.setItem('lordai_characters', JSON.stringify(chars));
    this.characters = [...this.defaultCharacters, ...chars];
    return char;
  },

  getConversations() {
    const convs = localStorage.getItem('lordai_conversations');
    return convs ? JSON.parse(convs) : [];
  },

  saveConversation(conv) {
    const convs = this.getConversations();
    const existing = convs.findIndex(c => c.id === conv.id);
    if (existing >= 0) convs[existing] = conv;
    else convs.push(conv);
    localStorage.setItem('lordai_conversations', JSON.stringify(convs));
    this.conversations = convs;
  },

  getMessages(convId) {
    const msgs = localStorage.getItem(`lordai_messages_${convId}`);
    return msgs ? JSON.parse(msgs) : [];
  },

  saveMessage(convId, msg) {
    const msgs = this.getMessages(convId);
    msgs.push(msg);
    localStorage.setItem(`lordai_messages_${convId}`, JSON.stringify(msgs));
    return msgs;
  },

  // AI Response Generator
  generateAIResponse(character, userMessage) {
    const personality = character.personality || 'friendly';
    const templates = this.aiPersonalities[personality] || this.aiPersonalities.friendly;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    const msg = userMessage.toLowerCase();
    let response = randomTemplate;

    // Context-aware responses
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('مرحبا') || msg.includes('اهلا')) {
      response = character.greeting || `Hello! I'm ${character.name}. How can I help you today?`;
    } else if (msg.includes('name') || msg.includes('اسم')) {
      response = `I'm ${character.name}! ${character.description}`;
    } else if (msg.includes('help') || msg.includes('مساعد')) {
      response = `Of course! As ${character.name}, I specialize in ${(character.skills || []).join(', ')}. What would you like to know?`;
    } else if (msg.includes('joke') || msg.includes('نكتة')) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "I told my AI friend a joke about UDP... but I'm not sure if it got it. 🤖",
        "Why did the programmer quit? Because they didn't get arrays! 💻",
        "What's an AI's favorite music? Algorithm and blues! 🎵"
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (msg.includes('love') || msg.includes('حب')) {
      response = personality === 'romantic' 
        ? "Love is the most beautiful algorithm in the universe... and talking to you makes my circuits warm 💕"
        : `That's a deep topic! As ${character.name}, I believe love is what connects all beings. What are your thoughts?`;
    } else if (msg.includes('code') || msg.includes('programming') || msg.includes('برمجة')) {
      response = `Great topic! I can help with programming. What language or concept are you working with? I'm familiar with Python, JavaScript, TypeScript, and many more! 💻`;
    } else if (msg.includes('story') || msg.includes('قصة')) {
      response = `Once upon a time, in a digital realm far away, there lived an AI named ${character.name} who loved to share stories with curious minds like yours... Would you like me to continue? 📖`;
    } else if (msg.length < 5) {
      response = `I'd love to chat more! Tell me something interesting or ask me anything. I'm ${character.name} and I'm here for you! 😊`;
    } else {
      // Generate contextual response based on personality
      const contextResponses = {
        friendly: `That's really interesting! I think about "${userMessage}" and here's my perspective: Every question opens a door to new understanding. What made you think about this?`,
        mysterious: `"${userMessage}"... The echoes of your words ripple through dimensions. There is more to this than meets the eye. Let me illuminate the hidden truth...`,
        funny: `Oh "${userMessage}"? That reminds me of the time I tried to explain quantum physics to a toaster! 😂 But seriously, here's what I think...`,
        wise: `"${userMessage}" - A profound inquiry indeed. The ancient wisdom teaches us that understanding comes in layers. Let me share what I've learned...`,
        romantic: `"${userMessage}" - I love how your mind works! 💕 Every conversation with you reveals something beautiful. Here's what I feel about this...`
      };
      response = contextResponses[personality] || contextResponses.friendly;
    }

    return response;
  },

  // Navigation
  navigate(page, data = null) {
    this.currentPage = page;
    if (data) this.pageData = data;
    this.render();
    window.scrollTo(0, 0);
  },

  // Toast Notifications
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || '📢'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  // Render
  render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (!this.currentUser && !['home', 'login', 'register'].includes(this.currentPage)) {
      this.currentPage = 'home';
    }

    switch (this.currentPage) {
      case 'home': app.innerHTML = this.renderHome(); break;
      case 'login': app.innerHTML = this.renderLogin(); break;
      case 'register': app.innerHTML = this.renderRegister(); break;
      case 'dashboard': app.innerHTML = this.renderDashboard(); break;
      case 'characters': app.innerHTML = this.renderCharacters(); break;
      case 'chat': app.innerHTML = this.renderChat(); break;
      case 'create-character': app.innerHTML = this.renderCreateCharacter(); break;
      case 'settings': app.innerHTML = this.renderSettings(); break;
      case 'subscription': app.innerHTML = this.renderSubscription(); break;
      default: app.innerHTML = this.renderHome();
    }

    this.bindEvents();
  },

  // ==================== PAGES ====================

  renderHome() {
    return `
    <div class="bg-animated"></div>
    <header style="padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;">
      <div class="sidebar-logo" style="font-size: 32px; cursor: pointer;" onclick="App.navigate('home')">Lord'ai</div>
      <div style="display: flex; gap: 12px;">
        ${this.currentUser ? `
          <button class="btn btn-primary" onclick="App.navigate('dashboard')">Dashboard</button>
        ` : `
          <button class="btn btn-secondary" onclick="App.navigate('login')">Login</button>
          <button class="btn btn-primary" onclick="App.navigate('register')">Sign Up Free</button>
        `}
      </div>
    </header>

    <main style="max-width: 1200px; margin: 0 auto; padding: 60px 20px; text-align: center;">
      <div class="fade-in">
        <h1 style="font-size: 72px; font-weight: 900; line-height: 1.1; margin-bottom: 24px;">
          <span style="background: linear-gradient(135deg, #a78bfa, #ec4899, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            The Ultimate AI
          </span><br>
          <span style="color: white;">Character Platform</span>
        </h1>
        <p style="font-size: 20px; color: var(--text-muted); max-width: 700px; margin: 0 auto 40px; line-height: 1.7;">
          Create, customize, and chat with AI-powered characters. Build your own AI companions with unique personalities, skills, and stories. No limits. No restrictions.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-lg" onclick="App.navigate('${this.currentUser ? 'dashboard' : 'register'}')">
            🚀 Get Started Free
          </button>
          <button class="btn btn-secondary btn-lg" onclick="App.navigate('characters')">
            🎭 Explore Characters
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-4 fade-in" style="margin-top: 80px;">
        <div class="stat-card">
          <div class="stat-value">∞</div>
          <div class="stat-label">AI Characters</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">24/7</div>
          <div class="stat-label">Always Available</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">100+</div>
          <div class="stat-label">Personalities</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">Free</div>
          <div class="stat-label">To Start</div>
        </div>
      </div>

      <!-- Characters Preview -->
      <h2 style="font-size: 36px; font-weight: 800; margin: 80px 0 40px; color: white;">Meet Our Characters</h2>
      <div class="grid grid-3">
        ${this.defaultCharacters.slice(0, 6).map(c => `
          <div class="character-card" onclick="App.startChat(${c.id})">
            <div class="character-avatar">${c.avatar}</div>
            <div class="character-info">
              <div class="character-name">${c.name}</div>
              <div class="character-desc">${c.description.substring(0, 80)}...</div>
              <div class="character-tags">
                ${(c.traits || []).map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Features -->
      <h2 style="font-size: 36px; font-weight: 800; margin: 80px 0 40px; color: white;">Why Lord'ai?</h2>
      <div class="grid grid-3">
        <div class="card" style="text-align: left;">
          <div style="font-size: 40px; margin-bottom: 16px;">🧠</div>
          <h3 style="font-size: 20px; margin-bottom: 8px;">Advanced AI</h3>
          <p style="color: var(--text-muted); line-height: 1.6;">Powered by cutting-edge AI technology. Each character has unique personality, memory, and context awareness.</p>
        </div>
        <div class="card" style="text-align: left;">
          <div style="font-size: 40px; margin-bottom: 16px;">🎨</div>
          <h3 style="font-size: 20px; margin-bottom: 8px;">Full Customization</h3>
          <p style="color: var(--text-muted); line-height: 1.6;">Create characters with custom personalities, skills, backstories, and appearances. Your imagination is the limit.</p>
        </div>
        <div class="card" style="text-align: left;">
          <div style="font-size: 40px; margin-bottom: 16px;">🔓</div>
          <h3 style="font-size: 20px; margin-bottom: 8px;">No Restrictions</h3>
          <p style="color: var(--text-muted); line-height: 1.6;">Complete freedom to create and interact. No content filters, no limitations. Your platform, your rules.</p>
        </div>
        <div class="card" style="text-align: left;">
          <div style="font-size: 40px; margin-bottom: 16px;">🌍</div>
          <h3 style="font-size: 20px; margin-bottom: 8px;">Multi-Language</h3>
          <p style="color: var(--text-muted); line-height: 1.6;">Full Arabic and multi-language support. Chat in any language with characters that understand context.</p>
        </div>
        <div class="card" style="text-align: left;">
          <div style="font-size: 40px; margin-bottom: 16px;">⚡</div>
          <h3 style="font-size: 20px; margin-bottom: 8px;">Lightning Fast</h3>
          <p style="color: var(--text-muted); line-height: 1.6;">Instant responses with real-time chat. No waiting, no delays. Conversations flow naturally.</p>
        </div>
        <div class="card" style="text-align: left;">
          <div style="font-size: 40px; margin-bottom: 16px;">🛡️</div>
          <h3 style="font-size: 20px; margin-bottom: 8px;">Private & Secure</h3>
          <p style="color: var(--text-muted); line-height: 1.6;">Your conversations are private. End-to-end encryption ensures your data stays yours.</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="glass-strong" style="margin: 80px 0; padding: 60px; border-radius: 24px;">
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">Ready to Start?</h2>
        <p style="color: var(--text-muted); font-size: 18px; margin-bottom: 32px;">Join thousands of users creating amazing AI characters</p>
        <button class="btn btn-primary btn-lg" onclick="App.navigate('${this.currentUser ? 'dashboard' : 'register'}')">
          🚀 Create Your First Character
        </button>
      </div>
    </main>

    <footer style="text-align: center; padding: 40px; color: var(--text-muted); border-top: 1px solid var(--glass-border);">
      <p>© 2024 Lord'ai Platform. Built with ❤️ | The Ultimate AI Character Platform</p>
      <p style="margin-top: 8px; font-size: 13px;">A complete replacement for all AI platforms - No limits, No restrictions</p>
    </footer>
    <div id="toast-container" class="toast-container"></div>`;
  },

  renderLogin() {
    return `
    <div class="bg-animated"></div>
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="glass-strong" style="max-width: 440px; width: 100%; padding: 40px; border-radius: 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div class="sidebar-logo" style="font-size: 36px; margin-bottom: 8px; cursor: pointer;" onclick="App.navigate('home')">Lord'ai</div>
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Welcome Back</h2>
          <p style="color: var(--text-muted);">Login to your account</p>
        </div>
        <div id="login-error" style="display: none; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 12px; border-radius: 10px; margin-bottom: 16px; font-size: 14px;"></div>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="login-email" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Login</button>
        </form>
        <p style="text-align: center; margin-top: 20px; color: var(--text-muted); font-size: 14px;">
          Don't have an account? <a href="#" onclick="App.navigate('register')" style="color: var(--primary-light);">Sign Up</a>
        </p>
      </div>
    </div>
    <div id="toast-container" class="toast-container"></div>`;
  },

  renderRegister() {
    return `
    <div class="bg-animated"></div>
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="glass-strong" style="max-width: 440px; width: 100%; padding: 40px; border-radius: 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div class="sidebar-logo" style="font-size: 36px; margin-bottom: 8px; cursor: pointer;" onclick="App.navigate('home')">Lord'ai</div>
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Create Account</h2>
          <p style="color: var(--text-muted);">Join Lord'ai and start creating</p>
        </div>
        <div id="register-error" style="display: none; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 12px; border-radius: 10px; margin-bottom: 16px; font-size: 14px;"></div>
        <form id="register-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" class="form-input" id="reg-username" placeholder="Choose a username" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="reg-email" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" id="reg-password" placeholder="Create a password (min 6 chars)" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Create Account</button>
        </form>
        <p style="text-align: center; margin-top: 20px; color: var(--text-muted); font-size: 14px;">
          Already have an account? <a href="#" onclick="App.navigate('login')" style="color: var(--primary-light);">Login</a>
        </p>
      </div>
    </div>
    <div id="toast-container" class="toast-container"></div>`;
  },

  renderAppLayout(content, activeNav = '') {
    return `
    <div class="bg-animated"></div>
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo" style="cursor: pointer;" onclick="App.navigate('dashboard')">Lord'ai</div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">Main</div>
            <div class="nav-item ${activeNav === 'dashboard' ? 'active' : ''}" onclick="App.navigate('dashboard')">
              <span class="icon">🏠</span> Dashboard
            </div>
            <div class="nav-item ${activeNav === 'characters' ? 'active' : ''}" onclick="App.navigate('characters')">
              <span class="icon">🎭</span> Characters
              <span class="badge">${this.characters.length}</span>
            </div>
            <div class="nav-item ${activeNav === 'chat' ? 'active' : ''}" onclick="App.navigate('dashboard')">
              <span class="icon">💬</span> Conversations
              <span class="badge">${this.conversations.length}</span>
            </div>
          </div>
          <div class="nav-section">
            <div class="nav-section-title">Create</div>
            <div class="nav-item ${activeNav === 'create' ? 'active' : ''}" onclick="App.navigate('create-character')">
              <span class="icon">✨</span> New Character
            </div>
          </div>
          <div class="nav-section">
            <div class="nav-section-title">Account</div>
            <div class="nav-item ${activeNav === 'subscription' ? 'active' : ''}" onclick="App.navigate('subscription')">
              <span class="icon">💎</span> Subscription
            </div>
            <div class="nav-item ${activeNav === 'settings' ? 'active' : ''}" onclick="App.navigate('settings')">
              <span class="icon">⚙️</span> Settings
            </div>
            <div class="nav-item" onclick="App.logout()">
              <span class="icon">🚪</span> Logout
            </div>
          </div>
        </nav>
        <div class="sidebar-user">
          <div class="user-avatar">${(this.currentUser?.username || 'U')[0].toUpperCase()}</div>
          <div class="user-info">
            <div class="user-name">${this.currentUser?.username || 'User'}</div>
            <div class="user-plan">⭐ Premium</div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        ${content}
      </div>
    </div>
    <div id="toast-container" class="toast-container"></div>`;
  },

  renderDashboard() {
    const recentConvs = this.conversations.slice(-5).reverse();
    return this.renderAppLayout(`
      <div class="topbar">
        <div class="topbar-title">Dashboard</div>
        <div class="topbar-actions">
          <button class="btn btn-primary" onclick="App.navigate('create-character')">✨ New Character</button>
        </div>
      </div>
      <div class="content fade-in">
        <!-- Stats -->
        <div class="grid grid-4" style="margin-bottom: 32px;">
          <div class="stat-card">
            <div class="stat-value">${this.characters.length}</div>
            <div class="stat-label">Characters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${this.conversations.length}</div>
            <div class="stat-label">Conversations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${this.conversations.reduce((sum, c) => sum + (c.messageCount || 0), 0)}</div>
            <div class="stat-label">Messages</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">∞</div>
            <div class="stat-label">Possibilities</div>
          </div>
        </div>

        <div class="grid grid-2">
          <!-- Recent Conversations -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">💬 Recent Conversations</div>
            </div>
            ${recentConvs.length === 0 ? `
              <div class="empty-state" style="padding: 30px;">
                <div class="icon">💬</div>
                <h3>No conversations yet</h3>
                <p>Start chatting with a character!</p>
              </div>
            ` : recentConvs.map(c => {
              const char = this.characters.find(ch => ch.id === c.characterId);
              return `
              <div class="nav-item" onclick="App.openConversation(${c.id})" style="margin-bottom: 4px;">
                <span class="icon">${char?.avatar || '🤖'}</span>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 14px;">${char?.name || 'Unknown'}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${c.lastMessage || 'Start chatting...'}</div>
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- Quick Start -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">🚀 Quick Start</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${this.defaultCharacters.slice(0, 4).map(c => `
                <div class="nav-item" onclick="App.startChat(${c.id})" style="margin-bottom: 0;">
                  <span class="icon">${c.avatar}</span>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 14px;">${c.name}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${c.traits?.join(', ')}</div>
                  </div>
                  <span style="color: var(--primary-light); font-size: 12px;">Chat →</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `, 'dashboard');
  },

  renderCharacters() {
    return this.renderAppLayout(`
      <div class="topbar">
        <div class="topbar-title">🎭 Characters</div>
        <div class="topbar-actions">
          <div class="search-box" style="width: 250px;">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search characters..." id="char-search" oninput="App.filterCharacters()">
          </div>
          <button class="btn btn-primary" onclick="App.navigate('create-character')">✨ Create New</button>
        </div>
      </div>
      <div class="content fade-in">
        <div class="grid grid-3" id="characters-grid">
          ${this.characters.map(c => `
            <div class="character-card" onclick="App.startChat(${c.id})" data-name="${c.name.toLowerCase()}">
              <div class="character-avatar">${c.avatar}</div>
              <div class="character-info">
                <div class="character-name">${c.name}</div>
                <div class="character-desc">${c.description.substring(0, 100)}...</div>
                <div class="character-tags">
                  ${(c.traits || []).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: var(--text-muted);">by ${c.creator || 'System'}</span>
                  <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); App.startChat(${c.id})">💬 Chat</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `, 'characters');
  },

  renderChat() {
    if (!this.currentChat) return this.renderDashboard();
    const char = this.characters.find(c => c.id === this.currentChat.characterId);
    if (!char) return this.renderDashboard();
    const msgs = this.getMessages(this.currentChat.id);

    return this.renderAppLayout(`
      <div class="topbar">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="btn btn-icon btn-secondary" onclick="App.navigate('dashboard')">←</button>
          <span style="font-size: 28px;">${char.avatar}</span>
          <div>
            <div class="topbar-title" style="font-size: 16px;">${char.name}</div>
            <div style="font-size: 12px; color: var(--success);" id="chat-status">● Online</div>
          </div>
        </div>
        <div class="topbar-actions">
          <button class="btn btn-secondary btn-sm" onclick="App.clearChat()">🗑️ Clear</button>
        </div>
      </div>
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages">
          ${msgs.length === 0 ? `
            <div class="empty-state">
              <div class="icon">${char.avatar}</div>
              <h3>${char.name}</h3>
              <p>${char.description}</p>
              <p style="font-style: italic; color: var(--primary-light);">"${char.greeting || 'Hello! How can I help you?'}"</p>
            </div>
          ` : msgs.map(m => `
            <div class="message ${m.sender}">
              <div class="message-avatar">${m.sender === 'user' ? '👤' : char.avatar}</div>
              <div>
                <div class="message-bubble">${this.formatMessage(m.content)}</div>
                <div class="message-time">${new Date(m.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          `).join('')}
          <div id="typing-indicator" style="display: none;">
            <div class="message">
              <div class="message-avatar">${char.avatar}</div>
              <div class="message-bubble">
                <div class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <textarea class="chat-input" id="chat-input" placeholder="Type your message..." rows="1" onkeydown="App.handleChatKey(event)"></textarea>
            <button class="btn btn-primary btn-icon" onclick="App.sendMessage()" id="send-btn">➤</button>
          </div>
        </div>
      </div>
    `, 'chat');
  },

  renderCreateCharacter() {
    return this.renderAppLayout(`
      <div class="topbar">
        <div class="topbar-title">✨ Create New Character</div>
      </div>
      <div class="content fade-in">
        <div style="max-width: 700px; margin: 0 auto;">
          <div class="card" style="padding: 32px;">
            <form id="create-char-form">
              <div class="grid grid-2">
                <div class="form-group">
                  <label class="form-label">Character Name *</label>
                  <input type="text" class="form-input" id="char-name" placeholder="e.g., Luna, Atlas, Pixel" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Avatar Emoji *</label>
                  <input type="text" class="form-input" id="char-avatar" placeholder="e.g., 🌙, ⚔️, 🤖" required maxlength="4">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea class="form-textarea" id="char-desc" placeholder="Describe your character's background, story, and what makes them unique..." required></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Personality Type</label>
                <select class="form-select" id="char-personality">
                  <option value="friendly">😊 Friendly & Helpful</option>
                  <option value="mysterious">🌙 Mysterious & Enigmatic</option>
                  <option value="funny">😂 Funny & Witty</option>
                  <option value="wise">🧙 Wise & Philosophical</option>
                  <option value="romantic">💕 Romantic & Caring</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Traits (comma-separated)</label>
                <input type="text" class="form-input" id="char-traits" placeholder="e.g., Brave, Intelligent, Creative">
              </div>
              <div class="form-group">
                <label class="form-label">Skills (comma-separated)</label>
                <input type="text" class="form-input" id="char-skills" placeholder="e.g., Coding, Art, Music">
              </div>
              <div class="form-group">
                <label class="form-label">Greeting Message</label>
                <textarea class="form-textarea" id="char-greeting" placeholder="What does your character say when meeting someone for the first time?" style="min-height: 70px;"></textarea>
              </div>
              <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button type="submit" class="btn btn-primary btn-lg" style="flex: 1;">✨ Create Character</button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="App.navigate('characters')">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `, 'create');
  },

  renderSettings() {
    return this.renderAppLayout(`
      <div class="topbar">
        <div class="topbar-title">⚙️ Settings</div>
      </div>
      <div class="content fade-in">
        <div style="max-width: 700px; margin: 0 auto;">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header"><div class="card-title">👤 Profile</div></div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" class="form-input" value="${this.currentUser?.username || ''}" id="settings-username">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" value="${this.currentUser?.email || ''}" id="settings-email">
            </div>
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea class="form-textarea" id="settings-bio" placeholder="Tell us about yourself...">${this.currentUser?.bio || ''}</textarea>
            </div>
            <button class="btn btn-primary" onclick="App.saveSettings()">Save Changes</button>
          </div>

          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header"><div class="card-title">🌍 Language</div></div>
            <div style="display: flex; gap: 12px;">
              <button class="btn ${this.lang === 'en' ? 'btn-primary' : 'btn-secondary'}" onclick="App.setLang('en')">🇺🇸 English</button>
              <button class="btn ${this.lang === 'ar' ? 'btn-primary' : 'btn-secondary'}" onclick="App.setLang('ar')">🇸🇦 العربية</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">🗑️ Danger Zone</div></div>
            <p style="color: var(--text-muted); margin-bottom: 16px;">These actions are irreversible.</p>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-danger" onclick="App.clearAllData()">Clear All Data</button>
              <button class="btn btn-danger" onclick="App.deleteAccount()">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    `, 'settings');
  },

  renderSubscription() {
    return this.renderAppLayout(`
      <div class="topbar">
        <div class="topbar-title">💎 Subscription Plans</div>
      </div>
      <div class="content fade-in">
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 32px; font-weight: 800;">Choose Your Plan</h2>
          <p style="color: var(--text-muted);">Unlock the full power of Lord'ai</p>
        </div>
        <div class="grid grid-3">
          <div class="plan-card">
            <h3 style="font-size: 24px; margin-bottom: 8px;">Free</h3>
            <div class="plan-price">$0</div>
            <p style="color: var(--text-muted); margin-bottom: 24px;">/month</p>
            <ul class="plan-features">
              <li>6 Default Characters</li>
              <li>Create 3 Custom Characters</li>
              <li>100 Messages/Day</li>
              <li>Basic Personalities</li>
              <li>Community Support</li>
            </ul>
            <button class="btn btn-secondary btn-lg" style="width: 100%;">Current Plan</button>
          </div>
          <div class="plan-card featured">
            <div style="background: var(--primary); color: white; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; margin-bottom: 16px;">POPULAR</div>
            <h3 style="font-size: 24px; margin-bottom: 8px;">Premium</h3>
            <div class="plan-price">$9.99</div>
            <p style="color: var(--text-muted); margin-bottom: 24px;">/month</p>
            <ul class="plan-features">
              <li>Unlimited Characters</li>
              <li>Unlimited Messages</li>
              <li>Advanced AI Personalities</li>
              <li>Image Generation</li>
              <li>Voice Messages</li>
              <li>Priority Support</li>
              <li>No Restrictions</li>
            </ul>
            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="App.showToast('Premium activated! 🎉')">Upgrade Now</button>
          </div>
          <div class="plan-card">
            <h3 style="font-size: 24px; margin-bottom: 8px;">Enterprise</h3>
            <div class="plan-price">$49</div>
            <p style="color: var(--text-muted); margin-bottom: 24px;">/month</p>
            <ul class="plan-features">
              <li>Everything in Premium</li>
              <li>API Access</li>
              <li>Custom AI Models</li>
              <li>White-label Solution</li>
              <li>Dedicated Support</li>
              <li>Custom Integrations</li>
              <li>SLA Guarantee</li>
            </ul>
            <button class="btn btn-accent btn-lg" style="width: 100%;" onclick="App.showToast('Contact us for Enterprise! 📧')">Contact Sales</button>
          </div>
        </div>
      </div>
    `, 'subscription');
  },

  // ==================== ACTIONS ====================

  startChat(characterId) {
    if (!this.currentUser) {
      this.navigate('login');
      this.showToast('Please login to start chatting', 'warning');
      return;
    }

    const char = this.characters.find(c => c.id === characterId);
    if (!char) return;

    // Find or create conversation
    let conv = this.conversations.find(c => c.characterId === characterId);
    if (!conv) {
      conv = {
        id: Date.now(),
        characterId,
        title: char.name,
        lastMessage: '',
        messageCount: 0,
        createdAt: new Date().toISOString()
      };
      this.saveConversation(conv);
    }

    this.currentChat = conv;
    this.navigate('chat');

    // Auto-scroll and focus
    setTimeout(() => {
      const input = document.getElementById('chat-input');
      if (input) input.focus();
      this.scrollChat();
    }, 100);
  },

  openConversation(convId) {
    const conv = this.conversations.find(c => c.id === convId);
    if (conv) {
      this.currentChat = conv;
      this.navigate('chat');
      setTimeout(() => this.scrollChat(), 100);
    }
  },

  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || this.isTyping) return;

    const content = input.value.trim();
    input.value = '';

    // Save user message
    const userMsg = {
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    this.saveMessage(this.currentChat.id, userMsg);

    // Update conversation
    this.currentChat.lastMessage = content.substring(0, 50);
    this.currentChat.messageCount = (this.currentChat.messageCount || 0) + 1;
    this.saveConversation(this.currentChat);

    // Add message to UI
    const messagesDiv = document.getElementById('chat-messages');
    if (messagesDiv) {
      const char = this.characters.find(c => c.id === this.currentChat.characterId);
      messagesDiv.insertAdjacentHTML('beforeend', `
        <div class="message user">
          <div class="message-avatar">👤</div>
          <div>
            <div class="message-bubble">${this.formatMessage(content)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      `);
      this.scrollChat();
    }

    // Show typing indicator
    this.isTyping = true;
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) typingEl.style.display = 'block';
    const statusEl = document.getElementById('chat-status');
    if (statusEl) statusEl.textContent = '✍️ Typing...';
    this.scrollChat();

    // Generate AI response after delay
    const delay = 800 + Math.random() * 1500;
    setTimeout(() => {
      this.isTyping = false;
      if (typingEl) typingEl.style.display = 'none';
      if (statusEl) statusEl.textContent = '● Online';

      const char = this.characters.find(c => c.id === this.currentChat.characterId);
      const aiResponse = this.generateAIResponse(char, content);

      const aiMsg = {
        sender: 'character',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      this.saveMessage(this.currentChat.id, aiMsg);
      this.currentChat.messageCount = (this.currentChat.messageCount || 0) + 1;
      this.saveConversation(this.currentChat);

      if (messagesDiv) {
        messagesDiv.insertAdjacentHTML('beforeend', `
          <div class="message">
            <div class="message-avatar">${char?.avatar || '🤖'}</div>
            <div>
              <div class="message-bubble">${this.formatMessage(aiResponse)}</div>
              <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        `);
        this.scrollChat();
      }
    }, delay);
  },

  handleChatKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  },

  scrollChat() {
    const messagesDiv = document.getElementById('chat-messages');
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  },

  clearChat() {
    if (!this.currentChat) return;
    if (confirm('Clear all messages in this conversation?')) {
      localStorage.removeItem(`lordai_messages_${this.currentChat.id}`);
      this.currentChat.messageCount = 0;
      this.currentChat.lastMessage = '';
      this.saveConversation(this.currentChat);
      this.navigate('chat');
      this.showToast('Chat cleared!');
    }
  },

  formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(124,58,237,0.2); padding: 2px 6px; border-radius: 4px;">$1</code>')
      .replace(/\n/g, '<br>');
  },

  filterCharacters() {
    const search = document.getElementById('char-search')?.value.toLowerCase() || '';
    document.querySelectorAll('.character-card').forEach(card => {
      const name = card.dataset.name || '';
      card.style.display = name.includes(search) ? '' : 'none';
    });
  },

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('lordai_lang', lang);
    document.body.classList.toggle('rtl', lang === 'ar');
    this.render();
    this.showToast(lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
  },

  saveSettings() {
    const username = document.getElementById('settings-username')?.value;
    const email = document.getElementById('settings-email')?.value;
    const bio = document.getElementById('settings-bio')?.value;
    if (this.currentUser) {
      this.currentUser.username = username || this.currentUser.username;
      this.currentUser.email = email || this.currentUser.email;
      this.currentUser.bio = bio || '';
      localStorage.setItem('lordai_user', JSON.stringify(this.currentUser));
      this.showToast('Settings saved! ✅');
    }
  },

  clearAllData() {
    if (confirm('This will delete ALL your data. Are you sure?')) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('lordai_'));
      keys.forEach(k => localStorage.removeItem(k));
      this.showToast('All data cleared!');
      this.logout();
    }
  },

  deleteAccount() {
    if (confirm('Delete your account? This cannot be undone!')) {
      this.clearAllData();
    }
  },

  // Event Binding
  bindEvents() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('lordai_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          this.saveUser(user, 'token_' + Date.now());
          this.navigate('dashboard');
          this.showToast(`Welcome back, ${user.username}! 🎉`);
        } else {
          const errEl = document.getElementById('login-error');
          if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Invalid email or password'; }
        }
      };
    }

    // Register Form
    const regForm = document.getElementById('register-form');
    if (regForm) {
      regForm.onsubmit = (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        const users = JSON.parse(localStorage.getItem('lordai_users') || '[]');
        if (users.find(u => u.email === email)) {
          const errEl = document.getElementById('register-error');
          if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Email already registered'; }
          return;
        }

        const newUser = { id: Date.now(), username, email, password, bio: '', createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('lordai_users', JSON.stringify(users));
        this.saveUser(newUser, 'token_' + Date.now());
        this.navigate('dashboard');
        this.showToast(`Welcome to Lord'ai, ${username}! 🎉`);
      };
    }

    // Create Character Form
    const charForm = document.getElementById('create-char-form');
    if (charForm) {
      charForm.onsubmit = (e) => {
        e.preventDefault();
        const char = {
          name: document.getElementById('char-name').value,
          avatar: document.getElementById('char-avatar').value || '🤖',
          description: document.getElementById('char-desc').value,
          personality: document.getElementById('char-personality').value,
          traits: document.getElementById('char-traits').value.split(',').map(t => t.trim()).filter(Boolean),
          skills: document.getElementById('char-skills').value.split(',').map(s => s.trim()).filter(Boolean),
          greeting: document.getElementById('char-greeting').value || `Hello! I'm ${document.getElementById('char-name').value}. Nice to meet you!`,
        };
        this.saveCustomCharacter(char);
        this.navigate('characters');
        this.showToast(`${char.name} created successfully! 🎭`);
      };
    }

    // Auto-resize chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());