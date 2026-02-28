'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  description: string;
  avatar: string;
  isPublic: boolean;
}

interface Conversation {
  id: number;
  title: string;
  characterName: string;
  characterAvatar: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const [charsRes, convsRes] = await Promise.all([
        fetch('/api/characters?userId=' + JSON.parse(localStorage.getItem('user') || '{}').id, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const charsData = await charsRes.json();
      const convsData = await convsRes.json();

      setCharacters(charsData.characters || []);
      setConversations(convsData.conversations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Lord'ai</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => router.push('/memory')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            🧠 إدارة الذاكرة
          </button>
          <button
            onClick={() => router.push('/export')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            📤 تصدير المحادثات
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            📊 الإحصاءات
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Characters Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Characters</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/characters/import')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  📁 Import
                </button>
                <button
                  onClick={() => router.push('/characters/create')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Create New
                </button>
              </div>
            </div>

            {characters.length === 0 ? (
              <p className="text-gray-300 text-center py-8">
                No characters yet. Create your first one!
              </p>
            ) : (
              <div className="space-y-4">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition cursor-pointer"
                    onClick={() => router.push(`/characters/${character.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      {character.avatar && (
                        <img
                          src={character.avatar}
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-semibold">{character.name}</h3>
                        <p className="text-gray-300 text-sm">{character.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversations Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Conversations</h2>

            {conversations.length === 0 ? (
              <p className="text-gray-300 text-center py-8">
                No conversations yet. Start chatting with a character!
              </p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition cursor-pointer"
                    onClick={() => router.push(`/conversations/${conversation.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      {conversation.characterAvatar && (
                        <img
                          src={conversation.characterAvatar}
                          alt={conversation.characterName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{conversation.title}</h3>
                        <p className="text-gray-300 text-sm">with {conversation.characterName}</p>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}