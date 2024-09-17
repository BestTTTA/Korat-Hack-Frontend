import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL ไม่ถูกต้อง' }, { status: 400 });
  }

  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    const finalUrl = response.url;

    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = finalUrl.match(regex);

    if (match) {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);
      return NextResponse.json({ lat, lon });
    } else {
      return NextResponse.json({ error: 'ไม่สามารถดึงพิกัดได้' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}
