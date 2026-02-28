'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Conversation {
  id: number;
  title: string;
  characterName: string;
  characterAvatar: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
}

export default function ExportPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'txt'>('pdf');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchConversations(token);
  }, [router]);

  const fetchConversations = async (token: string) => {
    try {
      const response = await fetch('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationSelect = (conversationId: number) => {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  };

  const handleExport = async () => {
    if (!selectedConversation || messages.length === 0) return;

    setExporting(true);

    try {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      switch (exportFormat) {
        case 'pdf':
          await exportToPDF(conversation, messages);
          break;
        case 'json':
          await exportToJSON(conversation, messages);
          break;
        case 'txt':
          await exportToTXT(conversation, messages);
          break;
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('فشل في تصدير المحادثة');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async (conversation: Conversation, messages: Message[]) => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${conversation.title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            line-height: 1.6;
            direction: rtl;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #8b5cf6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #8b5cf6;
            margin: 0;
          }
          .header p {
            color: #666;
            margin: 10px 0 0 0;
          }
          .message {
            margin: 20px 0;
            padding: 15px;
            border-radius: 10px;
            max-width: 80%;
          }
          .user {
            background-color: #e0e7ff;
            margin-left: auto;
            border: 2px solid #8b5cf6;
          }
          .character {
            background-color: #f3e8ff;
            margin-right: auto;
            border: 2px solid #a855f7;
          }
          .sender {
            font-weight: bold;
            margin-bottom: 5px;
            color: #6b21a8;
          }
          .timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${conversation.title}</h1>
          <p>مع ${conversation.characterName}</p>
          <p>تم التصدير في ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        <div class="messages">
          ${messages.map(msg => `
            <div class="message ${msg.sender === 'user' ? 'user' : 'character'}">
              <div class="sender">${msg.sender === 'user' ? 'أنت' : conversation.characterName}</div>
              <div class="content">${msg.content}</div>
              <div class="timestamp">${new Date(msg.createdAt).toLocaleString('ar-SA')}</div>
            </div>
          `).join('')}
        </div>
        <div class="footer">
          <p>تم التصدير من منصة Lordai</p>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('تم تصدير المحادثة بنجاح! يمكنك فتح الملف في المتصفح وطباعته كـ PDF');
  };

  const exportToJSON = async (conversation: Conversation, messages: Message[]) => {
    const data = {
      conversation: {
        id: conversation.id,
        title: conversation.title,
        characterName: conversation.characterName,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      messages: messages,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToTXT = async (conversation: Conversation, messages: Message[]) => {
    let content = `محادثة: ${conversation.title}\n`;
    content += `مع: ${conversation.characterName}\n`;
    content += `تم التصدير في: ${new Date().toLocaleString('ar-SA')}\n`;
    content += `${'='.repeat(50)}\n\n`;

    messages.forEach(msg => {
      const sender = msg.sender === 'user' ? 'أنت' : conversation.characterName;
      const timestamp = new Date(msg.createdAt).toLocaleString('ar-SA');
      content += `[${timestamp}] ${sender}:\n${msg.content}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            تصدير المحادثات
          </h1>
          <p className="text-gray-300">
            قم بتصدير محادثاتك بصيغ مختلفة
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Conversations List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              اختر محادثة
            </h2>

            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-300 text-lg">
                  لا توجد محادثات بعد
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation.id)}
                    className={`bg-white/10 rounded-lg p-4 cursor-pointer transition ${
                      selectedConversation === conversation.id
                        ? 'ring-2 ring-purple-500 bg-purple-500/20'
                        : 'hover:bg-white/20'
                    }`}
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
                        <h3 className="text-white font-semibold">
                          {conversation.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          مع {conversation.characterName}
                        </p>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(conversation.updatedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              خيارات التصدير
            </h2>

            {!selectedConversation ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-300 text-lg">
                  اختر محادثة من القائمة للبدء
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    صيغة التصدير
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setExportFormat('pdf')}
                      className={`p-4 rounded-lg border-2 transition ${
                        exportFormat === 'pdf'
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-3xl mb-2">📄</div>
                      <div className="font-medium">PDF</div>
                    </button>
                    <button
                      onClick={() => setExportFormat('json')}
                      className={`p-4 rounded-lg border-2 transition ${
                        exportFormat === 'json'
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-3xl mb-2">📊</div>
                      <div className="font-medium">JSON</div>
                    </button>
                    <button
                      onClick={() => setExportFormat('txt')}
                      className={`p-4 rounded-lg border-2 transition ${
                        exportFormat === 'txt'
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-3xl mb-2">📝</div>
                      <div className="font-medium">TXT</div>
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">
                    معلومات المحادثة
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    عدد الرسائل: {messages.length}
                  </p>
                  <p className="text-gray-300 text-sm">
                    آخر تحديث: {new Date(
                      conversations.find(c => c.id === selectedConversation)?.updatedAt || ''
                    ).toLocaleString('ar-SA')}
                  </p>
                </div>

                <button
                  onClick={handleExport}
                  disabled={exporting || messages.length === 0}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {exporting ? 'جاري التصدير...' : 'تصدير المحادثة'}
                </button>

                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">💡 معلومات إضافية:</h3>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• <strong>PDF:</strong> مناسب للطباعة والمشاركة</li>
                    <li>• <strong>JSON:</strong> مناسب للمطورين والنسخ الاحتياطي</li>
                    <li>• <strong>TXT:</strong> بسيط وخفيف</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}