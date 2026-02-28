'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceChatProps {
  onVoiceInput: (text: string) => void;
  onVoiceOutput: (text: string) => void;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export default function VoiceChat({
  onVoiceInput,
  onVoiceOutput,
  isListening = false,
  isSpeaking = false,
}: VoiceChatProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    // Check browser support
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    
    setIsSupported(speechRecognitionSupported && speechSynthesisSupported);

    if (speechRecognitionSupported) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ar-SA';

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          onVoiceInput(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    }

    if (speechSynthesisSupported) {
      const synth = window.speechSynthesis;
      setSynthesis(synth);

      // Load voices
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        
        // Select Arabic voice by default
        const arabicVoice = availableVoices.find(voice => voice.lang.startsWith('ar'));
        if (arabicVoice) {
          setSelectedVoice(arabicVoice);
        }
      };

      loadVoices();
      synth.onvoiceschanged = loadVoices;
    }
  }, [onVoiceInput]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speak = (text: string) => {
    if (synthesis && selectedVoice) {
      // Cancel any ongoing speech
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.volume = volume;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'ar-SA';

      utterance.onend = () => {
        onVoiceOutput('');
      };

      synthesis.speak(utterance);
      onVoiceOutput(text);
    }
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      onVoiceOutput('');
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
        <p className="text-red-200">
          ⚠️ متصفحك لا يدعم ميزات الصوت. يرجى استخدام Chrome أو Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">🎙️ المحادثة الصوتية</h3>
        <div className="flex gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-lg transition ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isListening ? '⏹️ إيقاف' : '🎤 تسجيل'}
          </button>
          <button
            onClick={isSpeaking ? stopSpeaking : () => {}}
            className={`px-4 py-2 rounded-lg transition ${
              isSpeaking
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            disabled={!isSpeaking}
          >
            ⏹️ إيقاف
          </button>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            صوت الشخصية
          </label>
          <select
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {voices.filter(voice => voice.lang.startsWith('ar')).map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              مستوى الصوت: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              السرعة: {rate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              النبرة: {pitch}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex gap-4">
        <div className={`flex-1 rounded-lg p-4 text-center ${
          isListening ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-500/20 border border-gray-500'
        }`}>
          <div className={`text-2xl mb-2 ${isListening ? 'animate-pulse' : ''}`}>
            🎤
          </div>
          <p className="text-white font-medium">
            {isListening ? 'جاري الاستماع...' : 'جاهز للاستماع'}
          </p>
        </div>

        <div className={`flex-1 rounded-lg p-4 text-center ${
          isSpeaking ? 'bg-purple-500/20 border border-purple-500' : 'bg-gray-500/20 border border-gray-500'
        }`}>
          <div className={`text-2xl mb-2 ${isSpeaking ? 'animate-pulse' : ''}`}>
            🔊
          </div>
          <p className="text-white font-medium">
            {isSpeaking ? 'جاري التحدث...' : 'جاهز للتحدث'}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">💡 كيفية الاستخدام:</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• اضغط على "تسجيل" للبدء في التحدث</li>
          <li>• تحدث بوضوح باللغة العربية</li>
          <li>• سيتم تحويل صوتك إلى نص تلقائياً</li>
          <li>• ردود الشخصية ستُقرأ بصوت عربي</li>
        </ul>
      </div>
    </div>
  );
}