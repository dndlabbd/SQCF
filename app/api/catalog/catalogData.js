// In-memory storage for catalog items
// Note: This will reset when the server restarts
// For production, consider using a database like MongoDB, PostgreSQL, etc.

export let catalogItems = [];

// Helper function to add items
export function addCatalogItem(item) {
  catalogItems.push(item);
}

// Helper function to remove items
export function removeCatalogItem(id) {
  const index = catalogItems.findIndex(item => item.id === id);
  if (index !== -1) {
    catalogItems.splice(index, 1);
    return true;
  }
  return false;
}

// Helper function to get all items
export function getAllCatalogItems() {
  return catalogItems;
}

// Helper function to clear all items
export function clearCatalogItems() {
  catalogItems.length = 0;
}