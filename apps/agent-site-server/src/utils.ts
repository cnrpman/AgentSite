import crypto from 'node:crypto';

export function buildNavigation(segments: string[], linkUntil = segments.length): string {
  const parts: string[] = ['[Home](/)'];
  let acc = '';
  for (const [index, segment] of segments.entries()) {
    acc = acc ? `${acc}/${segment}` : segment;
    if (index < linkUntil) {
      parts.push(`[${segment}](/${acc}/)`);
    } else {
      parts.push(segment);
    }
  }
  return parts.join(' > ');
}

export function renderHeader(title: string, navigation: string, summary: string): string {
  return `# ${title}\n\n**Navigation:** ${navigation}\n\n**Summary:** ${summary}\n\n---\n`;
}

export function computeEtag(content: Buffer): string {
  const hash = crypto.createHash('sha1').update(content).digest('hex');
  return `"${hash}"`;
}
