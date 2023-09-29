import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";

import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AskPDF.",
    description:
        "Ask PDF allows you to have conversations with any PDF document. Simply upload a PDF and start chatting with it.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light" suppressHydrationWarning={true}>
            <Providers>
                <body
                    className={cn(
                        "min-h-screen font-sans antialiased grainy",
                        inter.className
                    )}
                    suppressHydrationWarning={true}
                >
                    <Toaster />
                    <Navbar />
                    {children}
                </body>
            </Providers>
        </html>
    );
}
