'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ParsedCharacter {
  name: string;
  description: string;
  personality: string;
  attributes: string;
  skills: string;
  avatar: string;
}

export default function ImportCharacterPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsedCharacter, setParsedCharacter] = useState<ParsedCharacter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('يرجى اختيار ملف PDF أو TXT فقط');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const parseFile = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const text = await file.text();
      
      // تحليل النص لاستخراج معلومات الشخصية
      const character = extractCharacterInfo(text);
      
      setParsedCharacter(character);
      setPreviewMode(true);
    } catch (err) {
      setError('فشل في قراءة الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const extractCharacterInfo = (text: string): ParsedCharacter => {
    // نمط بسيط لاستخراج المعلومات من النص
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let name = '';
    let description = '';
    let personality = '';
    let attributes = '';
    let skills = '';
    let avatar = '';

    // البحث عن الأقسام المختلفة
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      if (line.includes('الاسم') || line.includes('name:')) {
        name = lines[i + 1] || '';
      } else if (line.includes('الوصف') || line.includes('description:')) {
        description = lines[i + 1] || '';
      } else if (line.includes('الشخصية') || line.includes('personality:')) {
        personality = lines[i + 1] || '';
      } else if (line.includes('الاهتمامات') || line.includes('attributes:') || line.includes('interests:')) {
        attributes = lines[i + 1] || '';
      } else if (line.includes('المهارات') || line.includes('skills:')) {
        skills = lines[i + 1] || '';
      } else if (line.includes('الصورة') || line.includes('avatar:') || line.includes('image:')) {
        avatar = lines[i + 1] || '';
      }
    }

    // إذا لم يتم العثور على أقسام واضحة، استخدم السطر الأول كاسم والباقي كوصف
    if (!name && lines.length > 0) {
      name = lines[0];
      description = lines.slice(1).join('\n');
    }

    return {
      name: name || 'شخصية غير مسماة',
      description: description || 'لا يوجد وصف',
      personality: personality || 'ودود، مفيد',
      attributes: attributes || '',
      skills: skills || '',
      avatar: avatar || '',
    };
  };

  const handleImport = async () => {
    if (!parsedCharacter) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const personality = parsedCharacter.personality ? {
        traits: parsedCharacter.personality.split(',').map(t => t.trim()),
        mood: 'friendly',
        style: 'casual',
        backstory: parsedCharacter.description,
      } : null;

      const attributes = parsedCharacter.attributes ? {
        interests: parsedCharacter.attributes.split(',').map(a => a.trim()),
      } : null;

      const skills = parsedCharacter.skills ? 
        parsedCharacter.skills.split(',').map(s => s.trim()) : null;

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: parsedCharacter.name,
          description: parsedCharacter.description,
          avatar: parsedCharacter.avatar,
          personality,
          attributes,
          skills,
          isPublic: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'فشل في استيراد الشخصية');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: keyof ParsedCharacter, value: string) => {
    if (parsedCharacter) {
      setParsedCharacter({ ...parsedCharacter, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-300 hover:text-purple-200 mb-4 inline-block"
          >
            ← العودة للوحة التحكم
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            استيراد شخصية من ملف
          </h1>
          <p className="text-gray-300">
            قم برفع ملف PDF أو TXT يحتوي على معلومات الشخصية
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!previewMode ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-white mb-2">
                  اختر الملف *
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <div className="text-purple-300 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">
                      {file ? file.name : 'اضغط لاختيار ملف أو اسحبه هنا'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      PDF أو TXT فقط (الحد الأقصى 5MB)
                    </p>
                  </label>
                </div>
              </div>

              {file && (
                <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">ملف محدد:</p>
                  <p className="text-purple-200">{file.name}</p>
                  <p className="text-purple-300 text-sm">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                onClick={parseFile}
                disabled={!file || loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'جاري التحليل...' : 'تحليل الملف'}
              </button>

              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">💡 تنسيق الملف المقترح:</h3>
                <pre className="text-blue-200 text-sm whitespace-pre-wrap">
{`الاسم: اسم الشخصية
الوصف: وصف مفصل للشخصية وخلفيتها
الشخصية: ودود، ذكي، مغامر
الاهتمامات: القراءة، السفر، التكنولوجيا
المهارات: حل المشكلات، التواصل، الإبداع
الصورة: https://example.com/avatar.jpg`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                معاينة الشخصية
              </h2>

              <div>
                <label htmlFor="preview-name" className="block text-sm font-medium text-white mb-2">
                  اسم الشخصية *
                </label>
                <input
                  type="text"
                  id="preview-name"
                  value={parsedCharacter?.name || ''}
                  onChange={(e) => handleEdit('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="preview-description" className="block text-sm font-medium text-white mb-2">
                  الوصف *
                </label>
                <textarea
                  id="preview-description"
                  value={parsedCharacter?.description || ''}
                  onChange={(e) => handleEdit('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="preview-avatar" className="block text-sm font-medium text-white mb-2">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  id="preview-avatar"
                  value={parsedCharacter?.avatar || ''}
                  onChange={(e) => handleEdit('avatar', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label htmlFor="preview-personality" className="block text-sm font-medium text-white mb-2">
                  صفات الشخصية (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  id="preview-personality"
                  value={parsedCharacter?.personality || ''}
                  onChange={(e) => handleEdit('personality', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ودود، ذكي، مغامر"
                />
              </div>

              <div>
                <label htmlFor="preview-attributes" className="block text-sm font-medium text-white mb-2">
                  الاهتمامات (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  id="preview-attributes"
                  value={parsedCharacter?.attributes || ''}
                  onChange={(e) => handleEdit('attributes', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="القراءة، السفر، التكنولوجيا"
                />
              </div>

              <div>
                <label htmlFor="preview-skills" className="block text-sm font-medium text-white mb-2">
                  المهارات (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  id="preview-skills"
                  value={parsedCharacter?.skills || ''}
                  onChange={(e) => handleEdit('skills', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="حل المشكلات، التواصل، الإبداع"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleImport}
                  disabled={loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'جاري الاستيراد...' : 'استيراد الشخصية'}
                </button>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  إعادة تحليل
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}