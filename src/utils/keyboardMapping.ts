export const KEY_TO_PAD_MAP: Record<string, string> = {
  'q': 'hihat_closed',
  'w': 'hihat_open',
  'e': 'cymbal_crash',
  'a': 'snare',
  's': 'tom1',
  'd': 'clap',
  'c': 'fx1',
  ' ': 'kick',
} as const;

export const getPadIdFromKey = (key: string): string | null => {
  const normalizedKey = key === ' ' ? ' ' : key.toLowerCase();
  return KEY_TO_PAD_MAP[normalizedKey] || null;
};
