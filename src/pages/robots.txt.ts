const bots = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Claude-Web', 'anthropic-ai', 'Perplexity-User', 'CCBot', 'Bytespider', 'Amazonbot', 'Meta-ExternalAgent', 'cohere-ai', 'DuckAssistBot', 'MistralAI-User'];
export const GET = () => {
  const body = [
    '# WeldFacts.com — crawlers, including AI search and assistants, may read the site.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    'Sitemap: https://weldfacts.com/sitemap-index.xml',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
