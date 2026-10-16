/**
 * Returns a fixed reply for common customer questions.
 *
 * IMPORTANT:
 * - Keep dynamic questions (price, stock, product availability, size, color)
 *   OUT of this function.
 * - These replies do not call Gemini or Prisma.
 * - Supports Bangla, Banglish and English variations.
 */

export const getQuickReply = (message: string): string | null => {
  const text = message
    .toLowerCase()
    .trim()
    .replace(/[?؟!।,.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return null;
  }

  // ============================================================
  // GREETING
  // ============================================================

  if (
    /^(হ্যালো|হেলো|হাই|হেই|হাইই|হ্যালোও|hello|helo|hi|hey|heyy|hii|assalamualaikum|assalamu alaikum|আসসালামু আলাইকুম|আসসালামুয়ালাইকুম|সালাম|সালাম আলাইকুম)$/.test(
      text,
    )
  ) {
    return 'হ্যালো! 👋 Sera Place -তে আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?';
  }

  // Greeting + question
  if (
    /^(হ্যালো|হেলো|হাই|হেই|hello|helo|hi|hey|assalamu alaikum|আসসালামু আলাইকুম|সালাম).*$/i.test(
      text,
    ) &&
    text.length < 35
  ) {
    return 'হ্যালো! 👋 Sera Place -তে আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?';
  }

  // ============================================================
  // HOW ARE YOU
  // ============================================================

  if (
    /^(কেমন আছেন|কেমন আছো|কেমন আছ|কী খবর|কি খবর|সব কেমন চলছে|ভালো আছেন|ভাল আছেন|how are you|how r u|how are u|hows it going|how is it going)$/.test(
      text,
    )
  ) {
    return 'আলহামদুলিল্লাহ, ভালো আছি 😊 আপনাকে কীভাবে সাহায্য করতে পারি?';
  }

  // ============================================================
  // THANK YOU
  // ============================================================

  if (
    /^(ধন্যবাদ|অনেক ধন্যবাদ|থ্যাংকস|থ্যাঙ্কস|thanks|thank you|thank u|thnx|tnx|thx|many thanks|thanks a lot|অনেক অনেক ধন্যবাদ)$/.test(
      text,
    )
  ) {
    return 'আপনাকেও ধন্যবাদ! 😊 আর কোনো সাহায্য লাগলে জানাবেন।';
  }

  // ============================================================
  // BYE
  // ============================================================

  if (
    /^(বিদায়|বিদায়|বাই|আবার কথা হবে|পরে কথা হবে|আবার আসবো|bye|goodbye|good bye|see you|see ya|talk later|cya)$/.test(
      text,
    )
  ) {
    return 'ধন্যবাদ! 😊 আবার আসবেন।';
  }

  // ============================================================
  // WHO ARE YOU / BOT IDENTITY
  // ============================================================

  if (
    /^(তুমি কে|আপনি কে|তোমরা কে|আপনারা কে|তোমার পরিচয় কি|আপনার পরিচয় কি|তোমার নাম কি|তোমার নাম কী|আপনার নাম কি|আপনার নাম কী|কে কথা বলছেন|কে কথা বলতেছে|who are you|what are you|what is your name|whats your name|your name|who is this)$/.test(
      text,
    )
  ) {
    return 'আমি Sera Place-এর AI Assistant 🤖। চশমা, প্রোডাক্ট, অর্ডার ও ডেলিভারি সম্পর্কিত তথ্য দিতে পারি।';
  }

  // ============================================================
  // WHAT DO YOU SELL?
  // ============================================================

  if (
    /^(কি বিক্রি করেন|কি বিক্রি করেন আপনারা|কি কি বিক্রি করেন|কী বিক্রি করেন|কী কী বিক্রি করেন|কি প্রোডাক্ট বিক্রি করেন|কি কি প্রোডাক্ট বিক্রি করেন|কী কী প্রোডাক্ট আছে|কি কি প্রোডাক্ট আছে|আপনারা কি বিক্রি করেন|আপনারা কী বিক্রি করেন|আপনাদের কি আছে|আপনাদের কী আছে|কি কি পাওয়া যায়|কি কি পাওয়া যায়|কি কি পাওয়া যাবে|what do you sell|what are you selling|what products do you sell|what products are available|what do you have|products ki ki|ki ki product ache|ki ki product ase|ki ki sell koren|ki sell koren)$/.test(
      text,
    )
  ) {
    return 'আমাদের কাছে বিভিন্ন ধরনের চশমা ও আইওয়্যার পাওয়া যায় 👓 যেমন—Sunglasses, Frame Collection, Blue Cut Glasses, Photochromic Glasses, Ladies, Boys, Men’s, Women’s এবং Premium Collection। 😊';
  }

  // ============================================================
  // PRODUCT TYPES / COLLECTION
  // ============================================================

  if (
    /(কি কি কালেকশন|কোন কোন কালেকশন|কি ধরনের চশমা|কোন ধরনের চশমা|কি কি ধরনের চশমা|কী ধরনের চশমা|কি কি collection|which collections|what collections|types of glasses|what types of glasses|ki ki collection|ki dhoroner choshma|ki ki type er choshma)/.test(
      text,
    )
  ) {
    return 'আমাদের Frame Collection, Sunglasses, Ladies, Boys, Men’s, Women’s, Blue Cut, Photochromic এবং Premium Collection রয়েছে। 😊';
  }

  // ============================================================
  // BRANDS
  // ============================================================

  if (
    /(কি কি ব্র্যান্ড|কোন কোন ব্র্যান্ড|কি ব্র্যান্ড আছে|কোন ব্র্যান্ড আছে|কোন কোন brand|কি কি brand|what brands|which brands|available brands|brands ki ki|ki ki brand ache|kon kon brand ache)/.test(
      text,
    )
  ) {
    return 'আমাদের কাছে Ray-Ban, Oakley, Gucci, Prada, Tom Ford, Versace, Emporio Armani, Giorgio Armani এবং Police-এর কালেকশন রয়েছে। 😊';
  }

  // ============================================================
  // SHOP / STORE / LOCATION
  // ============================================================

  if (
    /(দোকান কোথায়|দোকান কোথায়|শপ কোথায়|শপ কোথায়|shop koi|shop kothay|dokaan koi|dokaan kothay|দোকান আছে কোথায়|শপ আছে কোথায়|আপনাদের দোকান|আপনাদের শপ|আপনাদের ঠিকানা|ঠিকানা কোথায়|ঠিকানা কোথায়|address koi|address kothay|location koi|location kothay|where is your shop|where is your store|store location|shop location|where are you located|আপনারা কোথায়|আপনারা কোথায়)/.test(
      text,
    )
  ) {
    return 'আমাদের শপ/ঠিকানা সম্পর্কে জানতে চাইলে আমাদের সাথে সরাসরি যোগাযোগ করুন 📞 +8801302596174। 😊';
  }

  // ============================================================
  // CONTACT / PHONE NUMBER
  // ============================================================

  if (
    /(যোগাযোগ|যোগাযোগ করবো|যোগাযোগ করব|কিভাবে যোগাযোগ|কীভাবে যোগাযোগ|ফোন নম্বর|ফোন নাম্বার|মোবাইল নম্বর|মোবাইল নাম্বার|নাম্বার দেন|নাম্বার দাও|নম্বর দেন|নম্বর দাও|contact number|contact no|phone number|mobile number|number please|number den|number dao|contact korbo|contact kibhabe|how can i contact|how to contact|can i call|call korbo|call dibo|call করা যাবে)/.test(
      text,
    )
  ) {
    return 'অবশ্যই 😊 সরাসরি কথা বলতে কল করুন: 📞 +8801302596174';
  }

  // ============================================================
  // CALL / TALK TO HUMAN
  // ============================================================

  if (
    /(কথা বলতে চাই|কথা বলবো|কথা বলব|কারো সাথে কথা|মানুষের সাথে কথা|মানুষের সাথে কথা বলতে|সরাসরি কথা|সরাসরি কথা বলতে|কাস্টমারের সাথে|কাস্টমার কেয়ার|কাস্টমার কেয়ার|customer care|customer support|support chai|support চাই|human agent|real person|talk to someone|talk to human|speak to someone|speak with someone|i want to talk|can i talk|call me|someone er sathe kotha)/.test(
      text,
    )
  ) {
    return 'অবশ্যই 😊 সরাসরি আমাদের সাথে কথা বলতে কল করুন 📞 +8801302596174';
  }

  // ============================================================
  // POWER GLASS / EYE POWER
  // ============================================================

  if (
    /(পাওয়ার চশমা|পাওয়ার চশমা|পাওয়ার গ্লাস|পাওয়ার গ্লাস|power glass|power glasses|power choshma|power chokhma|power lens|চোখের পাওয়ার|চোখের পাওয়ার|চশমার পাওয়ার|চশমার পাওয়ার|আমার পাওয়ার|আমার পাওয়ার)/.test(
      text,
    )
  ) {
    return 'জ্বি 😊 Power Glass নিতে চাইলে আপনার চোখের প্রেসক্রিপশন অনুযায়ী লেন্স তৈরি করা যাবে। বিস্তারিত জানতে বা অর্ডার করতে 📞 +8801302596174 নম্বরে যোগাযোগ করুন।';
  }

  // ============================================================
  // EYE TEST / EYE CHECK
  // ============================================================

  if (
    /(চোখ পরীক্ষা|চোখ টেস্ট|চোখের টেস্ট|চোখ চেক|চোখের চেক|eye test|eye check|vision test|চোখের পাওয়ার মাপ|পাওয়ার মাপ|power check|power test|eye power check|চোখ দেখাতে চাই|চোখ পরীক্ষা করাতে চাই)/.test(
      text,
    )
  ) {
    return 'চোখের পাওয়ার/টেস্ট সম্পর্কিত সেবার জন্য 📞 +8801302596174 নম্বরে যোগাযোগ করুন। আমাদের টিম আপনাকে বিস্তারিত জানাবে। 😊';
  }

  // ============================================================
  // PRESCRIPTION
  // ============================================================

  if (
    /(প্রেসক্রিপশন|prescription|prescription আছে|চোখের প্রেসক্রিপশন|power prescription|prescription diye|prescription দিয়ে|prescription পাঠাবো|prescription pathabo)/.test(
      text,
    )
  ) {
    return 'আপনার কাছে প্রেসক্রিপশন থাকলে সেটি দিয়ে Power Glass অর্ডার করা যাবে। 😊 অর্ডার/লেন্সের বিস্তারিত জানতে 📞 +8801302596174 নম্বরে যোগাযোগ করুন।';
  }

  // ============================================================
  // DELIVERY TIME
  // ============================================================

  if (
    /(কত দিনে ডেলিভারি|কতদিনে ডেলিভারি|কত দিনে পাবো|কতদিনে পাবো|কবে পাবো|কখন পাবো|ডেলিভারি কবে|ডেলিভারি কখন|ডেলিভারি কতদিন|ডেলিভারি টাইম|delivery time|delivery koto din|delivery kotodin|koto dine pabo|kotodin lagbe|kobe pabo|when will i get|when will it arrive|how long delivery|how many days delivery)/.test(
      text,
    )
  ) {
    return 'ঢাকায় ২ দিন ঢাকার বাহিরে ৩/৪ দিন🚚📦 ';
  }

  // ============================================================
  // DELIVERY AREA / ALL BANGLADESH
  // ============================================================

  if (
    /(কোথায় ডেলিভারি|কোথায় ডেলিভারি|কোন কোন জায়গায়|কোন কোন জায়গায়|সব জায়গায়|সব জায়গায়|সারা বাংলাদেশ|বাংলাদেশের সব|দেশের সব জায়গা|দেশের সব জায়গা|ঢাকার বাইরে|ঢাকার ভিতরে|ঢাকার মধ্যে|outside dhaka|inside dhaka|all bangladesh|delivery all over|do you deliver|where do you deliver|delivery area|delivery koren koi|kothay delivery den|kothay delivery koren)/.test(
      text,
    )
  ) {
    return 'জ্বি 😊 আমরা বাংলাদেশজুড়েই ডেলিভারি দিয়ে থাকি। আপনার ঠিকানা দিলে ডেলিভারি সংক্রান্ত বিস্তারিত জানিয়ে দেওয়া হবে। 🚚';
  }

  // ============================================================
  // HOME DELIVERY
  // ============================================================

  if (
    /(হোম ডেলিভারি|বাসায় ডেলিভারি|বাড়িতে ডেলিভারি|বাড়িতে ডেলিভারি|বাসায় পাবো|বাড়িতে পাবো|বাড়িতে পাবো|home delivery|home delivery ache|home delivery den|home delivery koren|door delivery|বাসায় পৌঁছে|বাড়িতে পৌঁছে)/.test(
      text,
    )
  ) {
    return 'জ্বি 😊 Home Delivery available। অর্ডার করলে আপনার দেওয়া ঠিকানায় পণ্য পৌঁছে দেওয়া হবে। 🚚📦';
  }

  // ============================================================
  // ORDER HOW TO
  // ============================================================

  if (
    /(কিভাবে অর্ডার|কীভাবে অর্ডার|অর্ডার করবো|অর্ডার করব|অর্ডার দিতে চাই|অর্ডার দিবো|অর্ডার দেবো|অর্ডার কিভাবে|অর্ডার কীভাবে|how to order|how can i order|how do i order|order korbo kivabe|order kivabe dibo|order dibo kivabe|order kibhabe korbo|how to buy|কিভাবে কিনবো|কীভাবে কিনবো|কিনতে চাই)/.test(
      text,
    )
  ) {
    return 'অর্ডার করতে চাইলে আপনার পছন্দের প্রোডাক্টের নাম/ছবি আমাদের পাঠাতে পারেন। 😊 চাইলে সরাসরি 📞 +8801302596174 নম্বরে যোগাযোগ করেও অর্ডার করতে পারবেন।';
  }

  // ============================================================
  // COD / CASH ON DELIVERY
  // ============================================================

  if (
    /(ক্যাশ অন ডেলিভারি|ক্যাশ অন|cash on delivery|cash on|cod|delivery te cash|delivery time cash|পণ্য পেয়ে টাকা|পণ্য পাওয়ার পর টাকা|পণ্য পাওয়ার পর টাকা|আগে টাকা দিতে হবে|আগে পেমেন্ট|আগে payment|advance payment|advance dite hobe)/.test(
      text,
    )
  ) {
    return 'Cash on Delivery সংক্রান্ত বিস্তারিত জানতে আপনার এলাকার তথ্যসহ আমাদের সাথে যোগাযোগ করুন 📞 +8801302596174। 😊';
  }

  // ============================================================
  // PAYMENT
  // ============================================================

  if (
    /(পেমেন্ট কিভাবে|পেমেন্ট কীভাবে|কিভাবে পেমেন্ট|কীভাবে পেমেন্ট|payment kivabe|payment kibhabe|how to pay|payment method|পেমেন্ট মেথড|payment methods|কোন মাধ্যমে পেমেন্ট|কিভাবে টাকা দিবো|কিভাবে টাকা দেবো|টাকা কিভাবে দিবো|টাকা কিভাবে দেবো)/.test(
      text,
    )
  ) {
    return 'পেমেন্ট/অর্ডার সংক্রান্ত বিস্তারিত জানতে 📞 +8801302596174 নম্বরে যোগাযোগ করুন। আমাদের টিম আপনাকে সঠিক পেমেন্ট পদ্ধতি জানিয়ে দেবে। 😊';
  }

  // ============================================================
  // EXCHANGE
  // ============================================================

  if (
    /(এক্সচেঞ্জ|বদলানো যাবে|বদলাতে পারবো|change করা যাবে|change kora jabe|exchange kora jabe|exchange হবে|exchange hobe|exchange policy|can i exchange|can exchange|product exchange)/.test(
      text,
    )
  ) {
    return 'Exchange সংক্রান্ত নিয়ম প্রোডাক্ট ও অর্ডারের ধরন অনুযায়ী হতে পারে। বিস্তারিত জানতে 📞 +8801302596174 নম্বরে যোগাযোগ করুন। 😊';
  }

  // ============================================================
  // RETURN
  // ============================================================

  if (
    /(রিটার্ন|ফেরত|ফেরত দেওয়া|ফেরত দিতে|return|return করা যাবে|return kora jabe|can i return|return policy|product return)/.test(
      text,
    )
  ) {
    return 'Return সংক্রান্ত নিয়ম জানতে 📞 +8801302596174 নম্বরে যোগাযোগ করুন। আমাদের টিম আপনার অর্ডার অনুযায়ী বিস্তারিত জানাবে। 😊';
  }

  // ============================================================
  // WARRANTY
  // ============================================================

  if (
    /(ওয়ারেন্টি|ওয়ারেন্টি|গ্যারান্টি|warranty|guarantee|warrenty|warranty আছে|warranty ache|guarantee ache|warranty period)/.test(
      text,
    )
  ) {
    return 'কিছু প্রোডাক্টে Warranty সুবিধা রয়েছে। নির্দিষ্ট প্রোডাক্টের Warranty জানতে প্রোডাক্টের নাম বলুন। 😊';
  }

  // ============================================================
  // ORIGINAL / AUTHENTIC
  // ============================================================

  if (
    /(অরিজিনাল|অরিজিনাল কি|অরিজিনাল তো|আসল|আসল তো|নকল না তো|নকল|original|original product|authentic|genuine|real product|fake|is it original|are these original)/.test(
      text,
    )
  ) {
    return 'জ্বি 😊 আমরা Original/Authentic প্রোডাক্টের কালেকশন নিয়ে কাজ করি। নির্দিষ্ট কোনো প্রোডাক্ট সম্পর্কে জানতে নামটি বলুন।';
  }

  // ============================================================
  // MEN / WOMEN
  // ============================================================

  if (
    /(ছেলেদের|ছেলেদের চশমা|পুরুষদের|পুরুষদের চশমা|মেয়েদের|মেয়েদের|মেয়েদের চশমা|মেয়েদের চশমা|men collection|women collection|mens collection|womens collection|for men|for women|male|female|boys|girls|cheleder choshma|meyeder choshma)/.test(
      text,
    )
  ) {
    return 'জ্বি 😊 আমাদের Men’s, Women’s, Boys এবং Ladies Collection রয়েছে। আপনার পছন্দ/বাজেট বললে উপযুক্ত প্রোডাক্ট দেখানো যাবে।';
  }

  // ============================================================
  // SUNGLASSES
  // ============================================================

  if (
    /^(সানগ্লাস|সানগ্লাস আছে|সানগ্লাস পাওয়া যায়|সানগ্লাস পাওয়া যায়|sunglass|sunglasses|sunglass ache|sunglasses ache|sun glass|sun glasses)$/.test(
      text,
    )
  ) {
    return 'জ্বি 😎 আমাদের বিভিন্ন ধরনের Sunglasses Collection রয়েছে। আপনি চাইলে ব্র্যান্ড, বাজেট বা ডিজাইন বলুন—আমি আপনার জন্য প্রোডাক্ট খুঁজে দিতে পারি।';
  }

  // ============================================================
  // BLUE CUT
  // ============================================================

  if (
    /(ব্লু কাট|ব্লু কাট চশমা|blue cut|bluecut|blue cut glass|blue cut glasses|blue cut lens|bluecut glass|blue cut ache|blue cut আছে)/.test(
      text,
    ) &&
    !/(price|দাম|টাকা|stock|স্টক)/.test(text)
  ) {
    return 'জ্বি 😊 আমাদের Blue Cut Glasses Collection রয়েছে। নির্দিষ্ট প্রোডাক্ট/দাম জানতে বললে আমি দেখে দিতে পারি।';
  }

  // ============================================================
  // PHOTOCHROMIC
  // ============================================================

  if (
    /(ফটো ক্রোমিক|ফটোক্রোমিক|photochromic|photo chromic|photochromic glass|photochromic glasses|transition lens|transition glass)/.test(
      text,
    ) &&
    !/(price|দাম|টাকা|stock|স্টক)/.test(text)
  ) {
    return 'জ্বি 😊 আমাদের Photochromic Glasses Collection রয়েছে। নির্দিষ্ট প্রোডাক্টের দাম/স্টক জানতে বলুন।';
  }

  // ============================================================
  // FRAME
  // ============================================================

  if (
    /(ফ্রেম আছে|চশমার ফ্রেম|ফ্রেম কালেকশন|frame collection|frames ache|frame available|eyeglass frame|optical frame)/.test(
      text,
    ) &&
    !/(price|দাম|টাকা|stock|স্টক)/.test(text)
  ) {
    return 'জ্বি 😊 আমাদের Frame Collection রয়েছে। আপনি চাইলে ব্র্যান্ড, ডিজাইন বা বাজেট বলুন—আমি available products দেখাতে পারি।';
  }

  // ============================================================
  // SIZE
  // ============================================================

  if (
    /(সাইজ কি|সাইজ কী|কি কি সাইজ|কোন সাইজ|available size|what sizes|sizes available|size ache|size ase|size ki|kon size|কি সাইজ আছে)/.test(
      text,
    ) &&
    !/\b(size|সাইজ)\s*(xs|s|m|l|xl|xxl|\d+)/i.test(text)
  ) {
    return 'আমাদের বিভিন্ন প্রোডাক্টে বিভিন্ন Size পাওয়া যায়। 😊 নির্দিষ্ট প্রোডাক্টের নাম বললে available size দেখে দিতে পারি।';
  }

  // ============================================================
  // HELP / GENERAL
  // ============================================================

  if (
    /^(সাহায্য করবেন|সাহায্য করো|সাহায্য চাই|একটু সাহায্য|help|help me|need help|can you help|help korte parben|help korben|ektu help|ektu help koren)$/.test(
      text,
    )
  ) {
    return 'অবশ্যই 😊 আমি সাহায্য করতে প্রস্তুত। প্রোডাক্ট, অর্ডার, ডেলিভারি বা চশমা সম্পর্কিত যেকোনো প্রশ্ন করতে পারেন।';
  }

  // ============================================================
  // OK / YES / NO / UNDERSTOOD
  // ============================================================

  if (
    /^(ঠিক আছে|ঠিকাছে|আচ্ছা|ওকে|ওকে ঠিক আছে|ঠিক|বুঝেছি|বুঝলাম|আচ্ছা ঠিক আছে|ok|okay|okk|okey|got it|understood|alright|all right)$/.test(
      text,
    )
  ) {
    return 'জ্বি 😊 ঠিক আছে। কোনো সাহায্য লাগলে জানাবেন।';
  }

  if (/^(না|নাহ|no|no thanks|না ধন্যবাদ|না লাগবে)$/.test(text)) {
    return 'ঠিক আছে 😊 কোনো প্রয়োজন হলে অবশ্যই জানাবেন।';
  }

  // ============================================================
  // THANKS + BYE COMBINATION
  // ============================================================

  if (
    /(ধন্যবাদ|thanks|thank you)/.test(text) &&
    /(বাই|bye|বিদায়|বিদায়|পরে কথা|আবার আসবো|see you)/.test(text)
  ) {
    return 'আপনাকেও ধন্যবাদ! 😊 আবার আসবেন।';
  }

  // ============================================================
  // FALLBACK
  // ============================================================

  return null;
};
