import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TypingIndicatorProps {
  isTyping: boolean;
  characterName?: string;
}

export default function TypingIndicator({ isTyping, characterName }: TypingIndicatorProps) {
  const { t } = useTranslation();
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 bg-blue-600 rounded-full transition-opacity duration-300 ${
              i < dots ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {characterName ? `${characterName} ` : ''}{t('chat.typing')}
      </span>
    </div>
  );
}