// "use client";

// import React from "react";
// import HTMLFlipBook, { HTMLFlipBookProps } from "react-pageflip";

// interface CatalogItem {
//   title: string;
//   imageUrl: string;
//   description: string;
//   pages?: string[]; // expect array of image URLs here
// }

// interface FlipBookItemProps {
//   item: CatalogItem;
//   isModal?: boolean; // if true, show bigger flipbook
// }

// const FlipBookItem = ({ item, isModal = false }: FlipBookItemProps) => {
//   // Compose pages array starting with cover page (imageUrl)
//   const pages = [
//     {
//       content: (
//         <div
//           style={{
//             padding: isModal ? 20 : 12,
//             textAlign: "center",
//             height: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "#1e293b",
//             borderRadius: 8,
//           }}
//         >
//           <img
//             src={item.imageUrl}
//             alt={`${item.title} Cover`}
//             style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8, objectFit: "cover" }}
//           />
//         </div>
//       ),
//     },
//     // If pages exist, map them, else fallback to simulated pages
//     ...(item.pages && item.pages.length > 0
//       ? item.pages.map((imgUrl, i) => ({
//           content: (
//             <div
//               style={{
//                  padding: isModal ? 20 : 12,
//                 textAlign: "center",
//                 height: "100%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 backgroundColor: "#1e293b",
//                 borderRadius: 8,
//               }}
//             >
//               <img
//                 src={imgUrl}
//                 alt={`${item.title} - page ${i + 1}`}
//                 style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8, objectFit: "cover" }}
//               />
//             </div>
//           ),
//         }))
//       : [
//           {
//             content: (
//               <div
//                 style={{
//                   padding: isModal ? 20 : 12,
//                   color: "white",
//                   fontFamily: "Arial, sans-serif",
//                   height: "100%",
//                   borderRadius: 8,
//                   backgroundColor: "#374151",
//                 }}
//               >
//                 <h2 className={`${isModal ? 'text-2xl' : 'text-lg'} font-semibold mb-4`}> {item.title}
//                 </h2>
//                 {/* <p className="text-gray-300">{item.description}</p> */}
//                   <p className={`text-gray-300 ${isModal ? 'text-base' : 'text-sm'}`}>
//                   {item.description}
//                 </p>
//               </div>
//             ),
//           },
//           // Add 8 more placeholder pages
//           ...Array.from({ length: 8 }).map((_, i) => ({
//             content: (
//               <div
//                 style={{
//                   padding: isModal ? 20 : 12,
//                   color: "white",
//                   fontFamily: "Arial, sans-serif",
//                   height: "100%",
//                   borderRadius: 8,
//                   backgroundColor: "#374151",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   fontSize: isModal ? 24 : 18,
//                 }}
//               >
//                 Page {i + 3}
//               </div>
//             ),
//           })),
//         ]),
//   ];

//   return (
//     <div
//       style={{
//         cursor: "pointer",
//         width: isModal ? "100%" : "220px",
//         margin: 0,
//         padding: 0,
//         borderRadius: 8,
//         boxShadow: isModal
//           ? "0 12px 32px rgba(0,0,0,0.6)"
//           : "0 4px 12px rgba(0,0,0,0.3)",
//         display: "flex",
//         justifyContent: "center",
//         transition: "all 0.3s ease",
//       }}
//             className={isModal ? "" : "hover:shadow-lg hover:shadow-blue-500/20"}

//     >
//       <HTMLFlipBook
//         // width={isModal ? 600 : 220}
//         // height={isModal ? 400 : 280}
//         // maxWidth={isModal ? 600 : 220}
//         // minWidth={isModal ? 600 : 220}
//         // maxHeight={isModal ? 400 : 280}
//         // minHeight={isModal ? 400 : 280}
//         // className="rounded-lg"
//         // style={{ margin: 0 }} // Remove auto margin
//         // startPage={0}
//         // size="fixed"
//         // drawShadow={true}
//         // maxShadowOpacity={0.5}
//         // showCover={true}
//         // mobileScrollSupport={true}
//         // flippingTime={600} // animation duration in ms
//         // usePortrait={false} // flipbook orientation
//         // startZIndex={0} // stacking context
//         // autoSize={false} // disable automatic resizing
//         // swipeDistance={30} // required swipe distance to flip
//         // clickEventForward={false} // forward click events to children
//         // useMouseEvents={true} // enable mouse events
//         // showPageCorners={true} // show corners on pages
//         // disableFlipByClick={false} // allow flipping by click

//                 width={isModal ? 600 : 200}
//         height={isModal ? 400 : 260}
//         maxWidth={isModal ? 600 : 200}
//         minWidth={isModal ? 600 : 200}
//         maxHeight={isModal ? 400 : 260}
//         minHeight={isModal ? 400 : 260}
//         className="rounded-lg"
//         style={{ margin: 0 }}
//         startPage={0}
//         size="fixed"
//         drawShadow={true}
//         maxShadowOpacity={0.5}
//         showCover={true}
//         mobileScrollSupport={true}
//         flippingTime={600}
//         usePortrait={false}
//         startZIndex={0}
//         autoSize={false}
//         swipeDistance={30}
//         clickEventForward={false}
//         useMouseEvents={true}
//         showPageCorners={true}
//         disableFlipByClick={false}
//       >
//         {pages.map((page, index) => (
//           <div
//             key={index}
//             className="page"
//             style={{
//               backgroundColor: "#334155",
//               borderRadius: 8,
//               overflow: "hidden",
//             }}
//           >
//             {page.content}
//           </div>
//         ))}
//       </HTMLFlipBook>
//     </div>
//   );
// };

// export default FlipBookItem;






"use client";

import React from "react";
import HTMLFlipBook, { HTMLFlipBookProps } from "react-pageflip";

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
            style={{ 
              maxWidth: "100%", 
              maxHeight: "100%", 
              borderRadius: 8,
              objectFit: "cover"
            }}
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
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "100%", 
                  borderRadius: 8,
                  objectFit: "cover"
                }}
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
                  backgroundColor: "#374151",
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
                  backgroundColor: "#374151",
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
        cursor: isModal ? "default" : "pointer",
        width: isModal ? "100%" : "280px",
        height: isModal ? "auto" : "360px",
        margin: 0,
        padding: 0,
        borderRadius: 8,
        boxShadow: isModal
          ? "0 12px 32px rgba(0,0,0,0.6)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        pointerEvents: isModal ? "auto" : "none", // Disable pointer events when not modal
        zIndex: 1,
      }}
    >
      <HTMLFlipBook
        width={isModal ? 600 : 280}
        height={isModal ? 400 : 360}
        maxWidth={isModal ? 600 : 280}
        minWidth={isModal ? 600 : 280}
        maxHeight={isModal ? 400 : 360}
        minHeight={isModal ? 400 : 360}
        className="rounded-lg"
        style={{ 
          margin: 0, 
          zIndex: 1,
          pointerEvents: isModal ? "auto" : "none", // Only allow interaction in modal
        }}
        startPage={0}
        size="fixed"
        drawShadow={true}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={isModal}
        flippingTime={600}
        usePortrait={false}
        startZIndex={0}
        autoSize={false}
        swipeDistance={30}
        clickEventForward={false}
        useMouseEvents={isModal}
        showPageCorners={isModal}
        disableFlipByClick={!isModal} // Only allow flipping in modal
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className="page"
            style={{
              backgroundColor: "#334155",
              borderRadius: 8,
              overflow: "hidden",
              position: "relative",
              zIndex: 1,
              pointerEvents: isModal ? "auto" : "none",
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
