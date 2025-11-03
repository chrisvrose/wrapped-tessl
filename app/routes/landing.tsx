import { useTheme } from "@/components/providers/theme.provider";
import { useSidebar } from "@/components/ui/sidebar";
import type { Route } from "./+types/landing";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Emmanuel Alawode" },
    { name: "description", content: "I build stuff. And they work." },
  ];
}

export default function Home() {
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="grid h-full w-full grid-cols-6 grid-rows-5">
      <header className="landing-section col-span-4 row-span-2 flex w-full flex-col justify-center gap-5 border p-4 md:p-8"></header>

      <section className="landing-section col-span-2 row-span-2 border-y p-4 md:p-8"></section>

      <section className="landing-section col-span-6 row-span-1 border p-4 md:p-8"></section>

      <section className="landing-section col-span-6 row-span-2 border" />
    </div>
  );
}
