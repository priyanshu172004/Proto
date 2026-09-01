import { LiquidMorphFloatingMenu, type MenuItem } from "@/components/ui/liquid-morph-floating-menu";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Research } from "@/components/sections/research";
import { Stack } from "@/components/sections/stack";
import { Signals } from "@/components/sections/signals";
import { Experience } from "@/components/sections/experience";
import { Informatics } from "@/components/sections/informatics";
import { Gallery } from "@/components/sections/gallery";
import { Blog } from "@/components/sections/blog";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

const NAV: MenuItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "gallery", label: "Gallery" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <LiquidMorphFloatingMenu items={NAV} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Research />
        <Stack />
        <Signals />
        <Experience />
        <Informatics />
        <Gallery />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
