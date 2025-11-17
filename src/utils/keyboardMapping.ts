/**
 * @const {Record<string, string>} KEY_TO_PAD_MAP
 * @description A mapping of keyboard keys to their corresponding pad IDs.
 * This is used to trigger drum pads from keyboard events.
 */
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

/**
 * Retrieves the pad ID associated with a given keyboard key.
 * The key is normalized to lowercase to handle both uppercase and lowercase inputs.
 *
 * @param {string} key - The keyboard key that was pressed.
 * @returns {string | null} The corresponding pad ID, or null if no mapping exists.
 */
export const getPadIdFromKey = (key: string): string | null => {
  const normalizedKey = key === ' ' ? ' ' : key.toLowerCase();
  return KEY_TO_PAD_MAP[normalizedKey] || null;
};
