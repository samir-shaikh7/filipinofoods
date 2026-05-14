import adobo from "@/assets/food-biryani.jpg";
import bbq from "@/assets/food-tandoori.jpg";
import pancit from "@/assets/food-noodles.jpg";
import lumpia from "@/assets/food-lollipop.jpg";
import inasal from "@/assets/food-tikka.jpg";
import interior from "@/assets/gallery-interior.jpg";
import chef from "@/assets/gallery-chef.jpg";
import combo from "@/assets/combo-family.jpg";

const IMAGES = [
  { src: combo, alt: "Authentic Filipino Party Bilao in Kuwait", span: "row-span-2" },
  { src: bbq, alt: "Char-grilled Filipino BBQ Skewers" },
  { src: chef, alt: "Filipino Chef grilling authentic Inasal", span: "row-span-2" },
  { src: adobo, alt: "Traditional Chicken Adobo Rice Bowl" },
  { src: inasal, alt: "Best Chicken Inasal in Kuwait City" },
  { src: interior, alt: "Filipino Food Restaurant Interior Kuwait", span: "col-span-2" },
  { src: pancit, alt: "Freshly cooked Pancit Canton noodles" },
  { src: lumpia, alt: "Crispy Filipino Fried Lumpia" },
];

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className=" mb-10 text-center">
          <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
            Gallery
          </div>
          <h2 className="text-4xl font-semibold md:text-6xl">
            A taste of our <span className="text-gradient-tropical italic">island kitchen</span>
          </h2>
        </div>

        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4 md:gap-4">
          {IMAGES.map((img, i) => (
            <figure
              key={i}
              className={` group relative overflow-hidden rounded-3xl shadow-card transition-all duration-500 hover:shadow-elegant ${img.span ?? ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-90"
                loading="lazy"
                decoding="async"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="absolute bottom-0 left-0 right-0 translate-y-4 p-5 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-mango" />
                  {img.alt}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
