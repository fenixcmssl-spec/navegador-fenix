import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const debPath = path.join(process.cwd(), 'public', 'fenix-browser_1.0.0_amd64.deb');
    
    if (!fs.existsSync(debPath)) {
      return NextResponse.json(
        { error: 'Archivo .deb no encontrado' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(debPath);
    const stats = fs.statSync(debPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.debian.binary-package',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'attachment; filename="fenix-browser_1.0.0_amd64.deb"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
