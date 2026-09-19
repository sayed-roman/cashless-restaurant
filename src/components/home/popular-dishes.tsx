"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dishes } from "@/data/menu";
export function PopularDishes() {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({start:true,end:false});
  useEffect(() => { const el=track.current; if(!el) return; const update=()=>setEdges({start:el.scrollLeft<5,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-5}); update();el.addEventListener("scroll",update,{passive:true});const observer=new ResizeObserver(update);observer.observe(el);return()=>{el.removeEventListener("scroll",update);observer.disconnect();}; },[]);
  function move(direction:number) { const el=track.current; if(el) el.scrollBy({left:direction*((el.firstElementChild?.getBoundingClientRect().width ?? 300)+24),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}); }
  return <section className="section wrap popular" aria-labelledby="popular-title"><div className="section-heading"><div><p className="eyebrow">Our most loved flavours</p><h2 className="section-title" id="popular-title">Popular Dishes</h2></div><div className="carousel-buttons"><button aria-label="Previous dishes" onClick={()=>move(-1)} disabled={edges.start}>←</button><button aria-label="Next dishes" onClick={()=>move(1)} disabled={edges.end}>→</button></div></div><div ref={track} className="popular-track" aria-label="Popular dishes" tabIndex={0} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();move(e.key==="ArrowRight"?1:-1);}}}>{dishes.map(dish=><Link href={`/menu/${dish.slug}/`} className="popular-card" key={dish.slug}><div className="popular-photo"><Image src={dish.image} alt={dish.name} fill sizes="(max-width: 700px) 85vw, 33vw"/></div><h3>{dish.name}</h3><p>{dish.category}</p></Link>)}</div></section>;
}
