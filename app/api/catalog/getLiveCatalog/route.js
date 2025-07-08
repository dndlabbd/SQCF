import { NextResponse } from 'next/server';
import { catalogItems } from '../catalogData';

// app/api/getLiveCatalog/route.js (for user-facing catalog)
export async function GET() {
  try {
    // Return only items with 'live' status
    const liveItems = catalogItems.filter(item => item.status === 'live');
    
    const sortedLiveItems = liveItems.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json(sortedLiveItems, { status: 200 });

  } catch (error) {
    console.error('Error fetching live catalog items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}