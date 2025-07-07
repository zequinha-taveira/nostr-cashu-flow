# Bitcoin Wallet - Autocustodial Descentralizada

Uma carteira Bitcoin 100% autocustodial com integração Lightning Network, eCash (Cashu) e comunicação via relays Nostr.

## ✅ Funcionalidades Implementadas

### 🔐 Gerenciamento de Chaves e Identidade
- **BIP39 Seed Generation**: Geração de frases de recuperação de 12 palavras
- **Key Derivation (BIP32/44)**: Derivação de chaves para Lightning Network, eCash e Nostr
- **Criptografia Local**: Armazenamento criptografado com AES-256-GCM + PBKDF2
- **Identidade Nostr**: Geração automática de chaves Ed25519 (npub/nsec)
- **Login sem senha**: Autenticação usando apenas a chave mestra local

### 🔧 Infraestrutura Base
- **Interface Responsiva**: Design otimizado para mobile e desktop
- **Sistema de Temas**: Gradientes Bitcoin/Lightning customizados
- **Armazenamento Local**: Dados criptografados no navegador
- **Validação Segura**: Verificação de mnemonics e senhas

## 🚧 Em Desenvolvimento

### ⚡ Lightning Network (LN)
- [ ] Integração LNURL-pay e LNURL-withdraw
- [ ] Conexão com LSPS públicos (Phoenix, Breez, Mutiny)
- [ ] Geração e pagamento de invoices
- [ ] Swaps automáticos para liquidez

### 🪙 eCash (Cashu)
- [ ] Integração com mints públicas Cashu
- [ ] Operações de split, melt e transfer de tokens
- [ ] Armazenamento seguro de proofs
- [ ] Import/export via QR codes

### 📡 Comunicação Nostr P2P
- [ ] Conexão com relays públicos
- [ ] Mensagens criptografadas (NIP-04)
- [ ] Backup da wallet via Nostr
- [ ] Coordenação de swaps P2P

### 🔄 Controlador de Swap Local
- [ ] Detecção automática LN vs eCash
- [ ] Conversão automática baseada em saldo
- [ ] Otimização de taxas dinâmicas
- [ ] Preferências de privacidade vs velocidade

### 🌊 Pools de Liquidez Descentralizados
- [ ] Descoberta de pools via Nostr
- [ ] Matching automático de ofertas
- [ ] Sistema de reputação P2P
- [ ] Distribuição de microtaxas

## 🏗️ Arquitetura

```
Wallet Frontend (React/TypeScript)
├── 🔐 Key Management (BIP39/32/44)
├── ⚡ Lightning Network Layer
├── 🪙 eCash/Cashu Integration  
├── 📡 Nostr Communication
├── 🔄 Swap Controller
└── 🌊 Liquidity Pool Manager
```

## 🔒 Segurança

- **Sem Servidores**: Tudo roda no cliente, zero dependências de backend
- **Sem KYC**: Nenhuma identificação ou verificação necessária
- **Criptografia Local**: AES-256-GCM com derivação PBKDF2
- **Chaves Derivadas**: BIP44 para separação de contextos
- **Backup Nostr**: Backup criptografado via relays descentralizados

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Criptografia**: @scure/bip39, @scure/bip32, @noble/hashes
- **Bitcoin**: @noble/secp256k1 para operações de chave
- **Nostr**: nostr-tools para comunicação P2P
- **UI**: shadcn/ui + componentes customizados

## 📱 Interface

### Tela Principal
- Saldo total (Lightning + eCash)
- Botões "Enviar" e "Receber"  
- Acesso rápido a Swap e Pools
- Status de conectividade em tempo real

### Configurações
- Preferência: Privacidade vs Velocidade
- Moeda padrão: sats vs BTC
- Backup e recuperação
- Informações da carteira

## 🎯 Objetivos

1. **100% Autocustodial**: Usuário controla todas as chaves
2. **Zero Servidores**: Funciona apenas com relays públicos
3. **Interoperabilidade**: Lightning + eCash + Nostr
4. **Privacidade por Padrão**: Comunicação criptografada
5. **UX Simples**: Interface minimalista e intuitiva

## 🛣️ Próximos Passos

1. **Lightning Integration**: Implementar LNURL e conexão LSPS
2. **Cashu Integration**: Conectar com mints e operações de token
3. **Nostr Messaging**: Sistema de comunicação P2P
4. **Swap Engine**: Lógica de conversão automática
5. **Liquidity Pools**: Mercado descentralizado de liquidez

## 🔗 Links Úteis

- [BIP39 Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [Lightning Network](https://lightning.network/)
- [Cashu Protocol](https://cashu.space/)
- [Nostr Protocol](https://nostr.com/)
- [LNURL Specification](https://github.com/lnurl/luds)

---

**Status**: 🚧 Em desenvolvimento ativo • **Versão**: 0.1.0-alpha • **Rede**: Bitcoin Mainnet Ready