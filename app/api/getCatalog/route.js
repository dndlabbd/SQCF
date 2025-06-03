export async function GET() {
  const catalogData = [
    {
      title: "Art Book 1",
      imageUrl: "/images/Catalog1/Cover1.jpg",
      description: "A collection of early works",
      pages: [
        
        "/images/Catalog1/image1.jpg",

        "/images/Catalog1/image2.jpg",
        "/images/Catalog1/image3.jpg",
        "/images/Catalog1/image4.jpg",
        "/images/Catalog1/image5.jpg",
        "/images/Catalog1/image6.JPG",
        "/images/Catalog1/image7.JPG",
        "/images/Catalog1/image8.JPG",
        "/images/Catalog1/image9.JPG",
        "/images/Catalog1/image10.JPG",
        "/images/Catalog1/image11.JPG",
        "/images/Catalog1/image12.JPG",
        "/images/Catalog1/image13.JPG",
        "/images/Catalog1/image14.JPG",
        "/images/Catalog1/image15.JPG",
        "/images/Catalog1/image16.JPG",
        "/images/Catalog1/image17.JPG",
        "/images/Catalog1/image18.JPG",
        "/images/Catalog1/image19.JPG",

        "/images/Catalog1/image20.JPG",
        "/images/Catalog1/image21.JPG",
        "/images/Catalog1/image22.JPG",
        "/images/Catalog1/image23.JPG",
        "/images/Catalog1/image24.JPG",
        "/images/Catalog1/image25.JPG",
        "/images/Catalog1/image26.JPG",
        "/images/Catalog1/image27.JPG",
        "/images/Catalog1/image28.JPG",
        "/images/Catalog1/image29.JPG",
        "/images/Catalog1/image30.JPG",
        "/images/Catalog1/image31.JPG",

        // Add more pages (total 10) here
      ],
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

  // Sort by numerical order in title
  const sortedData = catalogData.sort((a, b) => {
    const numA = parseInt(a.title.match(/\d+/)[0]);
    const numB = parseInt(b.title.match(/\d+/)[0]);
    return numA - numB;
  });

  return new Response(JSON.stringify(sortedData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
