import { Bot as BotIcon } from 'lucide-react';

interface BotProps {
  size?: number;
  className?: string;
}

export default function Bot({ size = 16, className = '' }: BotProps) {
  return <BotIcon size={size} className={className} />;
}
