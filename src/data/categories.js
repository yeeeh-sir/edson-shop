export const categories = [
  {
    slug: 'electronics',
    name: 'Electronics',
    tagline: 'Gadgets, audio & computer accessories',
    description:
      'Smartphones, laptops, headphones and every accessory you need to stay connected.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=70&fm=webp',
    icon: 'Smartphone',
    productCount: 12,
    color: 'brand',
  },
  {
    slug: 'stationery',
    name: 'Stationery',
    tagline: 'Office, school & writing essentials',
    description:
      'Notebooks, pens, paper and everything for the classroom or the boardroom.',
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=70&fm=webp',
    icon: 'BookOpen',
    productCount: 12,
    color: 'accent',
  },
  {
    slug: 'graphics',
    name: 'Graphics',
    tagline: 'Design, printing & branding',
    description:
      'Banners, logos, business cards, T-shirts and a complete design & print studio.',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=70&fm=webp',
    icon: 'Palette',
    productCount: 10,
    color: 'violet',
  },
  {
    slug: 'others',
    name: 'Others',
    tagline: 'Lifestyle, wear & more',
    description:
      'Watches, bags, cameras and everyday lifestyle products worth owning.',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=70&fm=webp',
    icon: 'Package',
    productCount: 5,
    color: 'teal',
  },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug) || null;

export const categoryByKey = (key) => categories.find((c) => c.name === key) || null;

export const CATEGORY_NAMES = {
  electronics: 'Electronics',
  stationery: 'Stationery',
  graphics: 'Graphics',
  others: 'Others',
};