;; StacksCoop - Bitcoin-Anchored Community Transparency Ledger
;; A decentralized ledger for community organizations to record donations, spending, and project transactions
;; Built on Stacks blockchain for permanent Bitcoin anchoring

;; ============================================
;; Constants
;; ============================================

;; Contract owner
(define-constant CONTRACT_OWNER tx-sender)

;; Record types
(define-constant RECORD_TYPE_DONATION "donation")
(define-constant RECORD_TYPE_SPENDING "spending")
(define-constant RECORD_TYPE_PROJECT "project")
(define-constant RECORD_TYPE_GRANT "grant")

;; Member roles
(define-constant ROLE_ADMIN "admin")
(define-constant ROLE_CONTRIBUTOR "contributor")
(define-constant ROLE_VIEWER "viewer")

;; Record status
(define-constant STATUS_PENDING u0)
(define-constant STATUS_VERIFIED u1)
(define-constant STATUS_REJECTED u2)

;; Community status
(define-constant COMMUNITY_ACTIVE u1)
(define-constant COMMUNITY_INACTIVE u0)

;; ============================================
;; Error Codes
;; ============================================

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_FOUND (err u101))
(define-constant ERR_INVALID_AMOUNT (err u102))
(define-constant ERR_INVALID_ROLE (err u103))
(define-constant ERR_ALREADY_EXISTS (err u104))
(define-constant ERR_NOT_ADMIN (err u105))
(define-constant ERR_COMMUNITY_INACTIVE (err u106))
(define-constant ERR_INVALID_RECORD_TYPE (err u107))
(define-constant ERR_EMPTY_DESCRIPTION (err u108))
(define-constant ERR_INVALID_STATUS (err u109))
(define-constant ERR_INVALID_NAME (err u110))


;; ============================================
;; Data Variables
;; ============================================

;; Counters
(define-data-var community-id-counter uint u0)
(define-data-var record-id-counter uint u0)

;; ============================================
;; Data Maps
;; ============================================

;; Community data
(define-map communities
    uint
    {
        name: (string-utf8 100),
        admin: principal,
        created-at: uint,
        status: uint,
        total-donations: uint,
        total-spending: uint,
        member-count: uint
    }
)

;; Members: (community-id, member-address) => member data
(define-map members
    { community-id: uint, member: principal }
    {
        role: (string-ascii 20),
        joined-at: uint,
        active: bool
    }
)

;; Records: record-id => record data
(define-map records
    uint
    {
        community-id: uint,
        record-type: (string-ascii 20),
        amount: uint,
        description: (string-utf8 256),
        submitter: principal,
        timestamp: uint,
        status: uint,
        verified-by: (optional principal),
        project-id: (optional uint)
    }
)

;; Community name registry (for uniqueness)
(define-map community-names (string-utf8 100) uint)

;; ============================================
;; Initialization
;; ============================================

;; Set contract owner as default admin
(map-set members 
    { community-id: u0, member: CONTRACT_OWNER }
    { role: ROLE_ADMIN, joined-at: u0, active: true }
)

;; ============================================
;; Private Helper Functions
;; ============================================

;; Check if caller is admin of a community
(define-private (is-community-admin (community-id uint) (caller principal))
    (let ((member-data (map-get? members { community-id: community-id, member: caller })))
        (match member-data
            member (and (is-eq (get role member) ROLE_ADMIN) (get active member))
            false
        )
    )
)

;; Check if caller is a member of a community
(define-private (is-community-member (community-id uint) (caller principal))
    (let ((member-data (map-get? members { community-id: community-id, member: caller })))
        (match member-data
            member (get active member)
            false
        )
    )
)

;; Check if caller can submit records (admin or contributor)
(define-private (can-submit-record (community-id uint) (caller principal))
    (let ((member-data (map-get? members { community-id: community-id, member: caller })))
        (match member-data
            member (and 
                (get active member)
                (or 
                    (is-eq (get role member) ROLE_ADMIN)
                    (is-eq (get role member) ROLE_CONTRIBUTOR)
                )
            )
            false
        )
    )
)

;; Validate record type
(define-private (is-valid-record-type (record-type (string-ascii 20)))
    (or
        (is-eq record-type RECORD_TYPE_DONATION)
        (is-eq record-type RECORD_TYPE_SPENDING)
        (is-eq record-type RECORD_TYPE_PROJECT)
        (is-eq record-type RECORD_TYPE_GRANT)
    )
)

;; ============================================
;; Public Functions - Community Management
;; ============================================

;; Create a new community
(define-public (create-community (name (string-utf8 100)))
    (let
        (
            (new-id (+ (var-get community-id-counter) u1))
            (existing-id (map-get? community-names name))
        )
        ;; Check name length
        (asserts! (> (len name) u0) ERR_INVALID_NAME)

        ;; Check if name already exists
        (asserts! (is-none existing-id) ERR_ALREADY_EXISTS)
        
        ;; Create community
        (map-set communities new-id {
            name: name,
            admin: tx-sender,
            created-at: stacks-block-height,
            status: COMMUNITY_ACTIVE,
            total-donations: u0,
            total-spending: u0,
            member-count: u1
        })
        
        ;; Add creator as admin member
        (map-set members 
            { community-id: new-id, member: tx-sender }
            { role: ROLE_ADMIN, joined-at: stacks-block-height, active: true }
        )
        
        ;; Register community name
        (map-set community-names name new-id)
        
        ;; Update counter
        (var-set community-id-counter new-id)
        
        (ok new-id)
    )
)

;; Add a member to a community
(define-public (add-member (community-id uint) (member principal) (role (string-ascii 20)))
    (let
        (
            (community (unwrap! (map-get? communities community-id) ERR_NOT_FOUND))
            (existing-member (map-get? members { community-id: community-id, member: member }))
        )
        ;; Only admin can add members
        (asserts! (is-community-admin community-id tx-sender) ERR_NOT_ADMIN)
        
        ;; Community must be active
        (asserts! (is-eq (get status community) COMMUNITY_ACTIVE) ERR_COMMUNITY_INACTIVE)
        
        ;; Member must not already exist
        (asserts! (is-none existing-member) ERR_ALREADY_EXISTS)
        
        ;; Validate role
        (asserts! (or 
            (is-eq role ROLE_ADMIN)
            (is-eq role ROLE_CONTRIBUTOR)
            (is-eq role ROLE_VIEWER)
        ) ERR_INVALID_ROLE)
        
        ;; Add member
        (map-set members 
            { community-id: community-id, member: member }
            { role: role, joined-at: stacks-block-height, active: true }
        )
        
        ;; Update member count
        (map-set communities community-id 
            (merge community { member-count: (+ (get member-count community) u1) })
        )
        
        (ok true)
    )
)

;; Remove a member from a community
(define-public (remove-member (community-id uint) (member principal))
    (let
        (
            (community (unwrap! (map-get? communities community-id) ERR_NOT_FOUND))
            (member-data (unwrap! (map-get? members { community-id: community-id, member: member }) ERR_NOT_FOUND))
        )
        ;; Only admin can remove members
        (asserts! (is-community-admin community-id tx-sender) ERR_NOT_ADMIN)
        
        ;; Cannot remove yourself
        (asserts! (not (is-eq member tx-sender)) ERR_UNAUTHORIZED)
        
        ;; Deactivate member
        (map-set members 
            { community-id: community-id, member: member }
            (merge member-data { active: false })
        )
        
        ;; Update member count
        (map-set communities community-id 
            (merge community { member-count: (- (get member-count community) u1) })
        )
        
        (ok true)
    )
)

;; Update member role
(define-public (update-member-role (community-id uint) (member principal) (new-role (string-ascii 20)))
    (let
        (
            (member-data (unwrap! (map-get? members { community-id: community-id, member: member }) ERR_NOT_FOUND))
        )
        ;; Only admin can update roles
        (asserts! (is-community-admin community-id tx-sender) ERR_NOT_ADMIN)
        
        ;; Validate role
        (asserts! (or 
            (is-eq new-role ROLE_ADMIN)
            (is-eq new-role ROLE_CONTRIBUTOR)
            (is-eq new-role ROLE_VIEWER)
        ) ERR_INVALID_ROLE)
        
        ;; Cannot update your own role
        (asserts! (not (is-eq member tx-sender)) ERR_UNAUTHORIZED)
        
        ;; Update role
        (map-set members 
            { community-id: community-id, member: member }
            (merge member-data { role: new-role })
        )
        
        (ok true)
    )
)

;; ============================================
;; Public Functions - Record Management
;; ============================================

;; Submit a new record
(define-public (submit-record 
    (community-id uint) 
    (record-type (string-ascii 20))
    (amount uint)
    (description (string-utf8 256))
    (project-id (optional uint))
)
    (let
        (
            (community (unwrap! (map-get? communities community-id) ERR_NOT_FOUND))
            (new-record-id (+ (var-get record-id-counter) u1))
        )
        ;; Community must be active
        (asserts! (is-eq (get status community) COMMUNITY_ACTIVE) ERR_COMMUNITY_INACTIVE)
        
        ;; Caller must be able to submit records
        (asserts! (can-submit-record community-id tx-sender) ERR_UNAUTHORIZED)
        
        ;; Validate record type
        (asserts! (is-valid-record-type record-type) ERR_INVALID_RECORD_TYPE)
        
        ;; Validate amount
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        
        ;; Validate description
        (asserts! (> (len description) u0) ERR_EMPTY_DESCRIPTION)
        
        ;; Create record
        (map-set records new-record-id {
            community-id: community-id,
            record-type: record-type,
            amount: amount,
            description: description,
            submitter: tx-sender,
            timestamp: stacks-block-height,
            status: STATUS_VERIFIED, ;; Auto-verified for now
            verified-by: (some tx-sender),
            project-id: project-id
        })
        
        ;; Update community totals
        (if (is-eq record-type RECORD_TYPE_DONATION)
            (map-set communities community-id 
                (merge community { total-donations: (+ (get total-donations community) amount) })
            )
            (if (is-eq record-type RECORD_TYPE_SPENDING)
                (map-set communities community-id 
                    (merge community { total-spending: (+ (get total-spending community) amount) })
                )
                true ;; Other record types don't affect totals
            )
        )
        
        ;; Update counter
        (var-set record-id-counter new-record-id)
        
        (ok new-record-id)
    )
)

;; Verify a record (admin only)
(define-public (verify-record (record-id uint))
    (let
        (
            (record (unwrap! (map-get? records record-id) ERR_NOT_FOUND))
        )
        ;; Only admin can verify
        (asserts! (is-community-admin (get community-id record) tx-sender) ERR_NOT_ADMIN)
        
        ;; Record must be pending
        (asserts! (is-eq (get status record) STATUS_PENDING) ERR_INVALID_STATUS)
        
        ;; Verify record
        (map-set records record-id 
            (merge record { 
                status: STATUS_VERIFIED,
                verified-by: (some tx-sender)
            })
        )
        
        (ok true)
    )
)

;; ============================================
;; Read-Only Functions
;; ============================================

;; Get community details
(define-read-only (get-community (community-id uint))
    (map-get? communities community-id)
)

;; Get member details
(define-read-only (get-member (community-id uint) (member principal))
    (map-get? members { community-id: community-id, member: member })
)

;; Get record details
(define-read-only (get-record (record-id uint))
    (map-get? records record-id)
)

;; Get total donations for a community
(define-read-only (get-total-donations (community-id uint))
    (match (map-get? communities community-id)
        community (ok (get total-donations community))
        ERR_NOT_FOUND
    )
)

;; Get total spending for a community
(define-read-only (get-total-spending (community-id uint))
    (match (map-get? communities community-id)
        community (ok (get total-spending community))
        ERR_NOT_FOUND
    )
)

;; Check if user is admin of community
(define-read-only (is-admin (community-id uint) (user principal))
    (ok (is-community-admin community-id user))
)

;; Check if user is member of community
(define-read-only (is-member (community-id uint) (user principal))
    (ok (is-community-member community-id user))
)

;; Get community ID by name
(define-read-only (get-community-by-name (name (string-utf8 100)))
    (map-get? community-names name)
)

;; Get current record counter
(define-read-only (get-record-counter)
    (ok (var-get record-id-counter))
)

;; Get current community counter
(define-read-only (get-community-counter)
    (ok (var-get community-id-counter))
)
