// // api/catalog/extractPdfs.js - Background service to extract PDFs

// import fs from 'fs';
// import path from 'path';
// import fetch from 'node-fetch';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { catalogId } = req.body;

//     // Get catalog item from database
//     const catalogItem = await getCatalogItem(catalogId);
//     if (!catalogItem) {
//       return res.status(404).json({ message: 'Catalog item not found' });
//     }

//     // Check if PDF is already extracted
//     if (catalogItem.pdfLocation && !catalogItem.pdfLocation.includes('drive.google.com')) {
//       return res.status(200).json({ 
//         message: 'PDF already extracted',
//         pdfPath: catalogItem.pdfLocation 
//       });
//     }

//     // Extract PDF from Google Drive
//     const localPdfPath = await extractPdfFromGoogleDrive(
//       catalogItem.pdfLocation || catalogItem.originalGoogleDriveUrl,
//       catalogItem.title
//     );

//     // Update database with local PDF path
//     await updateCatalogItem(catalogId, {
//       pdfLocation: localPdfPath,
//       originalGoogleDriveUrl: catalogItem.pdfLocation,
//       extractedAt: new Date()
//     });

//     res.status(200).json({ 
//       message: 'PDF extracted successfully',
//       pdfPath: localPdfPath 
//     });

//   } catch (error) {
//     console.error('PDF extraction error:', error);
//     res.status(500).json({ message: 'Extraction failed', error: error.message });
//   }
// }

// async function extractPdfFromGoogleDrive(googleDriveUrl, fileName) {
//   try {
//     // Extract file ID from Google Drive URL
//     const fileId = googleDriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
//     if (!fileId) {
//       throw new Error('Invalid Google Drive URL');
//     }

//     // Try different download methods for Google Drive
//     const downloadUrls = [
//       `https://drive.google.com/uc?export=download&id=${fileId}`,
//       `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`,
//       `https://docs.google.com/uc?export=download&id=${fileId}`
//     ];

//     let response;
//     for (const url of downloadUrls) {
//       try {
//         response = await fetch(url, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         });
        
//         if (response.ok) break;
//       } catch (err) {
//         console.log(`Failed with URL: ${url}`, err.message);
//         continue;
//       }
//     }

//     if (!response || !response.ok) {
//       throw new Error('Failed to fetch PDF from all attempted URLs');
//     }

//     // Create pdfs directory if it doesn't exist
//     const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
//     if (!fs.existsSync(pdfDir)) {
//       fs.mkdirSync(pdfDir, { recursive: true });
//     }

//     // Generate unique filename
//     const timestamp = Date.now();
//     const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
//     const pdfFileName = `${timestamp}_${sanitizedFileName}.pdf`;
//     const pdfPath = path.join(pdfDir, pdfFileName);

//     // Save PDF to local storage
//     const buffer = await response.buffer();
    
//     // Verify it's actually a PDF
//     if (!buffer.toString('hex', 0, 4).startsWith('25504446')) { // PDF magic number
//       throw new Error('Downloaded file is not a valid PDF');
//     }

//     fs.writeFileSync(pdfPath, buffer);

//     // Return local path for database storage
//     return `/pdfs/${pdfFileName}`;
//   } catch (error) {
//     console.error('Error extracting PDF:', error);
//     throw error;
//   }
// }

// // Helper functions (adjust based on your database)
// async function getCatalogItem(id) {
//   // Replace with your database query
//   // Example: return await prisma.catalogItem.findUnique({ where: { id } });
//   return null;
// }

// async function updateCatalogItem(id, data) {
//   // Replace with your database update
//   // Example: return await prisma.catalogItem.update({ where: { id }, data });
//   return null;
// }



// ===== app/api/extractPdfs/route.js =====
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Ensure pdfs directory exists
const ensurePdfsDir = async () => {
  const pdfsDir = path.join(process.cwd(), 'public', 'pdfs');
  try {
    await mkdir(pdfsDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  return pdfsDir;
};

// Extract file ID from Google Drive URL
const extractGoogleDriveFileId = (url) => {
  const patterns = [
    /\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /file\/d\/([a-zA-Z0-9-_]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Download PDF from Google Drive
const downloadPdfFromGoogleDrive = async (fileId, filename) => {
  try {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    const response = await fetch(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/pdf')) {
      // Sometimes Google Drive returns HTML for large files, try alternative method
      const alternativeUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
      const altResponse = await fetch(alternativeUrl);
      
      if (!altResponse.ok) {
        throw new Error('PDF download failed - file might be too large or require permission');
      }
      
      return await altResponse.arrayBuffer();
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

// Main extraction function
async function extractPdfFromUrl(pdfUrl, pdfFileName) {
  try {
    console.log('Extracting PDF:', pdfFileName, 'from:', pdfUrl);
    
    // Check if it's a Google Drive URL
    if (!pdfUrl.includes('drive.google.com')) {
      throw new Error('Only Google Drive URLs are supported for extraction');
    }

    const fileId = extractGoogleDriveFileId(pdfUrl);
    if (!fileId) {
      throw new Error('Could not extract file ID from Google Drive URL');
    }

    // Ensure pdfs directory exists
    const pdfsDir = await ensurePdfsDir();

    // Create safe filename
    const safeFileName = pdfFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeFileName}`;
    const localPath = path.join(pdfsDir, uniqueFileName);
    const publicPath = `/pdfs/${uniqueFileName}`;

    // Download PDF
    console.log('Downloading PDF from Google Drive...');
    const pdfBuffer = await downloadPdfFromGoogleDrive(fileId, uniqueFileName);

    // Save PDF locally
    await writeFile(localPath, Buffer.from(pdfBuffer));
    
    console.log('PDF saved successfully:', publicPath);
    
    return {
      success: true,
      localPath: publicPath,
      fileName: uniqueFileName,
      originalUrl: pdfUrl
    };

  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      error: error.message,
      originalUrl: pdfUrl
    };
  }
}

// API endpoint for manual extraction (if needed)
export async function POST(req) {
  try {
    const { pdfUrl, pdfFileName } = await req.json();
    
    if (!pdfUrl || !pdfFileName) {
      return NextResponse.json(
        { error: 'PDF URL and filename are required' },
        { status: 400 }
      );
    }

    const result = await extractPdfFromUrl(pdfUrl, pdfFileName);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'PDF extracted successfully',
        pdfPath: result.localPath
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF extraction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}