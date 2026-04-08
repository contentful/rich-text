const escapeRegExp = /["'&<>]/g;

const escapeMap: Record<string, string> = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;',
};

export function escapeHtml(input: string): string {
  return input.replace(escapeRegExp, (ch) => escapeMap[ch]);
}
