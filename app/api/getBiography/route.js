// app/api/getBiography/route.js

export async function GET() {
  const sections = [
    {
      title: "Early Life and Education",
      yearRange: "1932–1949",
      imageUrl: "/images/youngKc.png", // optional
      content: "Qayyum Chowdhury was born in Feni in 1932. His father, Abdul Quddus Chowdhury, was a landholder, and his family emphasized education. He studied at multiple schools before passing his Matriculation Exam in 1949.",
    },
    {
      title: "Art Institute and Formative Years",
      yearRange: "1950–1954",
      imageUrl: "/images/ArtInstitute.png", // optional
      content: "He joined the Government Art Institute in Dhaka after Matriculation. Under the guidance of Zainul Abedin, Qayyum developed his skills in fine arts and graphic art, graduating in 1954.",
    },
    {
      title: "Career and Contributions",
      yearRange: "1955–1984",
      imageUrl: "/images/career&Contribution.png",
      content: "Qayyum Chowdhury became a teacher at the same institute he graduated from. He played a vital role in art education in East Pakistan and Bangladesh. He was deeply involved in curriculum design and nurturing young talent.",
    },
    {
      title: "Recognition and Legacy",
      yearRange: "1985–2014",
      imageUrl: "/images/recog&Legacy.png",
      content: "He was awarded the Ekushey Padak in 1984. His contributions include iconic book covers, murals, and illustrations. He passed away in 2014 while delivering a speech at an event.",
    }
  ];

  return Response.json(sections);
}
