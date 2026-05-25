import chef from "@/assets/gallery-chef.jpg";
import interior from "@/assets/gallery-interior.jpg";
import { useAppData } from "@/hooks/use-app-data";

const STATIC_IMAGES = [
  {
    src: interior,
    alt: "Restaurant Interior",
    title: "Cozy Dining",
    span: "md:col-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1540648336483-d045d43a5b4a?q=80&w=1000&auto=format&fit=crop",
    alt: "Delicious Filipino Food",
    title: "Authentic Flavours",
    span: "md:col-span-1"
  },
  {
    src: chef,
    alt: "Our Chef",
    title: "Master Cooking",
    span: "md:col-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    alt: "Fresh Salad",
    title: "Fresh Selection",
    span: "md:col-span-1"
  },
];

export function GallerySection() {
  const { gallery: dynamicGallery, config } = useAppData();
  const { contact } = config;

  const galleryImages = dynamicGallery.length > 0
    ? dynamicGallery.map(img => ({ src: img.image_url, alt: img.title || "Gallery Image", title: img.title || "Tradition", span: "md:col-span-1" }))
    : STATIC_IMAGES;

  return (
    <section id="gallery" className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-tropical">
            The Gallery
          </div>
          <h2 className="text-4xl font-semibold md:text-6xl">
            Experience our <span className="text-gradient-tropical italic">Tradition.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white border border-black/5 shadow-card transition-all duration-700 hover:shadow-elegant hover:-translate-y-2 ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Content */}
              <div className="absolute bottom-6 left-6 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="mb-2 inline-block rounded-full bg-mango/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                  Gallery
                </span>
                <h4 className="text-lg font-bold text-white leading-tight">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
