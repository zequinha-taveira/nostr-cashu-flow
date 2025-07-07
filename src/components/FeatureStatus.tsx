import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const FeatureStatus: React.FC = () => {
  const features = [
    {
      category: "🔐 Key Management",
      items: [
        { name: "BIP39 Seed Generation", status: "✅", description: "12/24 word recovery phrases supported" },
        { name: "Key Derivation (BIP32/44)", status: "✅", description: "Lightning, eCash, and Nostr keys" },
        { name: "Local Encryption (AES-256)", status: "✅", description: "Password-protected storage" },
        { name: "Nostr Identity", status: "✅", description: "Ed25519 npub/nsec generation" }
      ]
    },
    {
      category: "⚡ Lightning Network",
      items: [
        { name: "LNURL Integration", status: "🚧", description: "Pay/withdraw support in development" },
        { name: "Invoice Generation", status: "🚧", description: "Create and pay Lightning invoices" },
        { name: "LSPS Integration", status: "🚧", description: "Liquidity service providers" },
        { name: "Auto Swaps", status: "🚧", description: "Automatic balance management" }
      ]
    },
    {
      category: "🪙 eCash (Cashu)",
      items: [
        { name: "Mint Integration", status: "🚧", description: "Connect to Cashu mints" },
        { name: "Token Operations", status: "🚧", description: "Split, melt, transfer tokens" },
        { name: "Proof Management", status: "🚧", description: "Local token storage" },
        { name: "QR Import/Export", status: "🚧", description: "Token sharing via QR codes" }
      ]
    },
    {
      category: "📡 Nostr P2P",
      items: [
        { name: "Relay Management", status: "🚧", description: "Connect to public relays" },
        { name: "P2P Messaging", status: "🚧", description: "Encrypted direct messages" },
        { name: "Swap Coordination", status: "🚧", description: "Peer-to-peer swaps" },
        { name: "Backup via Nostr", status: "🚧", description: "Encrypted wallet backups" }
      ]
    },
    {
      category: "🔄 Liquidity Pools",
      items: [
        { name: "Pool Discovery", status: "🚧", description: "Find active swap pools" },
        { name: "Automated Matching", status: "🚧", description: "Smart swap routing" },
        { name: "Fee Optimization", status: "🚧", description: "Best rate finding" },
        { name: "Earnings Tracking", status: "🚧", description: "LP rewards monitoring" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-bitcoin/10 to-lightning/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-bitcoin to-lightning bg-clip-text text-transparent">
            Development Roadmap
          </CardTitle>
          <p className="text-muted-foreground">
            Your self-custodial Bitcoin wallet with Lightning, eCash, and Nostr integration
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {features.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="border-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-lg mt-0.5">{item.status}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === '✅' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {item.status === '✅' ? 'Ready' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-nostr/10 to-ecash/10 border-nostr/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">🚀 Core Features Active</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your wallet, generate keys, and explore the foundation of decentralized Bitcoin storage. 
            Lightning Network and eCash integration coming soon!
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>✅ 100% Self-Custodial • ✅ No KYC Required • ✅ Local Encryption</p>
            <p>⚡ Lightning Ready • 🪙 eCash Ready • 📡 Nostr Ready</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};