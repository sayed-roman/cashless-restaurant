import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dishes, formatPrice } from "@/data/menu";
import { OrderDish } from "@/components/menu/order-dish";
export function generateStaticParams(){return dishes.map(dish=>({slug:dish.slug}))}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;return {title:`${dishes.find(d=>d.slug===slug)?.name??"Dish"} | Cashless Restaurant`}}
export default async function DishPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const dish=dishes.find(d=>d.slug===slug);if(!dish)notFound();return <main id="main" className="section wrap"><Link className="back-link" href={`/menu/?category=${encodeURIComponent(dish.category)}`}>← Back to menu</Link><div className="dish-detail"><div className="detail-image"><Image src={dish.image} alt={dish.name} fill sizes="(max-width:700px) 100vw,50vw" preload/></div><div className="detail-copy"><p className="eyebrow">{dish.category}</p><h1 className="section-title">{dish.name}</h1><p className="detail-description">{dish.description}</p><p className="detail-price">{formatPrice(dish.price)} <span>{dish.portion}</span></p><dl><dt>Ingredients</dt><dd>{dish.ingredients.join(", ")}</dd><dt>Allergen information</dt><dd>{dish.allergens.length?`Contains ${dish.allergens.join(", ").toLowerCase()}.`:"Ask our team about preparation and cross-contact before ordering."}</dd></dl><OrderDish slug={dish.slug}/></div></div></main>}
