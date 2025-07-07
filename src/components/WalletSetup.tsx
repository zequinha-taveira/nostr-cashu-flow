import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateWallet, restoreWallet, encryptWallet, WalletKeys } from '@/lib/crypto';
import { saveWalletStorage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface WalletSetupProps {
  onWalletCreated: (wallet: WalletKeys) => void;
}

export const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restoreMnemonic, setRestoreMnemonic] = useState('');
  const [mode, setMode] = useState<'create' | 'restore'>('create');
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string>('');
  const [showMnemonic, setShowMnemonic] = useState(false);

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const wallet = await generateWallet(12);
      setGeneratedMnemonic(wallet.mnemonic);
      setShowMnemonic(true);
      
      // Don't save to storage yet - wait for user confirmation
      toast({
        title: "Wallet Created",
        description: "Please write down your recovery phrase safely",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmWallet = async () => {
    try {
      const wallet = await restoreWallet(generatedMnemonic);
      const encryptedWallet = await encryptWallet(wallet, password);
      
      saveWalletStorage({
        encryptedWallet,
        preferences: {
          prioritizePrivacy: true,
          prioritizeSpeed: false,
          defaultCurrency: 'sats'
        }
      });
      
      onWalletCreated(wallet);
      
      toast({
        title: "Success",
        description: "Wallet created and secured successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to secure wallet",
        variant: "destructive"
      });
    }
  };

  const handleRestoreWallet = async () => {
    if (!restoreMnemonic.trim()) {
      toast({
        title: "Error",
        description: "Please enter your recovery phrase",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const wallet = await restoreWallet(restoreMnemonic.trim());
      const encryptedWallet = await encryptWallet(wallet, password);
      
      saveWalletStorage({
        encryptedWallet,
        preferences: {
          prioritizePrivacy: true,
          prioritizeSpeed: false,
          defaultCurrency: 'sats'
        }
      });
      
      onWalletCreated(wallet);
      
      toast({
        title: "Success",
        description: "Wallet restored successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to restore wallet",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (showMnemonic) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-bitcoin">Recovery Phrase</CardTitle>
          <CardDescription>
            Write down these 12 words in order. Keep them safe and private.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-2 text-sm">
              {generatedMnemonic.split(' ').map((word, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-muted-foreground w-4">{index + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
            <p className="text-sm text-warning font-medium">
              ⚠️ Never share your recovery phrase with anyone. Store it securely offline.
            </p>
          </div>

          <Button 
            onClick={handleConfirmWallet}
            variant="bitcoin"
            className="w-full"
          >
            I've Written Down My Recovery Phrase
          </Button>
          
          <Button 
            onClick={() => setShowMnemonic(false)}
            variant="outline"
            className="w-full"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-bitcoin to-lightning bg-clip-text text-transparent">
          Bitcoin Wallet
        </CardTitle>
        <CardDescription>
          Create a new wallet or restore from recovery phrase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={mode === 'create' ? 'bitcoin' : 'outline'}
            onClick={() => setMode('create')}
            className="flex-1"
          >
            Create New
          </Button>
          <Button
            variant={mode === 'restore' ? 'bitcoin' : 'outline'}
            onClick={() => setMode('restore')}
            className="flex-1"
          >
            Restore
          </Button>
        </div>

        {mode === 'restore' && (
          <div className="space-y-2">
            <Label htmlFor="mnemonic">Recovery Phrase</Label>
            <Textarea
              id="mnemonic"
              placeholder="Enter your 12 or 24 word recovery phrase..."
              value={restoreMnemonic}
              onChange={(e) => setRestoreMnemonic(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={mode === 'create' ? handleCreateWallet : handleRestoreWallet}
          disabled={isCreating}
          variant="bitcoin"
          className="w-full"
        >
          {isCreating ? 'Processing...' : mode === 'create' ? 'Create Wallet' : 'Restore Wallet'}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>🔒 Your keys are encrypted and stored locally</p>
          <p>🔄 No servers, no accounts, fully self-custodial</p>
        </div>
      </CardContent>
    </Card>
  );
};