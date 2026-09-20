export const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Drinks",
] as const;
export type Category = (typeof categories)[number];
export type Dish = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  ingredients: string[];
  portion: string;
  allergens: string[];
};
export const dishes: Dish[] = [
  {
    slug: "spring-rolls",
    name: "Crispy Spring Rolls",
    category: "Starters",
    price: 220,
    image: "/images/spring-rolls-warm.webp",
    description:
      "Golden rolls filled with crisp vegetables, served with a sweet chilli dipping sauce.",
    ingredients: ["Seasonal vegetables", "Wheat pastry", "Sweet chilli sauce"],
    portion: "4 pieces",
    allergens: ["Wheat", "Soy"],
  },
  {
    slug: "roast-chicken",
    name: "Herb Roasted Chicken",
    category: "Main Course",
    price: 480,
    image: "/images/chicken-warm.webp",
    description:
      "Tender herb-roasted chicken with fragrant rice and seasonal greens.",
    ingredients: ["Chicken", "Rice", "Seasonal greens", "Herbs"],
    portion: "1 serving",
    allergens: [],
  },
  {
    slug: "chocolate-brownie",
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 240,
    image: "/images/brownie.jpg",
    description:
      "A rich chocolate brownie with a soft centre and a delicate cocoa finish.",
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Wheat flour"],
    portion: "1 slice",
    allergens: ["Milk", "Eggs", "Wheat"],
  },
  {
    slug: "tomato-pasta",
    name: "Tomato & Herb Pasta",
    category: "Main Course",
    price: 390,
    image: "/images/pasta-warm.webp",
    description:
      "Pasta tossed in a rich tomato sauce, finished with parmesan and fresh herbs.",
    ingredients: ["Pasta", "Tomatoes", "Parmesan", "Herbs"],
    portion: "1 bowl",
    allergens: ["Milk", "Wheat"],
  },
  {
    slug: "orange-cooler",
    name: "Fresh Orange Cooler",
    category: "Drinks",
    price: 180,
    image: "/images/drink.jpg",
    description:
      "Fresh orange juice, chilled and bright. A refreshing partner for your favourite meal.",
    ingredients: ["Orange juice", "Ice"],
    portion: "300 ml",
    allergens: [],
  },
  {
    slug: "garden-salad",
    name: "Garden Salad",
    category: "Starters",
    price: 260,
    image: "/images/salad.jpg",
    description:
      "A colourful mix of fresh leaves and vegetables with a light house dressing.",
    ingredients: [
      "Mixed leaves",
      "Tomato",
      "Seasonal vegetables",
      "House dressing",
    ],
    portion: "1 bowl",
    allergens: ["Mustard"],
  },
];
export function formatPrice(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}
