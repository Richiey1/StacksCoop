# StacksCoop
**Bitcoin-Anchored Community Transparency Ledger**

## Overview

StacksCoop is a decentralized public ledger designed for community transparency and accountability. Built on Stacks (Bitcoin L2), it allows local organizations, cooperatives, NGOs, and civic groups to:

- Record donations and spending
- Track community projects
- Ensure transparent governance

By anchoring data to Bitcoin, StacksCoop provides immutable, verifiable, and tamper-proof records that communities can trust.

**This is not a financial speculation project.**  
It is a trust and transparency primitive for civic and cooperative use cases.

## Problem

Across communities — especially in Africa:

- Donations and funds are often mismanaged or opaque
- Community project spending lacks verifiable records
- Local organizations face trust deficits
- Traditional bookkeeping is fragmented, error-prone, or offline

There is no neutral, transparent, and permanent infrastructure for community finance and project reporting.

## The Solution

StacksCoop creates on-chain, verifiable records of:

- Community project funding
- Donations and grants
- Spending and disbursement

Each record is:

- Cryptographically verifiable
- Owned by the organization or cooperative
- Anchored permanently on Bitcoin via Stacks

**No sensitive personal data is stored on-chain** — only hashed proofs and transactions.

## Core Features

- Public record of contributions and spending
- Immutable project ledger
- Event emission for indexing and analytics
- Optional role-based access for trusted contributors
- Transparent reporting for communities, donors, and members

## Use Cases

✅ Town unions tracking communal funds  
✅ Religious organizations tracking donations  
✅ Local NGOs reporting spending  
✅ Cooperative groups managing shared projects  
✅ Civic projects with public accountability

## Why Bitcoin & Stacks

- **Bitcoin** = permanent trust layer
- **Stacks** enables smart contracts without compromising Bitcoin security
- Transparency and accountability are anchored immutably
- Communities gain long-term verifiable records

**Short-lived ledgers don't build trust — permanent ones do.**

## Project Structure

```
StacksCoop/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utility functions
│
├── smartcontract/    # Clarity smart contracts
│   ├── contracts/    # Ledger contract source
│   ├── tests/        # Contract tests
│   └── settings/     # Network configurations
│
└── README.md         # This file
```

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@stacks/connect** - Wallet connection
- **@stacks/transactions** - Blockchain interactions

### Smart Contract
- **Clarity** - Smart contract language for Stacks
- **Clarinet** - Development and testing tool
- **Vitest** - Test runner

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Clarinet (for smart contract development)
- A Stacks wallet (Leather or Xverse)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StacksCoop.git
   cd StacksCoop
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

3. **Set up the smart contract**
   ```bash
   cd smartcontract
   npm install
   npm run test
   ```

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Smart Contract Development

```bash
cd smartcontract
npm run test              # Run tests
npm run test:report       # Run tests with coverage
npm run test:watch        # Watch mode for development
```

## Deployment

### Frontend Deployment

The frontend can be deployed to Vercel, Netlify, or any platform that supports Next.js applications.

### Smart Contract Deployment

Contracts can be deployed to Stacks testnet or mainnet using Clarinet:

```bash
cd smartcontract
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

## Impact

- Promotes accountability and trust
- Reduces fund mismanagement and corruption
- Strengthens community governance
- Encourages transparency in donations and projects
- Builds Bitcoin-native civic infrastructure

## Roadmap

### Phase 1:
- Core ledger smart contract
- Record donations, spending, projects
- Public verification functions

### Phase 2:
- Role-based access for contributors
- Event indexing for dashboards
- Optional visual frontend

### Phase 3:
- Multi-community support
- Cross-platform integration (NGO portals, cooperatives)
- Long-term anchoring improvements

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/docs/clarity)
- [Stacks.js Documentation](https://stacks.js.org)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Next.js Documentation](https://nextjs.org/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Status

🚧 **In Development** - This project is actively being built. Core features coming soon!

---

Built with ❤️ on the Stacks blockchain for community transparency and accountability.
