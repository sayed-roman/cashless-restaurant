"use client";
import { useSearchParams } from "next/navigation";
import { categories, Category } from "@/data/menu";
import { ProductGrid } from "./product-grid";
export function MenuBrowser(){const params=useSearchParams();const selected=params.get("category");const category=categories.includes(selected as Category)?selected as Category:"All";return <ProductGrid key={category} initialCategory={category} order={false}/>}
