import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { decryptWallet, WalletKeys } from '@/lib/crypto';
import { loadWalletStorage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface WalletLoginProps {
  onWalletUnlocked: (wallet: WalletKeys) => void;
}

export const WalletLogin: React.FC<WalletLoginProps> = ({ onWalletUnlocked }) => {
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive"
      });
      return;
    }

    setIsUnlocking(true);
    
    try {
      const storage = loadWalletStorage();
      if (!storage?.encryptedWallet) {
        throw new Error('No wallet found');
      }

      const wallet = await decryptWallet(storage.encryptedWallet, password);
      onWalletUnlocked(wallet);
      
      toast({
        title: "Success",
        description: "Wallet unlocked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unlock wallet",
        variant: "destructive"
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-bitcoin to-lightning bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Enter your password to unlock your Bitcoin wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your wallet password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>

        <Button
          onClick={handleUnlock}
          disabled={isUnlocking}
          variant="bitcoin"
          className="w-full"
        >
          {isUnlocking ? 'Unlocking...' : 'Unlock Wallet'}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          <p>🔒 Your wallet is encrypted and stored locally</p>
          <p>🚫 No servers, no tracking, fully private</p>
        </div>
      </CardContent>
    </Card>
  );
};