import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Skill1 Hire — Where Proof Meets Opportunity",
  description: "India's first verified talent platform. Only pre-assessed, capstone-proven candidates get hired here.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />
      </head>
      <body className="grain">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            richColors
            expand={false}
            toastOptions={{
              style: { fontFamily: "'DM Sans', sans-serif" },
              duration: 3500,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
