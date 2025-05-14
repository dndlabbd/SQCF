export async function GET() {
    const catalogData = [
      {
        title: "Art Book 1",
        imageUrl: "/images/catalog1.jpg",
        description: "A collection of early works",
      },
      {
        title: "Art Book 2",
        imageUrl: "/images/catalog3.webp",
        description: "Sketches and rare prints",
      },
      {
        title: "Art Book 3",
        imageUrl: "/images/catalog2.webp",
        description: "Published collections from exhibitions",
      },
      {
        title: "Art Book 4",
        imageUrl: "/images/catalog5.jpg",
        description: "Published collections from exhibitions",
      },
      {
        title: "Art Book 5",
        imageUrl: "/images/catalog4.jpg",
        description: "Published collections from exhibitions",
      },
      {
        title: "Art Book 6",
        imageUrl: "/images/catalog6.jpg",
        description: "Published collections from exhibitions",
      },
    ];
  
    return new Response(JSON.stringify(catalogData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  