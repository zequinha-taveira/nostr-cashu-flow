import React, { useState, useEffect } from 'react';
import { WalletSetup } from '@/components/WalletSetup';
import { WalletLogin } from '@/components/WalletLogin';
import { WalletDashboard } from '@/components/WalletDashboard';
import { WalletKeys } from '@/lib/crypto';
import { hasStoredWallet } from '@/lib/storage';

const Index = () => {
  const [wallet, setWallet] = useState<WalletKeys | null>(null);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if wallet exists on component mount
    setHasWallet(hasStoredWallet());
  }, []);

  const handleWalletCreated = (newWallet: WalletKeys) => {
    setWallet(newWallet);
    setHasWallet(true);
  };

  const handleWalletUnlocked = (unlockedWallet: WalletKeys) => {
    setWallet(unlockedWallet);
  };

  // Loading state
  if (hasWallet === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bitcoin/5 to-lightning/5">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-bitcoin border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bitcoin/5 via-background to-lightning/5">
      <div className="container mx-auto px-4 py-8">
        {!wallet ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            {hasWallet ? (
              <WalletLogin onWalletUnlocked={handleWalletUnlocked} />
            ) : (
              <WalletSetup onWalletCreated={handleWalletCreated} />
            )}
          </div>
        ) : (
          <div className="flex items-start justify-center min-h-[80vh] pt-8">
            <WalletDashboard wallet={wallet} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
