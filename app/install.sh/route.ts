import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const scriptPath = path.join(process.cwd(), 'public', 'install.sh');
    let content = fs.readFileSync(scriptPath, 'utf8');

    // Dynamically replace the default URL with the actual host request origin
    content = content.replace(
      /BASE_URL="\$\{FENIX_SERVER_URL:-[^}]+\}"/,
      `BASE_URL="\${FENIX_SERVER_URL:-${origin}}"`
    );

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/x-shellscript; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Disposition': 'inline; filename="install.sh"',
      },
    });
  } catch {
    return new NextResponse('#!/bin/bash\necho "Error cargando instalador Fénix"', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
