import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WalletBalanceProps {
  lightningBalance: number;
  ecashBalance: number;
  currency: 'sats' | 'btc';
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  lightningBalance,
  ecashBalance,
  currency
}) => {
  const formatBalance = (sats: number) => {
    if (currency === 'btc') {
      return `₿ ${(sats / 100000000).toFixed(8)}`;
    }
    return `${sats.toLocaleString()} sats`;
  };

  const totalBalance = lightningBalance + ecashBalance;

  return (
    <div className="space-y-4">
      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-bitcoin/10 to-lightning/10 border-bitcoin/20">
        <CardContent className="p-6 text-center">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Total Balance</h2>
          <p className="text-3xl font-bold bg-gradient-to-r from-bitcoin to-lightning bg-clip-text text-transparent">
            {formatBalance(totalBalance)}
          </p>
        </CardContent>
      </Card>

      {/* Individual Balances */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-lightning/10 to-blue-500/10 border-lightning/20">
          <CardContent className="p-4 text-center">
            <h3 className="text-xs font-medium text-muted-foreground mb-1">Lightning</h3>
            <p className="text-lg font-semibold text-lightning">
              {formatBalance(lightningBalance)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-ecash/10 to-purple-500/10 border-ecash/20">
          <CardContent className="p-4 text-center">
            <h3 className="text-xs font-medium text-muted-foreground mb-1">eCash</h3>
            <p className="text-lg font-semibold text-ecash">
              {formatBalance(ecashBalance)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};