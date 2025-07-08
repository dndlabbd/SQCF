// // app/api/addCatalog/route.js
// import { log } from 'console';
// import { NextRequest, NextResponse } from 'next/server';
// import { catalogItems } from '../catalogData.js';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     console.log("Received body:", body);

//     // Validate required fields
//     if (!body.title || !body.description) {
//       console.error("Missing title or description:", body);
//       return NextResponse.json(
//         { error: 'Title and description are required', received: body },
//         { status: 400 }
//       );
//     }

//     // Create new catalog item
//     const newItem = {
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       title: body.title,
//       description: body.description,
//       pdfUrl: body.pdfUrl || '', // <-- use pdfUrl, not imageUrl
//       pages: body.pages || [],
//       createdAt: new Date().toISOString(),
//       status: 'draft' // Default status for new items
//     };

//     // Add to storage
//     catalogItems.push(newItem);

//     return NextResponse.json(
//       { message: 'Catalog item added successfully', item: newItem },
//       { status: 201 }
//     );

//   } 
// //   catch (error) {
// //     console.error('Error adding catalog item:', error);
// //     return NextResponse.json(
// //       { error: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
//  catch (error) {
//     console.error("API Error:", error); // Add this line
//     return Response.json({ error: error.message }, { status: 400 });
//   }
// }

// // app/api/getCatalog/route.js
// export async function GET() {
//   try {
//     // Return all catalog items sorted by creation date (newest first)
//     const sortedItems = catalogItems.sort((a, b) => 
//       new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     return NextResponse.json(sortedItems, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching catalog items:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }




// import { catalogItems } from '../catalogData.js';

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file');
    
//     if (!file) {
//       return Response.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // Check if it's a CSV file
//     if (!file.name.endsWith('.csv')) {
//       return Response.json({ error: 'Please upload a CSV file' }, { status: 400 });
//     }

//     // Read the file content
//     const fileContent = await file.text();
    
//     // Parse CSV content - handle different line endings
//     const lines = fileContent.trim().split(/\r?\n/);
//     const headers = lines[0].split(',').map(header => header.trim());
    
//     // Validate headers
//     const expectedHeaders = ['Serial', 'Pdf File Name', 'Pdf Location', 'Title'];
//     const hasValidHeaders = expectedHeaders.every(header => 
//       headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
//     );
    
//     if (!hasValidHeaders) {
//       return Response.json({ 
//         error: 'Invalid CSV format. Expected headers: Serial, Pdf File Name, Pdf Location, Title' 
//       }, { status: 400 });
//     }

//     // Parse data rows and avoid duplicates
//     const newItems = [];
//     const duplicateItems = [];
    
//     for (let i = 1; i < lines.length; i++) {
//       const line = lines[i].trim();
//       if (!line) continue; // Skip empty lines
      
//       // Split by comma but handle commas within quotes/fields
//       const row = line.split(',').map(cell => cell.trim());
      
//       if (row.length >= 4) {
//         const serial = row[0] || '';
//         const pdfFileName = row[1] || '';
//         const pdfLocation = row[2] || '';
//         const title = row[3] || '';
        
//         // Check for duplicates based on serial or PDF filename
//         const isDuplicate = catalogItems.some(existing => 
//           existing.serial === serial || 
//           existing.pdfFileName === pdfFileName
//         );
        
//         if (isDuplicate) {
//           duplicateItems.push({ serial, pdfFileName, title });
//         } else {
//           const item = {
//             id: Date.now() + Math.random(), // More unique ID
//             serial: serial,
//             pdfFileName: pdfFileName,
//             pdfLocation: pdfLocation,
//             title: title,
//             uploadedAt: new Date().toISOString(),
//             uploadedFile: file.name,
//             status: 'active'
//           };
//           newItems.push(item);
//         }
//       }
//     }

//     // Add new items to catalogItems array
//     catalogItems.push(...newItems);

//     const response = { 
//       success: true, 
//       message: `Successfully processed ${file.name}`,
//       itemsAdded: newItems.length,
//       duplicatesSkipped: duplicateItems.length,
//       totalItems: catalogItems.length,
//       fileName: file.name
//     };

//     if (duplicateItems.length > 0) {
//       response.duplicates = duplicateItems;
//       response.message += ` (${duplicateItems.length} duplicates skipped)`;
//     }

//     return Response.json(response);

//   } catch (error) {
//     console.error('Error processing CSV:', error);
//     return Response.json({ 
//       error: 'Failed to process CSV file: ' + error.message 
//     }, { status: 500 });
//   }
// }






// ===== app/api/addCatalog/route.js =====
import { catalogItems } from '../catalogData.js';
import { extractPdfFromUrl } from '../extractPdfs/route.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if it's a CSV file
    if (!file.name.endsWith('.csv')) {
      return Response.json({ error: 'Please upload a CSV file' }, { status: 400 });
    }

    // Read the file content
    const fileContent = await file.text();
    
    // Parse CSV content - handle different line endings
    const lines = fileContent.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Validate headers
    const expectedHeaders = ['Serial', 'Pdf File Name', 'Pdf Location', 'Title'];
    const hasValidHeaders = expectedHeaders.every(header => 
      headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (!hasValidHeaders) {
      return Response.json({
        error: 'Invalid CSV format. Expected headers: Serial, Pdf File Name, Pdf Location, Title'
      }, { status: 400 });
    }

    // Parse data rows and avoid duplicates
    const newItems = [];
    const duplicateItems = [];
    let pdfExtractionErrors = [];

    console.log(`Processing ${lines.length - 1} records from CSV...`);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      try {
        // Split by comma but handle commas within quotes/fields
        const row = line.split(',').map(cell => cell.trim());
        
        if (row.length >= 4) {
          const serial = row[0] || '';
          const pdfFileName = row[1] || '';
          const pdfLocation = row[2] || '';
          const title = row[3] || '';
          
          // Skip empty records
          if (!serial || !pdfFileName || !pdfLocation || !title) {
            console.log(`Skipping empty record at row ${i}`);
            continue;
          }
          
          // Check for duplicates based on serial or PDF filename
          const isDuplicate = catalogItems.some(existing => 
            existing.serial === serial || 
            existing.pdfFileName === pdfFileName
          );
          
          if (isDuplicate) {
            duplicateItems.push({ serial, pdfFileName, title });
            console.log(`Duplicate found: ${serial} - ${title}`);
          } else {
            let finalPdfLocation = pdfLocation;
            let extractionStatus = 'original';
            
            // Try to extract PDF if it's a Google Drive link
            if (pdfLocation.includes('drive.google.com')) {
              console.log(`Extracting PDF for: ${title} (${i}/${lines.length - 1})`);
              
              try {
                const extractionResult = await extractPdfFromUrl(pdfLocation, pdfFileName);
                
                if (extractionResult.success) {
                  finalPdfLocation = extractionResult.localPath;
                  extractionStatus = 'extracted';
                  console.log(`✅ PDF extracted successfully: ${extractionResult.fileName}`);
                } else {
                  console.log(`❌ PDF extraction failed for ${title}: ${extractionResult.error}`);
                  pdfExtractionErrors.push({
                    title,
                    error: extractionResult.error
                  });
                  // Keep original URL as fallback
                  extractionStatus = 'failed';
                }
              } catch (extractError) {
                console.log(`❌ PDF extraction error for ${title}: ${extractError.message}`);
                pdfExtractionErrors.push({
                  title,
                  error: extractError.message
                });
                extractionStatus = 'failed';
              }
            }
            
            const item = {
              id: Date.now() + Math.random() + i, // More unique ID
              serial: serial,
              pdfFileName: pdfFileName,
              pdfLocation: finalPdfLocation,
              originalPdfLocation: pdfLocation, // Keep original for reference
              title: title,
              uploadedAt: new Date().toISOString(),
              uploadedFile: file.name,
              extractionStatus: extractionStatus,
              status: 'active'
            };
            newItems.push(item);
            console.log(`✅ Added: ${title} (${newItems.length}/${lines.length - 1 - duplicateItems.length})`);
          }
        }
      } catch (error) {
        console.error(`Error processing record ${i}:`, error);
        pdfExtractionErrors.push({
          title: `Row ${i}`,
          error: error.message
        });
      }
    }

    // Add new items to catalogItems array
    catalogItems.push(...newItems);

    const response = {
      success: true,
      message: `Successfully processed ${file.name}`,
      itemsAdded: newItems.length,
      duplicatesSkipped: duplicateItems.length,
      totalItems: catalogItems.length,
      fileName: file.name,
      pdfExtractionErrors: pdfExtractionErrors.length > 0 ? pdfExtractionErrors : undefined
    };

    if (duplicateItems.length > 0) {
      response.duplicates = duplicateItems;
      response.message += ` (${duplicateItems.length} duplicates skipped)`;
    }

    if (pdfExtractionErrors.length > 0) {
      response.message += ` (${pdfExtractionErrors.length} PDF extraction errors)`;
    }

    console.log('Upload completed:', response);
    return Response.json(response);

  } catch (error) {
    console.error('Error processing CSV:', error);
    return Response.json({
      error: 'Failed to process CSV file: ' + error.message
    }, { status: 500 });
  }
}
