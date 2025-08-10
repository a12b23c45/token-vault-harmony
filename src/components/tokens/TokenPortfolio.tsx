import React, { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Address, formatUnits } from "viem";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ERC20_ABI } from "@/lib/erc20";
import { MAINNET_TOKENS } from "@/data/tokens";

interface TokenBalance {
  symbol: string;
  balance: string;
  raw: bigint;
}

const TokenPortfolio: React.FC = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async () => {
    if (!publicClient || !address) return;
    setLoading(true);
    setError(null);
    try {
      const results: TokenBalance[] = [];
      for (const t of MAINNET_TOKENS) {
        const [decimals, symbol, raw] = await Promise.all([
          publicClient.readContract({
            address: t.address as Address,
            abi: ERC20_ABI,
            functionName: "decimals",
          }) as Promise<number>,
          publicClient.readContract({
            address: t.address as Address,
            abi: ERC20_ABI,
            functionName: "symbol",
          }) as Promise<string>,
          publicClient.readContract({
            address: t.address as Address,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address as Address],
          }) as Promise<bigint>,
        ]);
        const formatted = Number(formatUnits(raw, decimals)).toLocaleString(
          undefined,
          { maximumFractionDigits: 6 }
        );
        results.push({ symbol: symbol || t.symbol, balance: formatted, raw });
      }
      setBalances(results);
    } catch (e: any) {
      setError(e?.message || "Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) fetchBalances();
  }, [isConnected, address]);

  if (!isConnected) return null;

  return (
    <Card className="elevated">
      <CardHeader>
        <CardTitle>Your Tokens (Ethereum Mainnet)</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 text-destructive">Error: {error}</div>}
        <div className="mb-4">
          <Button variant="secondary" onClick={fetchBalances} disabled={loading} size="sm">
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((b) => (
                <TableRow key={b.symbol}>
                  <TableCell className="font-medium">{b.symbol}</TableCell>
                  <TableCell className="text-right tabular-nums">{b.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenPortfolio;
