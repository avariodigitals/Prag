import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch content from Prag-Admin backend
    const adminUrl = process.env.ECOMMERCE_ADMIN_API_URL || 'https://admin.prag.global';
    const res = await fetch(`${adminUrl}/api/pages/content`);
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data.pages || []);
    }
    
    // Fallback to hardcoded content if admin backend is unavailable
    return NextResponse.json([]);
  } catch (error) {
    console.error('Failed to fetch pages content:', error);
    return NextResponse.json([]);
  }
}
