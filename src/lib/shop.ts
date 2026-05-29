import catBundles from "@/assets/cat-bundles.jpg";
import catFrontals from "@/assets/cat-frontals.jpg";
import catWigs from "@/assets/cat-wigs.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import catClipins from "@/assets/cat-clipins.jpg";

export interface ShopCategory {
  slug: string;
  name: string;
  image: string;
  alt: string;
  to?: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  { slug: "seamless-clip-ins", name: "Seamless Clip Ins", image: catClipins, alt: "Seamless clip-in hair extensions, editorial black and white", to: "/shop/seamless-clip-ins" },
  { slug: "wigs", name: "Wigs", image: catWigs, alt: "Luxury hair wig styled on a mannequin, black and white" },
  { slug: "frontals-closures", name: "Frontals & Closures", image: catFrontals, alt: "Hair lace frontal and closure detail, black and white" },
  { slug: "bundles", name: "Bundles", image: catBundles, alt: "Bundles of virgin hair extensions, black and white" },
  { slug: "hair-accessories", name: "Hair Accessories", image: catAccessories, alt: "Hair accessories flat lay — bonnet, brush and silky wrap", to: "/shop/hair-accessories" },
];

export interface ClipInVariant {
  length: string;
  price: number;
}

export const CLIP_IN_VARIANTS: ClipInVariant[] = [
  { length: "14 inch", price: 140 },
  { length: "16 inch", price: 160 },
  { length: "18 inch", price: 175 },
  { length: "20 inch", price: 185 },
  { length: "22 inch", price: 200 },
  { length: "24 inch", price: 225 },
  { length: "26 inch", price: 245 },
  { length: "28 inch", price: 260 },
];

export interface Accessory {
  name: string;
  price: number;
  sale: string;
  original: string;
}

export const ACCESSORIES: Accessory[] = [
  { name: "CC Bonnets", price: 5.99, sale: "$5.99", original: "$10.00" },
  { name: "Edge Brush", price: 1.0, sale: "$1.00", original: "$3.00" },
  { name: "CC Silky Wrap", price: 4.99, sale: "$4.99", original: "$10.00" },
  { name: "CC Adjustable Elastic Band", price: 5.99, sale: "$5.99", original: "$12.00" },
];

