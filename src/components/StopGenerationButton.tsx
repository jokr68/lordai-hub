import { Square } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface StopGenerationButtonProps {
  isGenerating: boolean;
  onStop: () => void;
}

export default function StopGenerationButton({ isGenerating, onStop }: StopGenerationButtonProps) {
  const { t } = useTranslation();

  if (!isGenerating) return null;

  return (
    <button
      onClick={onStop}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
      title={t('chat.stopGeneration')}
    >
      <Square className="w-4 h-4" />
      <span className="font-medium">{t('chat.stop')}</span>
    </button>
  );
}