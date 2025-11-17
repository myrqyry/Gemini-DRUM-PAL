/**
 * @class SecurityUtils
 * @description Provides utility functions for security-related tasks such as URL sanitization and HTML escaping.
 */
export class SecurityUtils {
  private static readonly ALLOWED_HOSTS = [
    'images.unsplash.com',
    'cdn.pixabay.com',
    'img.freepik.com',
  ];

  private static readonly MAX_URL_LENGTH = 2048;

  /**
   * Sanitizes a URL to ensure it is safe to use.
   * This method checks for allowed hosts, URL length, HTTPS protocol, and valid image file extensions.
   *
   * @param {string} url - The URL to be sanitized.
   * @returns {string | null} The sanitized URL, or null if the URL is invalid.
   */
  static sanitizeUrl(url: string): string | null {
    try {
      const trimmed = url.trim();

      if (trimmed.length > this.MAX_URL_LENGTH) {
        throw new Error('URL too long');
      }

      const parsed = new URL(trimmed);

      if (parsed.protocol !== 'https:') {
        throw new Error('Only HTTPS URLs are allowed');
      }

      const isAllowedHost = this.ALLOWED_HOSTS.some(host => parsed.hostname.endsWith(host));

      if (!isAllowedHost) {
        throw new Error(`Host ${parsed.hostname} not in allowed list`);
      }

      if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(parsed.pathname)) {
        throw new Error('Invalid image file extension');
      }

      return parsed.href;
    } catch (error) {
      console.error('URL validation failed:', error);
      return null;
    }
  }

  /**
   * Escapes HTML special characters in a string to prevent XSS attacks.
   *
   * @param {string} text - The string to be escaped.
   * @returns {string} The escaped string.
   */
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
