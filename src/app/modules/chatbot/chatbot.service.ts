import { GoogleGenAI } from '@google/genai';
import { prisma } from '../../lib/prisma';
import { SYSTEM_PROMPT } from './chatbot.knowledge';
import { getQuickReply } from './quickReply';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface IChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface IChatLeadData {
  name: string;
  email: string;
  message?: string;
}

export interface IChatRequest {
  messages: IChatMessage[];
  leadData?: IChatLeadData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini Client
// ─────────────────────────────────────────────────────────────────────────────

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  return new GoogleGenAI({ apiKey: apiKey });
};

// ─────────────────────────────────────────────────────────────────────────────
// Search Intent
// ─────────────────────────────────────────────────────────────────────────────

interface ProductSearchIntent {
  brand?: string;
  category?: string;
  color?: string;
  size?: string;

  minPrice?: number;
  maxPrice?: number;

  keywords: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand Detection
// ─────────────────────────────────────────────────────────────────────────────

const BRANDS = [
  'ray-ban',
  'rayban',
  'ray ban',
  'oakley',
  'gucci',
  'prada',
  'tom ford',
  'versace',
  'emporio armani',
  'giorgio armani',
  'armani',
  'police',
];

// ─────────────────────────────────────────────────────────────────────────────
// Category Detection
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'frame collection',
  'ladies sunglasses',
  'boys sunglasses',
  'blue cut glasses',
  'premium collection',
  'sunglasses',
  'photochromic glasses',
  "men's collection",
  'mens collection',
  "women's collection",
  'womens collection',
];

// ─────────────────────────────────────────────────────────────────────────────
// Color Detection
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = [
  'black',
  'white',
  'blue',
  'red',
  'green',
  'yellow',
  'brown',
  'grey',
  'gray',
  'gold',
  'silver',
  'pink',
  'purple',
  'orange',

  'কালো',
  'সাদা',
  'নীল',
  'লাল',
  'সবুজ',
  'হলুদ',
  'বাদামি',
  'ধূসর',
  'সোনালি',
  'রুপালি',
  'গোলাপি',
  'বেগুনি',
];

// ─────────────────────────────────────────────────────────────────────────────
// Search Intent Parser
// ─────────────────────────────────────────────────────────────────────────────

const extractSearchIntent = (message: string): ProductSearchIntent | null => {
  const text = message.toLowerCase().trim();

  if (!text) {
    return null;
  }

  let brand: string | undefined;
  let category: string | undefined;
  let color: string | undefined;
  let size: string | undefined;

  // ───────────────────────────────────────────────────────────────────────────
  // Brand
  // ───────────────────────────────────────────────────────────────────────────

  for (const item of BRANDS) {
    if (text.includes(item)) {
      if (item === 'rayban' || item === 'ray ban') {
        brand = 'Ray-Ban';
      } else if (item === 'armani') {
        brand = 'Armani';
      } else {
        brand = item
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      break;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Category
  // ───────────────────────────────────────────────────────────────────────────

  for (const item of CATEGORIES) {
    if (text.includes(item)) {
      category = item;
      break;
    }
  }

  // বাংলা category
  if (text.includes('সানগ্লাস') || text.includes('সান গ্লাস')) {
    category = 'sunglasses';
  }

  if (text.includes('ফ্রেম') || text.includes('চশমার ফ্রেম')) {
    category = 'frame collection';
  }

  if (text.includes('ব্লু কাট') || text.includes('ব্লুকাট')) {
    category = 'blue cut glasses';
  }

  if (text.includes('ফটো ক্রোমিক') || text.includes('ফটোক্রোমিক')) {
    category = 'photochromic glasses';
  }

  if (text.includes('প্রিমিয়াম') || text.includes('প্রিমিয়াম')) {
    category = 'premium collection';
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Color
  // ───────────────────────────────────────────────────────────────────────────

  for (const item of COLORS) {
    if (text.includes(item)) {
      color = item;
      break;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Size
  // ───────────────────────────────────────────────────────────────────────────

  const sizeMatch = text.match(
    /\b(?:size|সাইজ)\s*[:\-]?\s*(\d{1,3}|xs|s|m|l|xl|xxl)\b/i,
  );

  if (sizeMatch) {
    size = sizeMatch[1];
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Price Detection
  // ───────────────────────────────────────────────────────────────────────────

  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  // Example:
  // ২০০০ টাকার মধ্যে
  // 2000 er moddhe
  // under 2000
  // below 2000
  // 2000 taka

  const maxPriceMatch = text.match(
    /(?:under|below|within|max|maximum|less than|এর মধ্যে|মধ্যে|সর্বোচ্চ)\s*(?:৳|tk|taka|টাকা)?\s*(\d+(?:,\d+)*)/i,
  );

  if (maxPriceMatch) {
    maxPrice = Number(maxPriceMatch[1].replace(/,/g, ''));
  }

  // বাংলা:
  // ২০০০ টাকা
  const banglaPriceMatch = text.match(/(\d+(?:,\d+)*)\s*(?:টাকা|tk|taka)/i);

  if (banglaPriceMatch && !maxPrice) {
    const detectedPrice = Number(banglaPriceMatch[1].replace(/,/g, ''));

    // "২০০০ টাকার মধ্যে" হলে maxPrice
    if (
      text.includes('মধ্যে') ||
      text.includes('এর মধ্যে') ||
      text.includes('under') ||
      text.includes('below')
    ) {
      maxPrice = detectedPrice;
    }
  }

  // সাধারণ numeric price
  if (!maxPrice) {
    const numericPriceMatch = text.match(/(?:৳|tk|taka)\s*(\d+(?:,\d+)*)/i);

    if (numericPriceMatch) {
      maxPrice = Number(numericPriceMatch[1].replace(/,/g, ''));
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Product Keywords
  // ───────────────────────────────────────────────────────────────────────────

  const keywords: string[] = [];

  const productWords = [
    'চশমা',
    'সানগ্লাস',
    'ফ্রেম',
    'গ্লাস',
    'sunglass',
    'sunglasses',
    'glasses',
    'glass',
    'frame',
    'eyewear',
    'spectacle',
    'spectacles',
  ];

  for (const keyword of productWords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }

  // If we detected any structured product intent
  const hasIntent =
    !!brand ||
    !!category ||
    !!color ||
    !!size ||
    !!maxPrice ||
    !!minPrice ||
    keywords.length > 0;

  if (!hasIntent) {
    return null;
  }

  return {
    brand,
    category,
    color,
    size,
    minPrice,
    maxPrice,
    keywords,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Product Search
// ─────────────────────────────────────────────────────────────────────────────

const searchProducts = async (intent: ProductSearchIntent) => {
  const andConditions: any[] = [
    {
      isPublished: true,
    },
  ];

  // ───────────────────────────────────────────────────────────────────────────
  // Brand
  // ───────────────────────────────────────────────────────────────────────────

  if (intent.brand) {
    andConditions.push({
      brand: {
        contains: intent.brand,
        mode: 'insensitive',
      },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Category
  // ───────────────────────────────────────────────────────────────────────────

  if (intent.category) {
    andConditions.push({
      category: {
        name: {
          contains: intent.category,
          mode: 'insensitive',
        },
      },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Price
  // ───────────────────────────────────────────────────────────────────────────

  if (intent.maxPrice !== undefined) {
    andConditions.push({
      OR: [
        {
          specialPrice: {
            lte: intent.maxPrice,
          },
        },
        {
          AND: [
            {
              specialPrice: null,
            },
            {
              price: {
                lte: intent.maxPrice,
              },
            },
          ],
        },
      ],
    });
  }

  if (intent.minPrice !== undefined) {
    andConditions.push({
      OR: [
        {
          specialPrice: {
            gte: intent.minPrice,
          },
        },
        {
          AND: [
            {
              specialPrice: null,
            },
            {
              price: {
                gte: intent.minPrice,
              },
            },
          ],
        },
      ],
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Color
  // ───────────────────────────────────────────────────────────────────────────

  if (intent.color) {
    andConditions.push({
      colorVariants: {
        some: {
          color: {
            contains: intent.color,
            mode: 'insensitive',
          },
        },
      },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Size
  // ───────────────────────────────────────────────────────────────────────────

  if (intent.size) {
    andConditions.push({
      colorVariants: {
        some: {
          sizes: {
            some: {
              size: {
                equals: intent.size,
                mode: 'insensitive',
              },
              stock: {
                gt: 0,
              },
            },
          },
        },
      },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Stock
  // ───────────────────────────────────────────────────────────────────────────

  andConditions.push({
    OR: [
      {
        stock: {
          gt: 0,
        },
      },
      {
        colorVariants: {
          some: {
            sizes: {
              some: {
                stock: {
                  gt: 0,
                },
              },
            },
          },
        },
      },
    ],
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Query
  // ───────────────────────────────────────────────────────────────────────────

  const products = await prisma.product.findMany({
    where: {
      AND: andConditions,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,

      brand: true,
      tags: true,

      thumbnail: true,
      images: true,

      model: true,
      material: true,

      price: true,
      specialPrice: true,
      discount: true,
      stock: true,

      warrantyType: true,
      warrantyPeriod: true,

      highlights: true,

      rating: true,
      reviewCount: true,

      isFeatured: true,
      isPublished: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      colorVariants: {
        select: {
          id: true,
          color: true,
          image: true,

          sizes: {
            select: {
              id: true,
              size: true,
              price: true,
              specialPrice: true,
              stock: true,
              sku: true,
            },
          },
        },
      },
    },

    orderBy: [
      {
        isFeatured: 'desc',
      },
      {
        rating: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],

    take: 12,
  });

  return products;
};

// ─────────────────────────────────────────────────────────────────────────────
// Fallback Products
// ─────────────────────────────────────────────────────────────────────────────

const getAvailableProducts = async () => {
  return prisma.product.findMany({
    where: {
      isPublished: true,

      OR: [
        {
          stock: {
            gt: 0,
          },
        },
        {
          colorVariants: {
            some: {
              sizes: {
                some: {
                  stock: {
                    gt: 0,
                  },
                },
              },
            },
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,

      brand: true,
      tags: true,

      thumbnail: true,

      model: true,
      material: true,

      price: true,
      specialPrice: true,
      discount: true,

      stock: true,

      highlights: true,

      rating: true,
      reviewCount: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      colorVariants: {
        select: {
          id: true,
          color: true,
          image: true,

          sizes: {
            select: {
              size: true,
              price: true,
              specialPrice: true,
              stock: true,
            },
          },
        },
      },
    },

    orderBy: [
      {
        isFeatured: 'desc',
      },
      {
        rating: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],

    take: 12,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Single Product
// ─────────────────────────────────────────────────────────────────────────────

const getSingleProduct = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,

      brand: true,
      tags: true,

      thumbnail: true,
      images: true,
      videoUrl: true,

      model: true,
      material: true,

      price: true,
      specialPrice: true,
      discount: true,
      stock: true,

      weight: true,
      dimensions: true,
      dangerousGoods: true,

      warrantyType: true,
      warrantyPeriod: true,

      highlights: true,

      rating: true,
      reviewCount: true,

      viewCount: true,
      likeCount: true,

      isFeatured: true,
      isPublished: true,

      createdAt: true,
      updatedAt: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      colorVariants: {
        select: {
          id: true,
          color: true,
          image: true,

          sizes: {
            select: {
              id: true,
              size: true,
              price: true,
              specialPrice: true,
              stock: true,
              sku: true,
            },
          },
        },
      },

      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

        take: 10,
      },
    },
  });

  return product;
};

// ─────────────────────────────────────────────────────────────────────────────
// Format Products for Gemini
// ─────────────────────────────────────────────────────────────────────────────

const formatProductsForAI = (products: any[]) => {
  if (!products.length) {
    return 'NO MATCHING PRODUCTS FOUND IN DATABASE.';
  }

  return products
    .map((product, index) => {
      const effectivePrice = product.specialPrice ?? product.price;

      const colors =
        product.colorVariants
          ?.map((variant: any) => {
            const sizes =
              variant.sizes
                ?.map(
                  (size: any) =>
                    `${size.size} (৳${
                      size.specialPrice ?? size.price
                    }, stock: ${size.stock})`,
                )
                .join(', ') || 'No sizes';

            return `
Color: ${variant.color}
Color Image: ${variant.image ?? 'N/A'}
Sizes: ${sizes}
`;
          })
          .join('\n') || 'No color variants';

      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT ${index + 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID: ${product.id}

Name: ${product.name}

Slug: ${product.slug}

Brand: ${product.brand ?? 'Not specified'}

Category: ${product.category?.name ?? 'Not specified'}

Model: ${product.model ?? 'Not specified'}

Material: ${product.material ?? 'Not specified'}

Price: ৳${product.price}

Special Price: ${
        product.specialPrice ? `৳${product.specialPrice}` : 'Not available'
      }

Current Price: ৳${effectivePrice}

Discount: ${
        product.discount !== null && product.discount !== undefined
          ? `${product.discount}%`
          : 'No discount'
      }

Product Stock: ${product.stock}

Description:
${product.description ?? 'Not available'}

Tags:
${product.tags?.join(', ') || 'None'}

Highlights:
${product.highlights?.join(', ') || 'None'}

Rating: ${product.rating ?? 0}

Review Count: ${product.reviewCount ?? 0}

Colors and Sizes:
${colors}

Warranty:
${
  product.warrantyType
    ? `${product.warrantyType} - ${product.warrantyPeriod ?? ''}`
    : 'Not specified'
}

Product URL Slug:
${product.slug}

Product Image:
${product.thumbnail ?? 'Not available'}
`;
    })
    .join('\n');
};

// ─────────────────────────────────────────────────────────────────────────────
// Gemini Chat
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Quick Normal Questions — No Gemini Call
// ─────────────────────────────────────────────────────────────────────────────

const chat = async ({ messages, leadData }: IChatRequest) => {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Validate
  // ───────────────────────────────────────────────────────────────────────────

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('messages array cannot be empty');
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== 'user') {
    throw new Error('The last message must have role "user"');
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Quick Normal Questions — No Database / No Gemini
  // ───────────────────────────────────────────────────────────────────────────

  const quickReply = getQuickReply(lastMessage.content);

  if (quickReply) {
    return {
      reply: quickReply,
      leadSaved: false,
      products: [],
    };
  }
  // ───────────────────────────────────────────────────────────────────────────
  // 2. Detect Product Intent
  // ───────────────────────────────────────────────────────────────────────────

  const searchIntent = extractSearchIntent(lastMessage.content);

  let products: any[] = [];

  if (searchIntent) {
    products = await searchProducts(searchIntent);
  }

  // Fallback
  if (searchIntent && products.length === 0) {
    products = await getAvailableProducts();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Product Context
  // ───────────────────────────────────────────────────────────────────────────

  const productContext = formatProductsForAI(products);

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Gemini History
  // ───────────────────────────────────────────────────────────────────────────

  const history = messages.slice(0, -1).map(message => ({
    role: message.role,
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Dynamic Prompt
  // ───────────────────────────────────────────────────────────────────────────

  const dynamicPrompt = `
${SYSTEM_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT DATABASE PRODUCT RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${productContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT PRODUCT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Only recommend products that exist in the database results above.

2. Never invent:
   - Product names
   - Prices
   - Brands
   - Categories
   - Colors
   - Sizes
   - Stock
   - Discounts
   - Warranty
   - Ratings

3. If the database says a product is unavailable,
   do not say it is available.

4. If the customer asks for a product that is not
   present in the database results, clearly say that
   you could not find that product.

5. If specialPrice exists, use specialPrice as the
   current selling price.

6. If the customer asks about colors, use the
   Color and Sizes information.

7. If the customer asks about size availability,
   check the size stock before saying it is available.

8. If the customer asks about price, give the exact
   database price.

9. Do not make up delivery charges, delivery times,
   payment methods, return policy or warranty details
   unless they are explicitly provided by the system
   knowledge or database.

10. Respond naturally.

11. Customer language:
    - Bengali/Banglish → reply in Bengali.
    - English → reply in English.
    - Mixed language → natural Banglish/Bengali is okay.

12. Keep answers concise and helpful.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${lastMessage.content}

Now answer the customer.
`;

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Gemini Request
  // ───────────────────────────────────────────────────────────────────────────

  const attemptChat = async () => {
    const ai = getClient();

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',

      history,

      config: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    return await chat.sendMessage({
      message: dynamicPrompt,
    });
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Gemini Error Handling
  // ───────────────────────────────────────────────────────────────────────────

  let result;

  try {
    result = await attemptChat();
  } catch (error: any) {
    const errorMessage = error?.message || '';

    console.error('Gemini Error:', errorMessage);

    if (
      errorMessage.includes('429') ||
      errorMessage.toLowerCase().includes('quota')
    ) {
      throw new Error(
        'AI assistant is temporarily busy. Please try again in a moment.',
      );
    }

    throw new Error(
      `AI Model Error: ${errorMessage || 'Unable to connect to Gemini'}`,
    );
  }
  // ───────────────────────────────────────────────────────────────────────────
  // 8. AI Reply
  // ───────────────────────────────────────────────────────────────────────────

  const reply = result.text;

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Save Lead
  // ───────────────────────────────────────────────────────────────────────────

  let leadSaved = false;

  if (leadData?.email && leadData?.name) {
    await prisma.lead.create({
      data: {
        name: leadData.name,
        email: leadData.email,
        from: 'chatbot',
        company: leadData.message ?? undefined,
        date: new Date(),
      },
    });

    leadSaved = true;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Return
  // ───────────────────────────────────────────────────────────────────────────

  return {
    reply,

    leadSaved,

    products: products.map(product => ({
      id: product.id,

      name: product.name,

      slug: product.slug,

      brand: product.brand,

      category: product.category?.name ?? null,

      price: product.price,

      specialPrice: product.specialPrice,

      discount: product.discount,

      stock: product.stock,

      thumbnail: product.thumbnail,

      rating: product.rating,

      reviewCount: product.reviewCount,

      colors:
        product.colorVariants?.map((variant: any) => ({
          color: variant.color,

          image: variant.image,

          sizes:
            variant.sizes?.map((size: any) => ({
              size: size.size,

              price: size.price,

              specialPrice: size.specialPrice,

              stock: size.stock,
            })) ?? [],
        })) ?? [],
    })),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotService = {
  chat,
  getSingleProduct,
};
