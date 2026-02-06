import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const user1 = accounts.get('wallet_1')!;
const user2 = accounts.get('wallet_2')!;

describe('StacksCoop - Community Management', () => {
  it('should create a new community', () => {
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Test Community')],
      deployer
    );
    
    expect(result).toBeOk(Cl.uint(1));
  });

  it('should not allow duplicate community names', () => {
    // Create first community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Duplicate Test')],
      deployer
    );

    // Try to create duplicate
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Duplicate Test')],
      user1
    );
    
    expect(result).toBeErr(Cl.uint(104)); // ERR_ALREADY_EXISTS
  });

  it('should allow admin to add members', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Member Test Community')],
      deployer
    );

    // Add member
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'add-member',
      [
        Cl.uint(1),
        Cl.principal(user1),
        Cl.stringAscii('contributor')
      ],
      deployer
    );
    
    expect(result).toBeOk(Cl.bool(true));
  });

  it('should not allow non-admin to add members', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Admin Test Community')],
      deployer
    );

    // Try to add member as non-admin
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'add-member',
      [
        Cl.uint(1),
        Cl.principal(user2),
        Cl.stringAscii('contributor')
      ],
      user1
    );
    
    expect(result).toBeErr(Cl.uint(105)); // ERR_NOT_ADMIN
  });

  it('should allow admin to update member roles', () => {
    // Create community and add member
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Role Test Community')],
      deployer
    );
    
    simnet.callPublicFn(
      'stackscoop',
      'add-member',
      [
        Cl.uint(1),
        Cl.principal(user1),
        Cl.stringAscii('viewer')
      ],
      deployer
    );

    // Update role
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'update-member-role',
      [
        Cl.uint(1),
        Cl.principal(user1),
        Cl.stringAscii('contributor')
      ],
      deployer
    );
    
    expect(result).toBeOk(Cl.bool(true));
  });

  it('should allow admin to add members in batch', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Batch Test Community')],
      deployer
    );

    // Batch add members
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'add-members-batch',
      [
        Cl.uint(1),
        Cl.list([
          Cl.tuple({ member: Cl.principal(user1), role: Cl.stringAscii('contributor') }),
          Cl.tuple({ member: Cl.principal(user2), role: Cl.stringAscii('viewer') })
        ])
      ],
      deployer
    );
    
    expect(result).toBeOk(Cl.uint(2));

    // Verify member count
    const communityRes = simnet.callReadOnlyFn(
      'stackscoop',
      'get-community',
      [Cl.uint(1)],
      deployer
    );
    const communityData: any = communityRes.result;
    expect(communityData.value.value['member-count']).toEqual(Cl.uint(3)); // 1 (creator) + 2 (added)
  });
});

describe('StacksCoop - Record Management', () => {
  it('should allow contributors to submit donation records', () => {
    // Create community and add contributor
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Donation Community')],
      deployer
    );
    
    simnet.callPublicFn(
      'stackscoop',
      'add-member',
      [
        Cl.uint(1),
        Cl.principal(user1),
        Cl.stringAscii('contributor')
      ],
      deployer
    );

    // Submit donation record
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('donation'),
        Cl.uint(100000000), // 100 STX in micro-STX
        Cl.stringUtf8('Community fundraiser donation'),
        Cl.none()
      ],
      user1
    );
    
    expect(result).toBeOk(Cl.uint(1));

    // Verify status is pending (0)
    const recordRes = simnet.callReadOnlyFn(
      'stackscoop',
      'get-record',
      [Cl.uint(1)],
      deployer
    );
    const recordData: any = recordRes.result;
    expect(recordData.value.value['status']).toEqual(Cl.uint(0));
  });

  it('should allow admin to verify records and update totals', () => {
    // Create community and submit record
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Verification Community')],
      deployer
    );
    
    simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('donation'),
        Cl.uint(100000000),
        Cl.stringUtf8('Community donation'),
        Cl.none()
      ],
      deployer
    );

    // Check total donations is still 0 (pending)
    const donationsBefore = simnet.callReadOnlyFn(
      'stackscoop',
      'get-total-donations',
      [Cl.uint(1)],
      deployer
    );
    expect(donationsBefore.result).toBeOk(Cl.uint(0));

    // Verify record
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'verify-record',
      [Cl.uint(1)],
      deployer
    );
    
    expect(result).toBeOk(Cl.bool(true));

    // Check total donations updated
    const donationsAfter = simnet.callReadOnlyFn(
      'stackscoop',
      'get-total-donations',
      [Cl.uint(1)],
      deployer
    );
    expect(donationsAfter.result).toBeOk(Cl.uint(100000000));
  });

  it('should allow contributors to submit spending records', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Spending Community')],
      deployer
    );

    // Submit spending record as admin (auto-contributor)
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('spending'),
        Cl.uint(50000000), // 50 STX in micro-STX
        Cl.stringUtf8('Road repair project expense'),
        Cl.none()
      ],
      deployer
    );
    
    expect(result).toBeOk(Cl.uint(1));
  });

  it('should not allow viewers to submit records', () => {
    // Create community and add viewer
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Viewer Test Community')],
      deployer
    );
    
    simnet.callPublicFn(
      'stackscoop',
      'add-member',
      [
        Cl.uint(1),
        Cl.principal(user1),
        Cl.stringAscii('viewer')
      ],
      deployer
    );

    // Try to submit record as viewer
    const { result } = simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('donation'),
        Cl.uint(10000000),
        Cl.stringUtf8('Test donation'),
        Cl.none()
      ],
      user1
    );
    
    expect(result).toBeErr(Cl.uint(100)); // ERR_UNAUTHORIZED
  });

  it('should update community totals correctly', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Totals Test Community')],
      deployer
    );

    // Submit donation
    simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('donation'),
        Cl.uint(100000000),
        Cl.stringUtf8('Donation 1'),
        Cl.none()
      ],
      deployer
    );

    // Verify donation
    simnet.callPublicFn(
      'stackscoop',
      'verify-record',
      [Cl.uint(1)],
      deployer
    );

    // Submit spending
    simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('spending'),
        Cl.uint(50000000),
        Cl.stringUtf8('Spending 1'),
        Cl.none()
      ],
      deployer
    );

    // Verify spending
    simnet.callPublicFn(
      'stackscoop',
      'verify-record',
      [Cl.uint(2)],
      deployer
    );

    // Check totals
    const donations = simnet.callReadOnlyFn(
      'stackscoop',
      'get-total-donations',
      [Cl.uint(1)],
      deployer
    );
    
    const spending = simnet.callReadOnlyFn(
      'stackscoop',
      'get-total-spending',
      [Cl.uint(1)],
      deployer
    );
    
    expect(donations.result).toBeOk(Cl.uint(100000000));
    expect(spending.result).toBeOk(Cl.uint(50000000));
  });
});

describe('StacksCoop - Read-Only Functions', () => {
  it('should retrieve community details', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Read Test Community')],
      deployer
    );

    // Get community
    const { result } = simnet.callReadOnlyFn(
      'stackscoop',
      'get-community',
      [Cl.uint(1)],
      deployer
    );
    
    expect(result).toBeDefined();
  });

  it('should check if user is admin', () => {
    // Create community
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Admin Check Community')],
      deployer
    );

    // Check admin status
    const { result } = simnet.callReadOnlyFn(
      'stackscoop',
      'is-admin',
      [Cl.uint(1), Cl.principal(deployer)],
      deployer
    );
    
    expect(result).toBeOk(Cl.bool(true));
  });

  it('should retrieve record details', () => {
    // Create community and submit record
    simnet.callPublicFn(
      'stackscoop',
      'create-community',
      [Cl.stringUtf8('Record Read Community')],
      deployer
    );
    
    simnet.callPublicFn(
      'stackscoop',
      'submit-record',
      [
        Cl.uint(1),
        Cl.stringAscii('donation'),
        Cl.uint(25000000),
        Cl.stringUtf8('Test donation for read'),
        Cl.none()
      ],
      deployer
    );

    // Get record
    const { result } = simnet.callReadOnlyFn(
      'stackscoop',
      'get-record',
      [Cl.uint(1)],
      deployer
    );
    
    expect(result).toBeDefined();
  });
});
