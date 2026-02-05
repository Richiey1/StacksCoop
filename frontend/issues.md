# Frontend Issues

This file contains all GitHub issues for the StacksCoop Frontend.

## ✅ Completed Issues

### Issue #1: Project Setup & Infrastructure

**Status:** ✅ COMPLETED

**Labels:** `frontend`, `infrastructure`, `setup`

**Priority:** HIGH

**Description:**
Initialize Next.js project with Tailwind CSS, TypeScript, and Stacks blockchain dependencies.

---

### Issue #2: Wallet Integration

**Status:** ✅ COMPLETED

**Labels:** `frontend`, `wallet`, `web3`

**Priority:** HIGH

**Description:**
Implement wallet connection using Stacks Connect.

---

### Issue #3: Frontend Refactor (Game to Ledger)

**Status:** ✅ COMPLETED

**Labels:** `frontend`, `refactor`, `core`

**Priority:** CRITICAL

**Description:**
Convert the legacy "StacksTacToe" game frontend into the "StacksCoop" ledger frontend.

**Acceptance Criteria:**
- [x] Remove Game Board and Game logic components
- [x] Rename/Rewrite `useGameData` to `useCoopData`
- [x] Implement `RecordsList` component (replaces Games List)
- [x] Implement `CommunityDashboard` component
- [x] Update main page to display Ledger Dashboard

**Implementation Notes:**
- Game components deleted.
- `useCoopData.ts` now interfaces with `stackscoop.clar` functions (`get-community`, `get-record`).

---

### Issue #4: Record Submission UI

**Status:** ✅ COMPLETED

**Labels:** `frontend`, `feature`, `ui`

**Priority:** HIGH

**Description:**
Create a modal/form for users (contributors) to submit new Donation or Spending records.

**Acceptance Criteria:**
- [x] Create `SubmitRecordModal` component
- [x] Form fields: Type (Donation/Spending), Amount, Description
- [x] Connect to `submit-record` contract function
- [x] Handle transaction signing and status updates

---

## ❌ Pending Issues

### Issue #5: Community Creation UI

**Status:** ❌ PENDING

**Labels:** `frontend`, `feature`, `ui`

**Priority:** MEDIUM

**Description:**
Create a UI for users to create new Communities.

**Acceptance Criteria:**
- [ ] Create `CreateCommunityModal` component
- [ ] Form fields: Community Name
- [ ] Connect to `create-community` contract function

---

### Issue #6: Member Management UI

**Status:** ❌ PENDING

**Labels:** `frontend`, `feature`, `admin`

**Priority:** MEDIUM

**Description:**
Create an interface for Community Admins to manage members.

**Acceptance Criteria:**
- [ ] List current members (needs contract support or indexer)
- [ ] Add Member form (Address + Role)
- [ ] Remove Member button
- [ ] Update Role controls

---

### Issue #7: Mobile Responsiveness Polish

**Status:** ❌ PENDING

**Labels:** `frontend`, `ui`, `mobile`

**Priority:** MEDIUM

**Description:**
Ensure the new Ledger components (Dashboard, Records List) look good on mobile.

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
```
