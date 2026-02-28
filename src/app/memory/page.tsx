'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Memory {
  id: number;
  characterId: number;
  characterName: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export default function MemoryManagementPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [newMemory, setNewMemory] = useState({
    characterId: 0,
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchMemories(token);
    fetchCharacters(token);
  }, [router]);

  const fetchMemories = async (token: string) => {
    try {
      const response = await fetch('/api/memory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMemories(data.memories || []);
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacters = async (token: string) => {
    try {
      const response = await fetch('/api/characters', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleAddMemory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMemory),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewMemory({ characterId: 0, content: '', priority: 'medium' });
        fetchMemories(token!);
      }
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const handleEditMemory = async () => {
    if (!editingMemory) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/memory/${editingMemory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editingMemory.content,
          priority: editingMemory.priority,
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingMemory(null);
        fetchMemories(token!);
      }
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const handleDeleteMemory = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الذاكرة؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/memory/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchMemories(token!);
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-200 border-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-200 border-green-500';
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return priority;
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-300 hover:text-purple-200 mb-4 inline-block"
          >
            ← العودة للوحة التحكم
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            إدارة الذاكرة
          </h1>
          <p className="text-gray-300">
            إدارة ذكريات الشخصيات وتعديلها وحذفها
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              الذكريات ({memories.length})
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              + إضافة ذاكرة جديدة
            </button>
          </div>

          {memories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧠</div>
              <p className="text-gray-300 text-lg">
                لا توجد ذكريات بعد. ابدأ بإضافة ذاكرة جديدة!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">
                          {memory.characterName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            memory.priority
                          )}`}
                        >
                          {getPriorityLabel(memory.priority)}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{memory.content}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(memory.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMemory(memory);
                          setShowEditModal(true);
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="تعديل"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(memory.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Memory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full">
              <h3 className="text-2xl font-bold text-white mb-6">
                إضافة ذاكرة جديدة
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    الشخصية *
                  </label>
                  <select
                    value={newMemory.characterId}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, characterId: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value={0}>اختر شخصية</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    محتوى الذاكرة *
                  </label>
                  <textarea
                    value={newMemory.content}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, content: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="اكتب محتوى الذاكرة هنا..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    الأولوية
                  </label>
                  <select
                    value={newMemory.priority}
                    onChange={(e) =>
                      setNewMemory({
                        ...newMemory,
                        priority: e.target.value as 'high' | 'medium' | 'low',
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddMemory}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  إضافة
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Memory Modal */}
        {showEditModal && editingMemory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full">
              <h3 className="text-2xl font-bold text-white mb-6">
                تعديل الذاكرة
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    محتوى الذاكرة *
                  </label>
                  <textarea
                    value={editingMemory.content}
                    onChange={(e) =>
                      setEditingMemory({ ...editingMemory, content: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    الأولوية
                  </label>
                  <select
                    value={editingMemory.priority}
                    onChange={(e) =>
                      setEditingMemory({
                        ...editingMemory,
                        priority: e.target.value as 'high' | 'medium' | 'low',
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleEditMemory}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  حفظ التغييرات
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMemory(null);
                  }}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}