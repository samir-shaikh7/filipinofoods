import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";

export function ContactSection() {
  const { config } = useAppData();
  const { contact } = config;
  return (
    <section id="contact" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className=" mb-10 text-center">
          <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
            Visit · Order · Connect
          </div>
          <h2 className="text-4xl font-semibold md:text-6xl">
            Hungry yet? <span className="text-gradient-tropical italic">Reach out.</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className=" space-y-4">
            {[
              { icon: MapPin, title: "Our Restaurant", text: contact.address },
              { icon: Phone, title: "Call us", text: contact.call },
              { icon: Clock, title: "Open daily", text: `${contact.openingHours} (${contact.deliveryHours})` },
              { icon: MessageCircle, title: "Support", text: "Chat with us via WhatsApp" },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-4 rounded-2xl bg-white border border-black/5 p-5 shadow-soft">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-tropical text-white shadow-soft">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-foreground/65">{c.text}</div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=Hello,%20I%20have%20a%20question%20about%20my%20order`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full gradient-tropical px-6 py-3 font-semibold text-white btn-glow"
              >
                <MessageCircle className="h-4 w-4" /> Order via WhatsApp
              </a>
              <a
                href={`tel:${contact.call.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold shadow-soft"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
            </div>
          </div>

          <div className=" overflow-hidden rounded-[2rem] shadow-pop ring-tropical">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2866.4710232448006!2d48.0886452!3d29.346748000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf7700176209a9%3A0x9ef856ff157843f3!2sFirst%20Mall!5e1!3m2!1sen!2sin!4v1778777586261!5m2!1sen!2sin"
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
