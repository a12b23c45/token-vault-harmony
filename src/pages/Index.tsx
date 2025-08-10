import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import TokenPortfolio from "@/components/tokens/TokenPortfolio";
import { toast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [pos, setPos] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    if (isConnected && address) {
      toast({
        title: "Wallet connected",
        description: `${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-hero">
      <header className="container mx-auto py-6">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-lg font-semibold font-display story-link" aria-label="Token Manager home">
            Token Manager
          </a>
          <ConnectButton />
        </nav>
      </header>

      <main
        className="container mx-auto px-4 pb-16"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = `${e.clientX - rect.left}px`;
          const y = `${e.clientY - rect.top}px`;
          setPos({ x, y });
          (e.currentTarget as HTMLElement).style.setProperty("--x", x);
          (e.currentTarget as HTMLElement).style.setProperty("--y", y);
        }}
      >
        <section className="py-14 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
            Token Management for Blockchain Portfolios
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8">
            Connect your wallet to view live ERC-20 balances. Fast, secure, and privacy-friendly.
          </p>
          {!isConnected && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="hero" asChild className="hover-scale">
                <a href="#connect">Get Started</a>
              </Button>
              <div id="connect" className="sr-only" />
              <ConnectButton />
            </div>
          )}
        </section>

        {isConnected && (
          <section className="grid gap-6 md:grid-cols-1">
            <TokenPortfolio />
          </section>
        )}
      </main>

      <footer className="container mx-auto py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Token Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
