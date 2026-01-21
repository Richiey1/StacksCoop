# StacksCoop Frontend

A Next.js frontend application for StacksCoop - a Bitcoin-Anchored Community Transparency Ledger built on the Stacks blockchain.

## Overview

StacksCoop provides communities, cooperatives, and civic organizations with a decentralized platform to record donations, track spending, and manage community projects with full transparency anchored to Bitcoin.

## Dependencies

### Stacks Packages

- **`@stacks/connect`** (v7.2.0) - Wallet connection and authentication
  - Connect user wallets (Leather, Xverse)
  - Handle user authentication and session management
  - Wallet connection UI components

- **`@stacks/transactions`** (v7.2.0) - Transaction building and signing
  - Build contract call transactions
  - Create Clarity values for ledger records
  - Transaction utilities

### Core Packages

- **Next.js** (v16.0.8) - React framework with App Router
- **React** (v19.2.1) - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Features

- 📝 **Record Submissions**: Submit donations, spending, and project records on-chain
- 🔍 **Public Verification**: Anyone can verify community transactions
- 👥 **Role-Based Access**: Manage community members and contributors
- 📊 **Transaction History**: View complete audit trail of all records
- 🏛️ **Multi-Community**: Support for multiple organizations on one platform
- 🔐 **Secure Authentication**: Wallet-based authentication for contributors

## Project Structure

```
StacksCoop/
├── smartcontract/       # Clarity smart contracts
│   ├── contracts/       # Ledger contract
│   ├── tests/           # Contract tests
│   └── README.md        # Contract documentation
└── frontend/            # Next.js frontend
    ├── app/             # Next.js pages
    ├── components/      # React components
    ├── hooks/           # Custom hooks
    └── README.md        # This file
```

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Prerequisites

- Node.js (v18+)
- A Stacks wallet (Leather or Xverse)
- Git

## Key Components

### Record Management
- Submit new community records
- View all transactions
- Filter and search records
- Export transaction history

### Community Dashboard
- View community overview
- Track total donations and spending
- Monitor active projects
- Member directory

### Admin Panel
- Add/remove community members
- Assign roles and permissions
- Configure community settings
- Manage approvals

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language](https://docs.stacks.co/docs/clarity)
- [Stacks.js](https://stacks.js.org)

## Status

🚧 **In Development** - Core ledger features coming soon!

---

Built for community transparency and accountability on Bitcoin.
