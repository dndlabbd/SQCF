import { NextResponse } from 'next/server';
import { catalogItems } from '../catalogData';

// app/api/updateCatalogStatus/route.js
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // Validate status
    const validStatuses = ['draft', 'live', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: draft, live, or archived' },
        { status: 400 }
      );
    }

    // Find and update item
    const itemIndex = catalogItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Catalog item not found' },
        { status: 404 }
      );
    }

    catalogItems[itemIndex].status = status;
    catalogItems[itemIndex].updatedAt = new Date().toISOString();

    return NextResponse.json(
      { message: 'Status updated successfully', item: catalogItems[itemIndex] },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating catalog status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}