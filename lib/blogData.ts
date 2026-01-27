export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    title?: string;
    credentials?: string;
    organization?: string;
    expertise?: string[];
    linkedIn?: string;
    email?: string;
  };
  datePublished: string;
  dateModified: string;
  category: string;
  keyFacts: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Spring 2025 Fashion Trends: What to Wear This Season',
    excerpt: 'Discover the hottest fashion trends for spring 2025. From bold colors to sustainable fashion, we\'ve got you covered.',
    content: `Spring 2025 is bringing exciting new fashion trends that blend sustainability with bold style statements. This season, we're seeing a resurgence of vibrant colors, eco-friendly materials, and a mix of vintage and modern aesthetics.

## Bold Colors Take Center Stage

This spring, don't be afraid to embrace bold, vibrant colors. From electric blues to sunny yellows, designers are moving away from muted palettes and embracing color as a form of self-expression. These bold hues work beautifully in both casual and formal settings.

## Sustainable Fashion Focus

One of the most significant trends this season is the emphasis on sustainable fashion. Consumers are increasingly aware of the environmental impact of their clothing choices, and brands are responding with eco-friendly materials and ethical production practices.

## Vintage Meets Modern

The fusion of vintage and modern styles creates unique, personalized looks. Think vintage silhouettes with contemporary fabrics, or classic patterns with modern cuts. This trend allows for creative expression while honoring fashion history.

Whether you're updating your wardrobe or just staying informed about fashion trends, spring 2025 offers something for everyone.`,
    author: {
      name: 'Sarah Johnson',
      title: 'Fashion Editor',
      credentials: 'Certified Fashion Stylist, 10+ years experience',
      organization: 'THE STORE',
      expertise: ['Fashion Trends', 'Style Consulting', 'Sustainable Fashion'],
      linkedIn: 'https://www.linkedin.com/in/sarahjohnson',
      email: 'sarah@thestore.com',
    },
    datePublished: '2025-01-15',
    dateModified: '2025-01-18',
    category: 'Fashion Trends',
    keyFacts: [
      'Bold colors are trending for spring 2025',
      'Sustainable fashion is a major focus',
      'Mix of vintage and modern styles',
    ],
  },
  {
    id: 2,
    title: 'Sustainable Fashion: How to Build an Eco-Friendly Wardrobe',
    excerpt: 'Learn how to make sustainable fashion choices and build an eco-friendly wardrobe that\'s both stylish and responsible.',
    content: `Building an eco-friendly wardrobe doesn't mean sacrificing style. In fact, sustainable fashion can be more stylish, durable, and personally meaningful than fast fashion alternatives.

## Choose Quality Over Quantity

The foundation of a sustainable wardrobe is investing in quality pieces that last. Look for well-made garments with durable fabrics and construction. While the initial cost may be higher, quality items will save you money in the long run and reduce your environmental footprint.

## Organic and Recycled Materials

When shopping, prioritize items made from organic cotton, recycled polyester, hemp, or other sustainable materials. These materials have a lower environmental impact and often feel better against your skin.

## Support Ethical Brands

Research brands before you buy. Look for companies that prioritize fair labor practices, use sustainable materials, and are transparent about their supply chains. Your purchasing power can drive positive change in the fashion industry.

## Care for Your Clothes

Proper care extends the life of your garments. Follow washing instructions, repair items when possible, and store clothes properly. A well-maintained wardrobe is a sustainable wardrobe.

Building an eco-friendly wardrobe is a journey, not a destination. Start with small changes and gradually build a collection that reflects your values and personal style.`,
    author: {
      name: 'Michael Chen',
      title: 'Sustainability Expert',
      credentials: 'Environmental Science PhD, Sustainable Fashion Consultant',
      organization: 'THE STORE',
      expertise: ['Sustainable Fashion', 'Environmental Impact', 'Ethical Sourcing'],
      linkedIn: 'https://www.linkedin.com/in/michaelchen',
      email: 'michael@thestore.com',
    },
    datePublished: '2025-01-10',
    dateModified: '2025-01-12',
    category: 'Sustainability',
    keyFacts: [
      'Choose organic and recycled materials',
      'Buy quality items that last longer',
      'Support ethical and sustainable brands',
    ],
  },
  {
    id: 3,
    title: 'Winter Style Guide: Staying Warm and Fashionable',
    excerpt: 'Master the art of winter dressing with our comprehensive style guide. Stay warm without sacrificing your style.',
    content: `Winter doesn't mean you have to choose between warmth and style. With the right approach, you can create outfits that are both functional and fashionable.

## The Art of Layering

Layering is the key to staying warm while maintaining style. Start with a moisture-wicking base layer, add an insulating middle layer, and finish with a weather-resistant outer layer. This approach allows you to adjust your temperature throughout the day while looking put-together.

## Quality Winter Fabrics

Invest in quality winter fabrics like wool, cashmere, and technical synthetics designed for cold weather. These materials provide excellent insulation while remaining breathable and comfortable.

## Accessorize Strategically

Don't underestimate the power of accessories. A well-chosen scarf, hat, and gloves can complete your look while providing essential warmth. Look for accessories that complement your outfit and add a touch of personality.

## Footwear Matters

Keep your feet warm and dry with appropriate winter footwear. Look for boots with good insulation and traction. Style doesn't have to be sacrificed—many fashionable boots are also highly functional.

Remember, winter style is about balancing comfort, warmth, and aesthetics. With thoughtful choices, you can look great while staying cozy all season long.`,
    author: {
      name: 'Emily Rodriguez',
      title: 'Style Consultant',
      credentials: 'Certified Personal Stylist, Fashion Institute Graduate',
      organization: 'THE STORE',
      expertise: ['Seasonal Styling', 'Wardrobe Planning', 'Color Coordination'],
      linkedIn: 'https://www.linkedin.com/in/emilyrodriguez',
      email: 'emily@thestore.com',
    },
    datePublished: '2025-01-05',
    dateModified: '2025-01-08',
    category: 'Style Guide',
    keyFacts: [
      'Layer clothing for warmth and style',
      'Choose quality winter fabrics',
      'Accessorize with scarves and gloves',
    ],
  },
  {
    id: 4,
    title: 'The Ultimate Shoe Care Guide: Keep Your Footwear Looking New',
    excerpt: 'Learn professional tips and tricks to maintain and care for your shoes, extending their lifespan and keeping them looking great.',
    content: `Proper shoe care is essential for maintaining the appearance and longevity of your footwear. With the right techniques and products, you can keep your shoes looking new for years to come.

## Regular Cleaning

Clean your shoes regularly with products appropriate for the material. Leather shoes require different care than suede or synthetic materials. Always remove dirt and debris before applying any cleaning products.

## Proper Storage

How you store your shoes significantly impacts their condition. Use shoe trees for leather shoes to maintain their shape. Store shoes in a cool, dry place away from direct sunlight. Avoid stacking shoes, as this can cause deformation.

## Material-Specific Care

Different materials require different care approaches:
- **Leather**: Use quality leather conditioner and polish regularly
- **Suede**: Use a suede brush and protectant spray
- **Canvas**: Machine wash when appropriate, air dry
- **Synthetic**: Clean with mild soap and water

## Rotation is Key

Rotating your shoes allows them to air out and recover their shape between wears. This simple practice can significantly extend the life of your footwear.

## Professional Maintenance

For high-quality shoes, consider professional cleaning and repair services. A good cobbler can resole, reheel, and restore shoes that might otherwise be discarded.

Taking care of your shoes is an investment in both style and sustainability. Well-maintained footwear looks better, lasts longer, and saves you money over time.`,
    author: {
      name: 'David Park',
      title: 'Product Care Specialist',
      credentials: 'Leather Care Expert, 15+ years in footwear industry',
      organization: 'THE STORE',
      expertise: ['Product Care', 'Shoe Maintenance', 'Material Science'],
      linkedIn: 'https://www.linkedin.com/in/davidpark',
      email: 'david@thestore.com',
    },
    datePublished: '2024-12-28',
    dateModified: '2025-01-02',
    category: 'Care Guide',
    keyFacts: [
      'Clean shoes regularly with appropriate products',
      'Store shoes properly to maintain shape',
      'Use shoe trees for leather shoes',
    ],
  },
];

export function getBlogPostById(id: number): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

