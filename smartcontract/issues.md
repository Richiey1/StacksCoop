# Smart Contract Issues

This file contains all GitHub issues for the StacksCoop (formerly Scredence/StackTacToe) smart contracts. Each issue is ready to be copied into GitHub.

## ✅ Completed Issues

### Issue #1: Project Setup & Configuration

**Status:** ✅ COMPLETED

**Labels:** `smart-contracts`, `infrastructure`, `setup`

**Priority:** HIGH

**Description:**
Initialize Clarinet project and configure for Stacks blockchain development.

**Acceptance Criteria:**
- [x] `Clarinet.toml` configuration
- [x] Project structure (`contracts`, `tests`, `settings`)
- [x] Dependencies installed (`@stacks/transactions`)
- [x] Testnet/Devnet settings configured

---

### Issue #2: Community Management Logic

**Status:** ✅ COMPLETED

**Labels:** `smart-contracts`, `core`, `logic`

**Priority:** HIGH

**Description:**
Implement core community management functionality in `stackscoop.clar`.

**Acceptance Criteria:**
- [x] `create-community`: Create new community organizations
- [x] `add-member`: Admin adds members with roles
- [x] `remove-member`: Admin removes members
- [x] `update-member-role`: Role management (Admin, Contributor, Viewer)
- [x] Unique community name enforcement

**Implementation Notes:**
- Implemented using Data Maps for efficient storage
- Role-based access control (RBAC) implemented

---

### Issue #3: Record Management System

**Status:** ✅ COMPLETED

**Labels:** `smart-contracts`, `core`, `logic`

**Priority:** HIGH

**Description:**
Implement the immutable ledger for donations and spending records.

**Acceptance Criteria:**
- [x] `submit-record`: Submit Donation/Spending/Project records
- [x] `verify-record`: Admin verification of pending records
- [x] Automatic total calculation (Total Donations, Total Spending)
- [x] Record validation (Amount, Description, Type)

**Implementation Notes:**
- Supports multiple record types: `donation`, `spending`, `project`, `grant`
- Timestamps anchored to Stacks block height

---

### Issue #4: Read-Only View Functions

**Status:** ✅ COMPLETED

**Labels:** `smart-contracts`, `interface`, `data`

**Priority:** MEDIUM

**Description:**
Implement Getter functions for frontend integration.

**Acceptance Criteria:**
- [x] `get-community`: Fetch community details
- [x] `get-member`: Fetch member status/role
- [x] `get-record`: Fetch record details
- [x] `get-total-donations` / `get-total-spending`
- [x] `is-admin` / `is-member` helpers

---

### Issue #5: Unit Testing

**Status:** ✅ COMPLETED

**Labels:** `smart-contracts`, `testing`, `quality`

**Priority:** HIGH

**Description:**
Comprehensive unit tests for all contract functions.

**Acceptance Criteria:**
- [x] Community creation tests
- [x] Member management tests (Add/Remove/Update)
- [x] Permission/Authorization tests (Admin vs Non-Admin)
- [x] Record submission and totals tests
- [x] View function tests

**Implementation Notes:**
- Uses `Vitest` and `@stacks/transactions`
- Located in `tests/stackscoop.test.ts`

---

### Issue #9: Token Integration (SIP-010)
**Status:** ✅ COMPLETED
**Labels:** `smart-contracts`, `feature`, `defi`
**Priority:** LOW

**Description:**
Integrate SIP-010 token support for donations (currently STX/Micro-STX only implicitly).

**Acceptance Criteria:**
- [x] Add support for SIP-010 token transfers in `submit-record`
- [x] Handle token transfer events
- [x] Verify token traits

**Implementation Notes:**
- `sip010-token-mock.clar` exists but is not fully integrated into `stackscoop.clar` yet.

---

### Issue #10: Multi-Asset Donation Support (STX, sBTC, USDCx)

**Status:** ✅ COMPLETED

**Labels:** `smart-contracts`, `feature`, `payments`, `defi`

**Priority:** HIGH

**Description:**
Extend the donation and record submission system to support real on-chain transfers for multiple assets, including native STX and SIP-010 tokens such as sBTC and USDCx.

**Acceptance Criteria:**

- [x] Explicit STX transfers using `stx-transfer?` during donation submissions
- [x] SIP-010 token transfer support for sBTC/USDCx
- [x] Asset-type parameter added to record storage (e.g. `stx`, `sip010`)
- [x] Token contract trait verification before accepting SIP-010 transfers
- [x] Record storage updated to include asset type

---

## ❌ Pending Issues

### Issue #6: Security Audit & Verification

**Status:** ❌ PENDING

**Labels:** `smart-contracts`, `security`, `audit`

**Priority:** HIGH

**Description:**
Perform a comprehensive security review of the `stackscoop.clar` contract before mainnet deployment.

**Acceptance Criteria:**
- [ ] Verify RBAC (Role-Based Access Control) logic loops
- [ ] Check for potential reentrancy in record submissions (if any)
- [ ] Validate overflow/underflow protections (Clarity native)
- [ ] Ensure map data isolation between communities

---

### Issue #7: Mainnet Deployment

**Status:** ❌ PENDING

**Labels:** `smart-contracts`, `deployment`, `ops`

**Priority:** HIGH

**Description:**
Deploy the StacksCoop ledger contract to the Stacks Mainnet.

**Acceptance Criteria:**
- [ ] Generate Mainnet deployment plan
- [ ] Fund deployer wallet
- [ ] Execute deployment via Clarinet
- [ ] Verify contract on Stacks Explorer

---

### Issue #8: Gas Optimization

**Status:** ❌ PENDING

**Labels:** `smart-contracts`, `optimization`, `gas`

**Priority:** MEDIUM

**Description:**
Analyze and optimize contract execution cost.

**Acceptance Criteria:**
- [ ] Profile cost of `submit-record` (most frequent action)
- [ ] Optimize map lookups where possible
- [ ] Review data-var usage vs constants

---

### Issue #11: Admin-Configurable Token Preferences per Community
**Status:** ✅ COMPLETED
**Labels:** `smart-contracts`, `governance`, `security`, `defi`
**Priority:** HIGH

**Description:**
Allow authorized community admins to configure which supported tokens their community accepts for donations, spending, and project records.

**Acceptance Criteria:**
- [x] Maintain a global allowlist of supported tokens (protocol-level)
- [x] Only Contract Owner / Super Admin can manage protocol allowlist
- [x] Each community maintains its own list of enabled tokens
- [x] Only Community Admins can toggle community token preferences
- [x] `submit-record` / `submit-token-donation` verifies global and community status
- [x] Read-only helpers provided (`is-token-supported`, etc.)

---

## 📝 Issue Template

When creating new issues, use this template:

```markdown
### Issue #<number>: <Title>

**Status:** ❌ PENDING

**Labels:** `<label1>`, `<label2>`

**Priority:** HIGH | MEDIUM | LOW

**Description:**

<Detailed description of the issue>

**Acceptance Criteria:**

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Implementation Notes:**

- Technical details
- Code locations
- Dependencies
```

---

**Note:** When an issue is completed, move it to the "✅ Completed Issues" section and mark status as `✅ COMPLETED`.
