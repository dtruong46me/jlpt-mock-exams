import React from 'react';

// --- Utility ---
export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, className, variant = 'primary', size = 'md', ...props 
}) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
      onClick && "cursor-pointer hover:border-primary-300 hover:shadow-md transition-all",
      className
    )}
  >
    {children}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color = "bg-slate-100 text-slate-800", className }) => (
  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", color, className)}>
    {children}
  </span>
);

// --- Progress Bar ---
export const Progress: React.FC<{ value: number; max?: number; className?: string; colorClass?: string }> = ({ value, max = 100, className, colorClass = "bg-primary-600" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-2.5 w-full bg-slate-100 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full transition-all duration-500 ease-out", colorClass)} 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  );
};

// --- Audio Player ---
import { Play, Pause } from './Icons';

export const AudioPlayer: React.FC<{ src: string; onEnded?: () => void }> = ({ src, onEnded }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center gap-3">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button 
        onClick={togglePlay}
        className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between text-xs text-slate-500 font-mono">
           <span>PLAYING AUDIO</span>
           <span>{audioRef.current ? Math.floor(audioRef.current.duration || 0) : '--'}s</span>
        </div>
        {/* Fake waveform viz */}
        <div className="h-6 flex items-end gap-0.5 opacity-60">
           {Array.from({length: 30}).map((_, i) => (
             <div 
                key={i} 
                className={cn("w-1 bg-slate-800 rounded-t-sm transition-all", i/30 * 100 < progress ? "bg-primary-500" : "bg-slate-300")}
                style={{ height: `${Math.max(20, Math.random() * 100)}%`}}
             />
           ))}
        </div>
      </div>
    </div>
  );
};
