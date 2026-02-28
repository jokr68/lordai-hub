'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CharacterStats {
  id: number;
  name: string;
  avatar: string;
  totalConversations: number;
  totalMessages: number;
  avgMessagesPerConversation: number;
  lastActivity: string;
  topTopics: string[];
}

interface OverallStats {
  totalCharacters: number;
  totalConversations: number;
  totalMessages: number;
  activeCharacters: number;
  growthRate: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [characterStats, setCharacterStats] = useState<CharacterStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchAnalytics(token);
  }, [router, selectedPeriod]);

  const fetchAnalytics = async (token: string) => {
    try {
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOverallStats(data.overallStats);
      setCharacterStats(data.characterStats || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-300 hover:text-purple-200 mb-4 inline-block"
          >
            ← العودة للوحة التحكم
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 لوحة الإحصاءات
          </h1>
          <p className="text-gray-300">
            تتبع أداء شخصياتك وتفاعل المستخدمين
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex gap-4">
            {(['7d', '30d', '90d', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-lg transition font-medium ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {period === '7d' && 'آخر 7 أيام'}
                {period === '30d' && 'آخر 30 يوم'}
                {period === '90d' && 'آخر 90 يوم'}
                {period === 'all' && 'الكل'}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-bold text-white mb-1">
                {overallStats.totalCharacters}
              </div>
              <div className="text-gray-300">إجمالي الشخصيات</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-4xl mb-2">💬</div>
              <div className="text-3xl font-bold text-white mb-1">
                {overallStats.totalConversations}
              </div>
              <div className="text-gray-300">المحادثات</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-4xl mb-2">✉️</div>
              <div className="text-3xl font-bold text-white mb-1">
                {overallStats.totalMessages}
              </div>
              <div className="text-gray-300">الرسائل</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-3xl font-bold text-white mb-1">
                {overallStats.growthRate > 0 ? '+' : ''}{overallStats.growthRate}%
              </div>
              <div className="text-gray-300">معدل النمو</div>
            </div>
          </div>
        )}

        {/* Character Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            إحصائيات الشخصيات
          </h2>

          {characterStats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-300 text-lg">
                لا توجد بيانات بعد
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {characterStats.map((stats) => (
                <div
                  key={stats.id}
                  className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition"
                >
                  <div className="flex items-start gap-4">
                    {stats.avatar && (
                      <img
                        src={stats.avatar}
                        alt={stats.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {stats.name}
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-bold text-purple-300">
                            {stats.totalConversations}
                          </div>
                          <div className="text-gray-400 text-sm">محادثات</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-300">
                            {stats.totalMessages}
                          </div>
                          <div className="text-gray-400 text-sm">رسائل</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-300">
                            {stats.avgMessagesPerConversation.toFixed(1)}
                          </div>
                          <div className="text-gray-400 text-sm">متوسط الرسائل</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            آخر نشاط
                          </div>
                          <div className="text-white">
                            {new Date(stats.lastActivity).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                      </div>

                      {stats.topTopics.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">
                            أكثر المواضيع تفاعلاً:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stats.topTopics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6 mt-8">
          <h3 className="text-white font-bold mb-4">💡 نصائح لتحسين أداء شخصياتك:</h3>
          <ul className="text-blue-200 space-y-2">
            <li>• قم بتحديث وصف الشخصية بانتظام للحفاظ على تفاعل المستخدمين</li>
            <li>• راقب المواضيع الأكثر تفاعلاً وركز عليها في تطوير الشخصية</li>
            <li>• استخدم إحصائيات الرسائل لفهم مدى جاذبية الشخصية</li>
            <li>• قارن أداء الشخصيات المختلفة لتحديد الأنسب لجمهورك</li>
          </ul>
        </div>
      </div>
    </div>
  );
}