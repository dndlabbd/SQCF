// ===== app/api/deleteCatalog/[id]/route.js =====
import { NextResponse } from 'next/server';
import { catalogItems } from '../../catalogData.js';
import fs from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Find item index
    const itemIndex = catalogItems.findIndex(item => item.id == id); // Use == for loose comparison
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Catalog item not found' },
        { status: 404 }
      );
    }

    // Get the item to delete
    const itemToDelete = catalogItems[itemIndex];

    // If the item has a locally stored PDF, delete it
    if (itemToDelete.extractionStatus === 'extracted' && itemToDelete.pdfLocation) {
      try {
        const pdfPath = path.join(process.cwd(), 'public', itemToDelete.pdfLocation);
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
          console.log(`Deleted PDF file: ${pdfPath}`);
        }
      } catch (error) {
        console.error('Error deleting PDF file:', error);
        // Continue with deletion even if PDF file deletion fails
      }
    }

    // Remove item from storage
    const deletedItem = catalogItems.splice(itemIndex, 1)[0];

    return NextResponse.json(
      { message: 'Catalog item deleted successfully', item: deletedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting catalog item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
