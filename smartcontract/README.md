# StacksCoop Smart Contract

Clarity smart contract implementation for StacksCoop - a Bitcoin-Anchored Community Transparency Ledger on the Stacks blockchain.

## Overview

The StacksCoop smart contract enables decentralized, transparent record-keeping for community organizations. All transactions, donations, and spending records are stored and verified on the blockchain, anchored to Bitcoin for permanent immutability.

## Clarity Version

- **Current Version**: Clarity 3 (development)
- **Target Version**: Clarity 4 (for mainnet deployment)

## Project Structure

```
smartcontract/
├── contracts/           # Clarity smart contract files (.clar)
│   └── stackscoop.clar # Main ledger contract
├── tests/              # Test files (.test.ts)
│   └── stackscoop.test.ts # Ledger contract tests
├── settings/           # Network configuration
│   ├── Devnet.toml    # Development network settings
│   └── Testnet.toml   # Testnet deployment settings
├── deployments/        # Deployment plans
├── Clarinet.toml       # Clarinet configuration
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## Features

### Phase 1 (Current Development)
- **Record Submission**: Submit donation and spending records on-chain
- **Public Verification**: Read-only functions to verify all records
- **Community Management**: Track community members and organizations
- **Event Logging**: Emit events for off-chain indexing
- **Access Control**: Role-based permissions for record submission

### Phase 2 (Planned)
- **Multi-Signature Approvals**: Require multiple approvals for large transactions
- **Project Tracking**: Link records to specific community projects
- **Voting Mechanisms**: Community governance on spending proposals
- **Advanced Reporting**: Aggregated statistics and summaries

## Development Setup

### Prerequisites

- Clarinet (Stacks smart contract development tool)
- Node.js (v18+)

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:report
```

## Contract Functions

### Public Functions

- `submit-record` - Submit a new transaction record (donation/spending)
- `add-member` - Add a new community member
- `remove-member` - Remove a community member
- `update-member-role` - Change member permissions
- `create-community` - Register a new community organization

### Read-Only Functions

- `get-record` - Retrieve a specific record by ID
- `get-community-records` - Get all records for a community
- `get-member` - Get member information
- `verify-record` - Verify record authenticity
- `get-total-donations` - Total donations for a community
- `get-total-spending` - Total spending for a community

## Data Structures

### Record
```clarity
{
  record-id: uint,
  community-id: uint,
  record-type: (string-ascii 20), ;; "donation" or "spending"
  amount: uint,
  description: (string-utf8 256),
  submitter: principal,
  timestamp: uint,
  verified: bool
}
```

### Community
```clarity
{
  community-id: uint,
  name: (string-utf8 100),
  admin: principal,
  created-at: uint,
  active: bool
}
```

### Member
```clarity
{
  member-address: principal,
  community-id: uint,
  role: (string-ascii 20), ;; "admin", "contributor", "viewer"
  joined-at: uint
}
```

## Testing

Tests are written using Vitest and the Clarinet SDK:

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode for development
```

## Deployment

### Testnet Deployment

```bash
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

### Mainnet Deployment

Coming soon after testing phase.

## Dependencies

### Testing Dependencies

- **`@stacks/clarinet-sdk`** (v3.11.0) - Clarity contract testing
- **`@stacks/clarinet-sdk-wasm`** (v3.11.0) - WASM runtime
- **`@stacks/transactions`** (v7.2.0) - Transaction utilities
- **`vitest`** (v3.2.4) - Test runner
- **`vitest-environment-clarinet`** (v3.0.2) - Clarinet test environment

## Security Considerations

- No sensitive personal data stored on-chain
- Only transaction hashes and public records
- Role-based access control
- Admin functions protected
- Record immutability after submission

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language](https://docs.stacks.co/docs/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)

## Status

🚧 **In Development** - Core ledger contract coming soon!

---

Building transparent, accountable infrastructure for communities on Bitcoin.
