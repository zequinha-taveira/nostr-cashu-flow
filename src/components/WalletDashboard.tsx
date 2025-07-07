import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WalletBalance } from './WalletBalance';
import { FeatureStatus } from './FeatureStatus';
import { TodoList } from './TodoList';
import { WalletKeys } from '@/lib/crypto';
import { getPreferences } from '@/lib/storage';

interface WalletDashboardProps {
  wallet: WalletKeys;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ wallet }) => {
  const [lightningBalance] = useState(0); // TODO: Implement Lightning balance fetching
  const [ecashBalance] = useState(0); // TODO: Implement eCash balance fetching
  const preferences = getPreferences();

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log('Send clicked');
  };

  const handleReceive = () => {
    // TODO: Implement receive functionality
    console.log('Receive clicked');
  };

  const handleSwap = () => {
    // TODO: Implement swap functionality
    console.log('Swap clicked');
  };

  const handlePools = () => {
    // TODO: Implement liquidity pools
    console.log('Pools clicked');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-bitcoin/5 to-lightning/5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg">
            <span className="bg-gradient-to-r from-bitcoin to-lightning bg-clip-text text-transparent">
              Bitcoin Wallet
            </span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {wallet.npub.slice(0, 8)}...{wallet.npub.slice(-8)}
          </p>
        </CardHeader>
      </Card>

      {/* Balance Display */}
      <WalletBalance
        lightningBalance={lightningBalance}
        ecashBalance={ecashBalance}
        currency={preferences.defaultCurrency}
      />

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleSend}
          variant="lightning"
          size="lg"
          className="h-16 flex-col space-y-1"
        >
          <span className="text-lg">⚡</span>
          <span>Send</span>
        </Button>
        
        <Button
          onClick={handleReceive}
          variant="bitcoin"
          size="lg"
          className="h-16 flex-col space-y-1"
        >
          <span className="text-lg">📥</span>
          <span>Receive</span>
        </Button>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleSwap}
          variant="ecash"
          className="h-12 flex-col space-y-1"
        >
          <span className="text-sm">🔄</span>
          <span className="text-xs">Swap</span>
        </Button>
        
        <Button
          onClick={handlePools}
          variant="nostr"
          className="h-12 flex-col space-y-1"
        >
          <span className="text-sm">🌊</span>
          <span className="text-xs">Pools</span>
        </Button>
      </div>

      {/* Info & Status */}
      <div className="grid grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-12 flex-col space-y-1"
            >
              <span className="text-sm">ℹ️</span>
              <span className="text-xs">Info</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Development Status & Roadmap</DialogTitle>
            </DialogHeader>
            <FeatureStatus />
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          className="h-12 flex-col space-y-1"
        >
          <span className="text-sm">🔒</span>
          <span className="text-xs">Security</span>
        </Button>
      </div>

      {/* Status Bar */}
      <Card className="bg-muted/50">
        <CardContent className="p-3">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Connected</span>
            </div>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>⚡ LN Ready</span>
              <span>🪙 eCash Ready</span>
              <span>📡 Nostr Online</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <TodoList />

      {/* Quick Stats */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Preference: {preferences.prioritizePrivacy ? '🔒 Privacy First' : '⚡ Speed First'}</p>
        <p>Network: Mainnet • Fully Decentralized</p>
      </div>
    </div>
  );
};