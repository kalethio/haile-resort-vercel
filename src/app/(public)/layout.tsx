// app/layout.tsx or components/SiteLayout.tsx
import Navbar from "../components/navbar";
import ChatBot from "../components/chatBot";
import Footer from "../components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* ChatBot */}
      <ChatBot />
      {/* Hero / main section */}
      <main className="flex-1 w-full">
        {/* Centered content wrapper */}
        <div>{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
