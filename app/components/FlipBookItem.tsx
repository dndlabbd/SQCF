"use client";

import React from "react";
import HTMLFlipBook, {HTMLFlipBookProps} from "react-pageflip";

interface CatalogItem {
  title: string;
  imageUrl: string;
  description: string;
  pages?: string[]; // expect array of image URLs here
}

interface FlipBookItemProps {
  item: CatalogItem;
  isModal?: boolean; // if true, show bigger flipbook
}

const FlipBookItem = ({ item, isModal = false }: FlipBookItemProps) => {
  // Compose pages array starting with cover page (imageUrl)
  const pages = [
    {
      content: (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1e293b",
            borderRadius: 8,
          }}
        >
          <img
            src={item.imageUrl}
            alt={`${item.title} Cover`}
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }}
          />
        </div>
      ),
    },
    // If pages exist, map them, else fallback to simulated pages
    ...(item.pages && item.pages.length > 0
      ? item.pages.map((imgUrl, i) => ({
          content: (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1e293b",
                borderRadius: 8,
              }}
            >
              <img
                src={imgUrl}
                alt={`${item.title} - page ${i + 1}`}
                style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }}
              />
            </div>
          ),
        }))
      : [
          {
            content: (
              <div
                style={{
                  padding: 20,
                  color: "white",
                  fontFamily: "Arial, sans-serif",
                  height: "100%",
                  borderRadius: 8,
                }}
              >
                <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ),
          },
          // Add 8 more placeholder pages
          ...Array.from({ length: 8 }).map((_, i) => ({
            content: (
              <div
                style={{
                  padding: 20,
                  color: "white",
                  fontFamily: "Arial, sans-serif",
                  height: "100%",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                }}
              >
                Page {i + 3}
              </div>
            ),
          })),
        ]),
  ];

  return (
    <div
      style={{
        cursor: "pointer",
        margin: isModal ? "auto" : "0",
        maxWidth: isModal ? 700 : "100%",
        borderRadius: 8,
        boxShadow: isModal
          ? "0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      <HTMLFlipBook
        width={isModal ? 700 : 300}
        height={isModal ? 500 : 400}
          maxWidth={isModal ? 700 : 300}
  minWidth={200}
  maxHeight={isModal ? 500 : 400}
  minHeight={400}
        // showSwipeHint={true}
        className="rounded-lg"
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className="page"
            style={{
              backgroundColor: "#334155",
              borderRadius: 8,
              overflow: "auto",
            }}
          >
            {page.content}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default FlipBookItem;
