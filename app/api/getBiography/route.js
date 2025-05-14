// app/api/getBiography/route.js

export async function GET() {
  const sections = [
    {
      title: "প্রারম্ভিক জীবন ও শিক্ষা", // Translated title
      yearRange: "১৯৩২–১৯৪৯",
      imageUrl: "/images/youngKc.png", // optional
      content: `কাইয়ুম চৌধুরী ১৯৩২ সালে ফেনীতে জন্মগ্রহণ করেন। তাঁর পিতা আবদুল কুদ্দুস চৌধুরী ছিলেন একজন জমিদার এবং তাঁর পরিবার শিক্ষার প্রতি বিশেষ গুরুত্ব দিত। শৈশবে তিনি চট্টগ্রামে চলে আসেন এবং বিভিন্ন স্কুলে পড়াশোনা করেন। ১৯৪৯ সালে তিনি ম্যাট্রিকুলেশন পরীক্ষায় উত্তীর্ণ হন।
      
এরপর তিনি ঢাকার গভর্নমেন্ট আর্ট ইনস্টিটিউটে ভর্তি হন। সেখানে তিনি বিখ্যাত শিল্পী জয়নুল আবেদিনের তত্ত্বাবধানে চারুকলা ও গ্রাফিক আর্টে দক্ষতা অর্জন করেন। ১৯৫৪ সালে তিনি স্নাতক ডিগ্রি অর্জন করেন। শিক্ষাজীবন থেকেই তিনি শিল্পকলার প্রতি গভীর আগ্রহ প্রকাশ করেন এবং পরবর্তীতে বাংলাদেশের শিল্প আন্দোলনে গুরুত্বপূর্ণ ভূমিকা পালন করেন।`,
    },
    {
      title: "আর্ট ইনস্টিটিউট এবং গঠনমূলক বছর", // Translated title
      yearRange: "১৯৫০–১৯৫৪",
      imageUrl: "/images/ArtInstitute.png", // optional
      content: "He joined the Government Art Institute in Dhaka after Matriculation. Under the guidance of Zainul Abedin, Qayyum developed his skills in fine arts and graphic art, graduating in 1954.",
    },
    {
      title: "ক্যারিয়ার এবং অবদান", // Translated title
      yearRange: "১৯৫৫–১৯৮৪",
      imageUrl: "/images/career&Contribution.png",
      content: "Qayyum Chowdhury became a teacher at the same institute he graduated from. He played a vital role in art education in East Pakistan and Bangladesh. He was deeply involved in curriculum design and nurturing young talent.",
    },
    {
      title: "স্বীকৃতি এবং উত্তরাধিকার", // Translated title
      yearRange: "১৯৮৫–২০১৪",
      imageUrl: "/images/recog&Legacy.png",
      content: "He was awarded the Ekushey Padak in 1984. His contributions include iconic book covers, murals, and illustrations. He passed away in 2014 while delivering a speech at an event.",
    }
  ];

  return Response.json(sections);
}
