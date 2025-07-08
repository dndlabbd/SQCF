// ===== app/api/getCatalog/route.js =====
import { NextResponse } from 'next/server';
import { catalogItems } from '../catalogData.js';

export async function GET() {
  try {
    console.log("Current catalogItems:", catalogItems);
    
    // Return all catalog items sorted by upload date (newest first)
    const sortedItems = catalogItems.sort((a, b) => 
      new Date(b.uploadedAt) - new Date(a.uploadedAt)
    );

    return NextResponse.json(sortedItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
