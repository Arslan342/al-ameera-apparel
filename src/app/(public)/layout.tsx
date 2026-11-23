import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AmbientBackdrop from "@/components/motion/AmbientBackdrop";
import ScrollProgress from "@/components/motion/ScrollProgress";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <AmbientBackdrop />
      <ScrollProgress />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
