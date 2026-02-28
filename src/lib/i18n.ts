// ============================================
// Lord'ai Ultimate - Internationalization System
// نظام ترجمة شامل عربي/إنجليزي
// ============================================

export type Language = 'ar' | 'en';
export type TranslationKey = keyof typeof translations.ar;

const translations = {
  ar: {
    // === الصفحة الرئيسية ===
    hero_title_1: 'عالم الشخصيات',
    hero_title_2: 'الذكية بلا حدود',
    hero_subtitle: 'اكتشف عالماً من الشخصيات الذكية التي تتحدث بلغتك ولهجتك. تحدث مع شخصيات عربية أصيلة بـ 6 لهجات مختلفة، أو أنشئ شخصياتك الخاصة.',
    hero_badge: 'متاح الآن - مجاني للبدء',
    hero_cta: 'ابدأ الآن',
    hero_explore: 'استكشف الشخصيات',

    // === الميزات ===
    feat_memory: 'ذاكرة ذكية',
    feat_memory_desc: 'تتذكر الشخصيات تفاصيل محادثاتك السابقة',
    feat_dialects: '6 لهجات عربية',
    feat_dialects_desc: 'فصحى، مصري، خليجي، شامي، عراقي، مغربي',
    feat_group: 'محادثات جماعية',
    feat_group_desc: 'تحدث مع عدة شخصيات في نفس الوقت',
    feat_create: 'إنشاء شخصيات',
    feat_create_desc: 'صمم شخصياتك الخاصة بالتفصيل الكامل',
    feat_stream: 'ردود فورية',
    feat_stream_desc: 'ردود سريعة ومتدفقة كأنك تتحدث مع شخص حقيقي',
    feat_export: 'تصدير واستيراد',
    feat_export_desc: 'احفظ محادثاتك واستعدها في أي وقت',

    // === التنقل ===
    nav_home: 'الرئيسية',
    nav_dashboard: 'لوحة التحكم',
    nav_characters: 'الشخصيات',
    nav_conversations: 'المحادثات',
    nav_favorites: 'المفضلة',
    nav_create: 'إنشاء شخصية',
    nav_profile: 'الملف الشخصي',
    nav_subscription: 'الاشتراك',
    nav_settings: 'الإعدادات',
    nav_logout: 'تسجيل الخروج',

    // === تسجيل الدخول ===
    login_title: 'تسجيل الدخول',
    login_subtitle: 'مرحباً بعودتك! سجل دخولك للمتابعة',
    login_user: 'اسم المستخدم',
    login_user_ph: 'أدخل اسم المستخدم',
    login_pass: 'كلمة المرور',
    login_pass_ph: 'أدخل كلمة المرور',
    login_btn: 'تسجيل الدخول',
    login_no_account: 'ليس لديك حساب؟',
    login_register: 'سجل الآن',
    login_forgot: 'نسيت كلمة المرور؟',

    // === التسجيل ===
    register_title: 'إنشاء حساب جديد',
    register_subtitle: 'انضم إلينا واستمتع بعالم الشخصيات الذكية',
    register_user: 'اسم المستخدم',
    register_user_ph: 'اختر اسم مستخدم (3 أحرف على الأقل)',
    register_email: 'البريد الإلكتروني',
    register_email_ph: 'أدخل بريدك الإلكتروني',
    register_pass: 'كلمة المرور',
    register_pass_ph: 'اختر كلمة مرور (6 أحرف على الأقل)',
    register_btn: 'إنشاء الحساب',
    register_has_account: 'لديك حساب بالفعل؟',
    register_login: 'سجل دخولك',

    // === لوحة التحكم ===
    dash_title: 'لوحة التحكم',
    dash_welcome: 'مرحباً',
    dash_total_chats: 'المحادثات',
    dash_total_msgs: 'الرسائل',
    dash_total_chars: 'الشخصيات',
    dash_total_favs: 'المفضلة',
    dash_recent: 'المحادثات الأخيرة',
    dash_popular: 'الشخصيات الشائعة',
    dash_no_chats: 'لا توجد محادثات بعد',
    dash_start_chat: 'ابدأ محادثة جديدة',
    dash_quick_actions: 'إجراءات سريعة',

    // === الشخصيات ===
    chars_title: 'الشخصيات',
    chars_subtitle: 'اختر شخصية وابدأ محادثة ممتعة',
    chars_search: 'ابحث عن شخصية...',
    chars_all: 'الكل',
    chars_arabic: 'عربية',
    chars_english: 'إنجليزية',
    chars_custom: 'مخصصة',
    chars_popular: 'الأكثر شعبية',
    chars_new: 'الأحدث',
    chars_chat: 'ابدأ محادثة',
    chars_no_results: 'لا توجد نتائج',
    chars_try_different: 'جرب بحثاً مختلفاً',

    // === المحادثة ===
    chat_title: 'المحادثة',
    chat_sendMessage: 'إرسال',
    chat_typeMessage: 'اكتب رسالتك...',
    chat_typing: 'يكتب...',
    chat_stopGeneration: 'إيقاف التوليد',
    chat_regenerate: 'إعادة التوليد',
    chat_branch: 'فرع',
    chat_merge: 'دمج',
    chat_newBranch: 'فرع جديد',
    chat_switchBranch: 'تبديل الفرع',
    chat_deleteBranch: 'حذف الفرع',
    chat_confirmDeleteBranch: 'هل أنت متأكد من حذف هذا الفرع؟',

    // === الاشتراك ===
    subscription_title: 'اختر خطتك',
    subscription_subtitle: 'اكتشف الإمكانات الكاملة لـ Lordai مع خططنا المميزة',
    subscription_monthly: 'شهري',
    subscription_yearly: 'سنوي',
    subscription_save20: 'وفر 20%',
    subscription_free: 'مجاني',
    subscription_premium: 'مميز',
    subscription_creator: 'منشئ',
    subscription_month: 'شهر',
    subscription_year: 'سنة',
    subscription_mostPopular: 'الأكثر شعبية',
    subscription_currentPlan: 'الخطة الحالية',
    subscription_upgrade: 'ترقية الآن',
    subscription_features_basicChat: 'محادثة أساسية مع الشخصيات',
    subscription_features_limitedCharacters: 'حتى 5 شخصيات',
    subscription_features_basicMemory: 'نظام ذاكرة أساسي',
    subscription_features_standardSupport: 'دعم قياسي',
    subscription_features_unlimitedChat: 'محادثات غير محدودة مع الشخصيات',
    subscription_features_unlimitedCharacters: 'شخصيات غير محدودة',
    subscription_features_advancedMemory: 'نظام ذاكرة متقدم',
    subscription_features_prioritySupport: 'دعم ذو أولوية',
    subscription_features_voiceChat: 'ميزة المحادثة الصوتية',
    subscription_features_imageUpload: 'رفع الصور في المحادثة',
    subscription_features_analytics: 'لوحة تحليلات المنشئين',
    subscription_features_allPremium: 'جميع ميزات Premium',
    subscription_features_characterMarketplace: 'بيع الشخصيات في السوق',
    subscription_features_revenueSharing: 'مشاركة الإيرادات (70/30)',
    subscription_features_customAPI: 'وصول API مخصص',
    subscription_features_whiteLabel: 'حل بعلامة تجارية خاصة',
    subscription_features_dedicatedSupport: 'مدير حساب مخصص',
    subscription_faq_title: 'الأسئلة الشائعة',
    subscription_faq_q1: 'هل يمكنني تغيير خطتي لاحقاً؟',
    subscription_faq_a1: 'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. التغييرات سارية المفعول فوراً.',
    subscription_faq_q2: 'ما هي طرق الدفع التي تقبلونها؟',
    subscription_faq_a2: 'نقبل جميع بطاقات الائتمان الرئيسية وPayPal والمدفوعات المشفرة.',
    subscription_faq_q3: 'هل هناك فترة تجريبية مجانية؟',
    subscription_faq_a3: 'نعم، جميع الخطط المدفوعة تأتي مع فترة تجريبية مجانية لمدة 7 أيام. لا حاجة لبطاقة ائتمان.',

    // === عام ===
    common_no_data: 'لا توجد بيانات',
    common_confirm_delete: 'هل أنت متأكد من الحذف؟',
    common_confirm_clear: 'هل أنت متأكد من مسح جميع البيانات؟',
    common_cancel: 'إلغاء',
    common_confirm: 'تأكيد',
    common_save: 'حفظ',
    common_delete: 'حذف',
    common_edit: 'تعديل',
    common_close: 'إغلاق',
    common_back: 'رجوع',
    common_next: 'التالي',
    common_previous: 'السابق',
    common_search: 'بحث',
    common_filter: 'تصفية',
    common_sort: 'ترتيب',
    common_all: 'الكل',
  },
  en: {
    // === Home Page ===
    hero_title_1: 'World of',
    hero_title_2: 'Intelligent Characters',
    hero_subtitle: 'Discover a world of intelligent characters that speak your language and dialect. Chat with authentic Arabic characters in 6 different dialects, or create your own characters.',
    hero_badge: 'Available Now - Free to Start',
    hero_cta: 'Start Now',
    hero_explore: 'Explore Characters',

    // === Features ===
    feat_memory: 'Smart Memory',
    feat_memory_desc: 'Characters remember details from your previous conversations',
    feat_dialects: '6 Arabic Dialects',
    feat_dialects_desc: 'MSA, Egyptian, Gulf, Levantine, Iraqi, Moroccan',
    feat_group: 'Group Chats',
    feat_group_desc: 'Chat with multiple characters at the same time',
    feat_create: 'Create Characters',
    feat_create_desc: 'Design your own characters with full customization',
    feat_stream: 'Instant Responses',
    feat_stream_desc: 'Fast and streaming responses like talking to a real person',
    feat_export: 'Export & Import',
    feat_export_desc: 'Save your conversations and restore them anytime',

    // === Navigation ===
    nav_home: 'Home',
    nav_dashboard: 'Dashboard',
    nav_characters: 'Characters',
    nav_conversations: 'Conversations',
    nav_favorites: 'Favorites',
    nav_create: 'Create Character',
    nav_profile: 'Profile',
    nav_subscription: 'Subscription',
    nav_settings: 'Settings',
    nav_logout: 'Logout',

    // === Login ===
    login_title: 'Login',
    login_subtitle: 'Welcome back! Login to continue',
    login_user: 'Username',
    login_user_ph: 'Enter your username',
    login_pass: 'Password',
    login_pass_ph: 'Enter your password',
    login_btn: 'Login',
    login_no_account: "Don't have an account?",
    login_register: 'Register now',
    login_forgot: 'Forgot password?',

    // === Register ===
    register_title: 'Create New Account',
    register_subtitle: 'Join us and enjoy the world of intelligent characters',
    register_user: 'Username',
    register_user_ph: 'Choose a username (min 3 characters)',
    register_email: 'Email',
    register_email_ph: 'Enter your email',
    register_pass: 'Password',
    register_pass_ph: 'Choose a password (min 6 characters)',
    register_btn: 'Create Account',
    register_has_account: 'Already have an account?',
    register_login: 'Login',

    // === Dashboard ===
    dash_title: 'Dashboard',
    dash_welcome: 'Welcome',
    dash_total_chats: 'Conversations',
    dash_total_msgs: 'Messages',
    dash_total_chars: 'Characters',
    dash_total_favs: 'Favorites',
    dash_recent: 'Recent Conversations',
    dash_popular: 'Popular Characters',
    dash_no_chats: 'No conversations yet',
    dash_start_chat: 'Start a new conversation',
    dash_quick_actions: 'Quick Actions',

    // === Characters ===
    chars_title: 'Characters',
    chars_subtitle: 'Choose a character and start an enjoyable conversation',
    chars_search: 'Search for a character...',
    chars_all: 'All',
    chars_arabic: 'Arabic',
    chars_english: 'English',
    chars_custom: 'Custom',
    chars_popular: 'Most Popular',
    chars_new: 'Newest',
    chars_chat: 'Start Chat',
    chars_no_results: 'No results found',
    chars_try_different: 'Try a different search',

    // === Chat ===
    chat_title: 'Chat',
    chat_sendMessage: 'Send Message',
    chat_typeMessage: 'Type your message...',
    chat_typing: 'Typing...',
    chat_stopGeneration: 'Stop Generation',
    chat_regenerate: 'Regenerate',
    chat_branch: 'Branch',
    chat_merge: 'Merge',
    chat_newBranch: 'New Branch',
    chat_switchBranch: 'Switch Branch',
    chat_deleteBranch: 'Delete Branch',
    chat_confirmDeleteBranch: 'Are you sure you want to delete this branch?',

    // === Subscription ===
    subscription_title: 'Choose Your Plan',
    subscription_subtitle: 'Unlock the full potential of Lordai with our premium plans',
    subscription_monthly: 'Monthly',
    subscription_yearly: 'Yearly',
    subscription_save20: 'Save 20%',
    subscription_free: 'Free',
    subscription_premium: 'Premium',
    subscription_creator: 'Creator',
    subscription_month: 'month',
    subscription_year: 'year',
    subscription_mostPopular: 'Most Popular',
    subscription_currentPlan: 'Current Plan',
    subscription_upgrade: 'Upgrade Now',
    subscription_features_basicChat: 'Basic chat with characters',
    subscription_features_limitedCharacters: 'Up to 5 characters',
    subscription_features_basicMemory: 'Basic memory system',
    subscription_features_standardSupport: 'Standard support',
    subscription_features_unlimitedChat: 'Unlimited chat with characters',
    subscription_features_unlimitedCharacters: 'Unlimited characters',
    subscription_features_advancedMemory: 'Advanced memory system',
    subscription_features_prioritySupport: 'Priority support',
    subscription_features_voiceChat: 'Voice chat feature',
    subscription_features_imageUpload: 'Image upload in chat',
    subscription_features_analytics: 'Creator analytics dashboard',
    subscription_features_allPremium: 'All Premium features',
    subscription_features_characterMarketplace: 'Sell characters on marketplace',
    subscription_features_revenueSharing: 'Revenue sharing (70/30)',
    subscription_features_customAPI: 'Custom API access',
    subscription_features_whiteLabel: 'White-label solution',
    subscription_features_dedicatedSupport: 'Dedicated account manager',
    subscription_faq_title: 'Frequently Asked Questions',
    subscription_faq_q1: 'Can I change my plan later?',
    subscription_faq_a1: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    subscription_faq_q2: 'What payment methods do you accept?',
    subscription_faq_a2: 'We accept all major credit cards, PayPal, and cryptocurrency payments.',
    subscription_faq_q3: 'Is there a free trial?',
    subscription_faq_a3: 'Yes, all paid plans come with a 7-day free trial. No credit card required.',

    // === Common ===
    common_no_data: 'No data available',
    common_confirm_delete: 'Are you sure you want to delete?',
    common_confirm_clear: 'Are you sure you want to clear all data?',
    common_cancel: 'Cancel',
    common_confirm: 'Confirm',
    common_save: 'Save',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_close: 'Close',
    common_back: 'Back',
    common_next: 'Next',
    common_previous: 'Previous',
    common_search: 'Search',
    common_filter: 'Filter',
    common_sort: 'Sort',
    common_all: 'All',
  },
};

export const I18N = {
  currentLang: 'ar' as Language,

  init() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lordai_lang') as Language;
      if (saved && (saved === 'ar' || saved === 'en')) {
        this.currentLang = saved;
      }
      this.applyDirection();
    }
  },

  setLang(lang: Language) {
    this.currentLang = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lordai_lang', lang);
      this.applyDirection();
    }
  },

  applyDirection() {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (this.currentLang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
      } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
      }
    }
  },

  t(key: string): string {
    const langTranslations = translations[this.currentLang] as Record<string, string>;
    const arTranslations = translations['ar'] as Record<string, string>;
    return langTranslations?.[key] || arTranslations?.[key] || key;
  },

  get translations() {
    return translations;
  },
};

// Initialize on client side
if (typeof window !== 'undefined') {
  I18N.init();
}

export default I18N;