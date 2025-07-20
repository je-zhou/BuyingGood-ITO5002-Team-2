import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
      <Footer></Footer>
    </div>
  );
}
