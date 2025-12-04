import { 
  Settings, 
  Wrench,
  Eye,
  TestTube2,
  Save,
  Rocket,
  FileJson,
  RotateCcw,
  Target,
  BarChart3,
  MessageSquare,
  Code2,
  GraduationCap,
  Zap,
  DollarSign,
  Sparkles
} from 'lucide-react';

export const IconMap = {
  settings: Settings,
  wrench: Wrench,
  eye: Eye,
  test: TestTube2,
  save: Save,
  rocket: Rocket,
  fileJson: FileJson,
  reset: RotateCcw,
  target: Target,
  barChart: BarChart3,
  message: MessageSquare,
  code: Code2,
  graduation: GraduationCap,
  zap: Zap,
  dollar: DollarSign,
  sparkles: Sparkles,
};

export type IconName = keyof typeof IconMap;

interface ProIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export default function ProIcon({ name, className = '', size = 20 }: ProIconProps) {
  const Icon = IconMap[name];
  return <Icon className={className} size={size} />;
}
