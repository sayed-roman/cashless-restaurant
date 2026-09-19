import Image from "next/image";
import Link from "next/link";
const panels = [
  {
    name: "Starters",
    image: "spring-rolls",
    caption: "Fresh & flavourful",
    style: "starter",
  },
  {
    name: "Main Course",
    image: "chicken",
    caption: "Chef crafted",
    style: "main-course",
  },
  {
    name: "Desserts",
    image: "brownie",
    caption: "Sweet endings",
    style: "dessert",
  },
  { name: "Drinks", image: "drink", caption: "Sip & savour", style: "drinks" },
];
export function MenuShowcase() {
  return (
    <section
      id="menu"
      className="menu-showcase"
      aria-label="Explore our menu categories"
    >
      {panels.map((panel) => (
        <Link
          className={`menu-panel ${panel.style}`}
          key={panel.name}
          href={`/menu/?category=${encodeURIComponent(panel.name)}`}
        >
          <div className="menu-panel-photo">
            <Image
              src={`/images/${panel.image}.jpg`}
              alt={panel.name}
              fill
              sizes="(max-width: 700px) 50vw, 30vw"
            />
          </div>
          <div className="menu-panel-copy">
            <p className="eyebrow">{panel.caption}</p>
            <h2>{panel.name}</h2>
            <span className="view-menu">
              View Menu <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
