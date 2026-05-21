import ReduxProvider from "@/store/Provider";
import { Toaster } from "react-hot-toast";
import "../globals.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: {
              borderRadius: '1.5rem',
              background: '#fdfaf5',
              color: '#2d1b0d',
              border: '1px solid rgba(212,175,55,0.2)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
            },
          }} />
        </ReduxProvider>
      </body>
    </html>
  );
}
