import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const urlObj = new URL(targetUrl);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return NextResponse.json({ error: 'Invalid URL protocol' }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) AeroChrome/1.0.0 Debian/12 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/json')) {
      return NextResponse.json({
        url: targetUrl,
        contentType,
        status: response.status,
        isBinary: true,
        message: 'Binary content or media stream detected.',
      });
    }

    const rawText = await response.text();

    // Extract basic title, meta tags, and plain text
    let title = targetUrl;
    const titleMatch = rawText.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }

    let description = '';
    const descMatch = rawText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim();
    }

    // Extract icon if present
    let favicon = `https://${urlObj.hostname}/favicon.ico`;
    const iconMatch = rawText.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i);
    if (iconMatch && iconMatch[1]) {
      const iconHref = iconMatch[1];
      if (iconHref.startsWith('http')) {
        favicon = iconHref;
      } else if (iconHref.startsWith('//')) {
        favicon = `https:${iconHref}`;
      } else if (iconHref.startsWith('/')) {
        favicon = `https://${urlObj.hostname}${iconHref}`;
      } else {
        favicon = `https://${urlObj.hostname}/${iconHref}`;
      }
    }

    // Extract readable clean text for reader mode & AI
    const cleanedText = rawText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return NextResponse.json({
      url: targetUrl,
      title,
      description,
      favicon,
      status: response.status,
      contentLength: rawText.length,
      plainText: cleanedText.slice(0, 10000), // First 10k chars for AI and reader
      rawHtml: rawText.slice(0, 150000), // Return sanitized chunk for rendering
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch external URL';
    return NextResponse.json({ error: message, url: targetUrl }, { status: 500 });
  }
}
