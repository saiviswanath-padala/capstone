@IsTest
private class CinemaPermitTriggerTest {

    private static Account createAccount() {

        Account account = new Account(
            Name = 'Smart Cinema Test Account'
        );

        insert account;

        return account;
    }


    private static Contact createContact(
        Id accountId
    ) {

        Contact contact = new Contact(
            FirstName = 'Test',
            LastName = 'Cinema Applicant',
            Email = 'test.cinema@example.com',
            AccountId = accountId
        );

        insert contact;

        return contact;
    }


    /*
     * Queries the existing Inspector user by role only,
     * consistent with how the handler resolves the fallback inspector.
     */
    private static User getInspectorUser() {

        return [
            SELECT Id
            FROM User
            WHERE IsActive = true
            AND UserRole.Name = 'Inspector'
            LIMIT 1
        ];
    }


    /*
     * Queries the Cinema Manager user to use as the permit owner
     * in tests, ensuring the Inspector is never the owner
     * (handler skips share creation if owner == inspector).
     */
    private static User getCinemaManagerUser() {

        return [
            SELECT Id
            FROM User
            WHERE IsActive = true
            AND UserRole.Name = 'Cinema Clerk'
            LIMIT 1
        ];
    }


    private static Permit_Application__c buildPermit(
        String status,
        Id accountId,
        Id contactId,
        Id inspectorId
    ) {

        return new Permit_Application__c(
            Status__c = status,
            Application_Category__c = 'New',
            Permit_Type__c = 'Cinema License',
            Cinema_Account__c = accountId,
            Applicant_Contact__c = contactId,
            Assigned_Inspector__c = inspectorId,
            Document_Checklist_Complete__c = true,
            Fee_Amount__c = 10000,
            Submission_Date__c = System.today()
        );
    }


    /*
     * Existing test: single permit inserted as Submitted.
     * No inspector assigned — handler falls back to role-based lookup.
     * Verifies record is saved correctly.
     */
    @IsTest
    static void testSubmittedPermit() {

        Account account = createAccount();
        Contact contact = createContact(account.Id);

        Permit_Application__c permit =
            new Permit_Application__c(
                Status__c = 'Submitted',
                Application_Category__c = 'New',
                Permit_Type__c = 'Cinema License',
                Cinema_Account__c = account.Id,
                Applicant_Contact__c = contact.Id,
                Document_Checklist_Complete__c = true,
                Fee_Amount__c = 10000,
                Submission_Date__c = System.today()
            );

        Test.startTest();
        insert permit;
        Test.stopTest();

        Permit_Application__c savedPermit = [
            SELECT Id, Status__c
            FROM Permit_Application__c
            WHERE Id = :permit.Id
        ];

        System.assertEquals(
            'Submitted',
            savedPermit.Status__c,
            'Permit should remain Submitted.'
        );
    }


    /*
     * Existing test: 50 permits inserted as Submitted.
     * Verifies bulk insert completes without governor limit errors.
     */
    @IsTest
    static void testBulkSubmittedPermits() {

        Account account = createAccount();
        Contact contact = createContact(account.Id);

        List<Permit_Application__c> permits =
            new List<Permit_Application__c>();

        for (Integer i = 0; i < 50; i++) {

            permits.add(
                new Permit_Application__c(
                    Status__c = 'Submitted',
                    Application_Category__c = 'New',
                    Permit_Type__c = 'Cinema License',
                    Cinema_Account__c = account.Id,
                    Applicant_Contact__c = contact.Id,
                    Document_Checklist_Complete__c = true,
                    Fee_Amount__c = 10000,
                    Submission_Date__c = System.today()
                )
            );
        }

        Test.startTest();
        insert permits;
        Test.stopTest();

        System.assertEquals(
            50,
            [
                SELECT COUNT()
                FROM Permit_Application__c
                WHERE Id IN :permits
            ],
            'All 50 permits should be inserted.'
        );
    }


    /*
     * Permit inserted as Submitted with Assigned_Inspector__c set.
     * Handler uses the assigned inspector directly (not role fallback).
     * Permit is owned by Cinema Manager so owner != inspector,
     * ensuring the share is not skipped.
     * Asserts 1 Manual share is created for the inspector.
     */
    @IsTest
    static void testShareCreatedOnInsertWithAssignedInspector() {

        User inspector = getInspectorUser();
        User cinemaManager = getCinemaManagerUser();

        Account account;
        Contact contact;
        Permit_Application__c permit;

        System.runAs(cinemaManager) {

            account = createAccount();
            contact = createContact(account.Id);
            permit = buildPermit('Submitted', account.Id, contact.Id, inspector.Id);

            Test.startTest();
            insert permit;
            Test.stopTest();
        }

        Integer shareCount = [
            SELECT COUNT()
            FROM Permit_Application__Share
            WHERE ParentId = :permit.Id
            AND UserOrGroupId = :inspector.Id
            AND RowCause = 'Manual'
        ];

        System.assertEquals(
            1,
            shareCount,
            'A share record should be created for the assigned inspector on insert.'
        );
    }


    /*
     * Permit inserted as Draft, then updated to Submitted.
     * Tests the becameSubmitted = true path on update.
     * Asserts 1 Manual share is created after the update.
     */
    @IsTest
    static void testShareCreatedOnUpdateStatusToSubmitted() {

        User inspector = getInspectorUser();
        User cinemaManager = getCinemaManagerUser();

        Account account;
        Contact contact;
        Permit_Application__c permit;

        System.runAs(cinemaManager) {

            account = createAccount();
            contact = createContact(account.Id);
            permit = buildPermit('Draft', account.Id, contact.Id, inspector.Id);
            insert permit;

            permit.Status__c = 'Submitted';

            Test.startTest();
            update permit;
            Test.stopTest();
        }

        Integer shareCount = [
            SELECT COUNT()
            FROM Permit_Application__Share
            WHERE ParentId = :permit.Id
            AND UserOrGroupId = :inspector.Id
            AND RowCause = 'Manual'
        ];

        System.assertEquals(
            1,
            shareCount,
            'A share record should be created when status changes to Submitted on update.'
        );
    }


    /*
     * Permit inserted as Submitted with no inspector.
     * Handler falls back to role-based inspector lookup.
     * Asserts 1 Manual share is created for the Inspector role user.
     */
    @IsTest
    static void testShareCreatedViaRoleFallbackWhenNoInspectorAssigned() {

        User inspector = getInspectorUser();
        User cinemaManager = getCinemaManagerUser();

        Account account;
        Contact contact;
        Permit_Application__c permit;

        System.runAs(cinemaManager) {

            account = createAccount();
            contact = createContact(account.Id);
            permit = buildPermit('Submitted', account.Id, contact.Id, null);

            Test.startTest();
            insert permit;
            Test.stopTest();
        }

        Integer shareCount = [
            SELECT COUNT()
            FROM Permit_Application__Share
            WHERE ParentId = :permit.Id
            AND UserOrGroupId = :inspector.Id
            AND RowCause = 'Manual'
        ];

        System.assertEquals(
            1,
            shareCount,
            'A share record should be created via role fallback when no inspector is assigned.'
        );
    }


    /*
     * Permit inserted as Submitted with no inspector assigned.
     * Then inspector is assigned via update.
     * Tests the inspectorChangedOnSubmitted = true path.
     * Asserts 1 Manual share is created after the update.
     */
    @IsTest
    static void testShareCreatedWhenInspectorAssignedAfterSubmitted() {

        User inspector = getInspectorUser();
        User cinemaManager = getCinemaManagerUser();

        Account account;
        Contact contact;
        Permit_Application__c permit;

        System.runAs(cinemaManager) {

            account = createAccount();
            contact = createContact(account.Id);
            permit = buildPermit('Submitted', account.Id, contact.Id, null);
            insert permit;

            permit.Assigned_Inspector__c = inspector.Id;

            Test.startTest();
            update permit;
            Test.stopTest();
        }

        Integer shareCount = [
            SELECT COUNT()
            FROM Permit_Application__Share
            WHERE ParentId = :permit.Id
            AND UserOrGroupId = :inspector.Id
            AND RowCause = 'Manual'
        ];

        System.assertEquals(
            1,
            shareCount,
            'A share record should be created when inspector is assigned to an already Submitted permit.'
        );
    }


    /*
     * Permit inserted as Submitted with inspector assigned (share created).
     * Then a non-status, non-inspector field is updated.
     * Handler should not re-process because status did not change to Submitted
     * and inspector did not change — both becameSubmitted and
     * inspectorChangedOnSubmitted will be false.
     * Asserts share count remains exactly 1 (no duplicates).
     */
    @IsTest
    static void testNoDuplicateSharesOnUnrelatedUpdate() {

        User inspector = getInspectorUser();
        User cinemaManager = getCinemaManagerUser();

        Account account;
        Contact contact;
        Permit_Application__c permit;

        System.runAs(cinemaManager) {

            account = createAccount();
            contact = createContact(account.Id);
            permit = buildPermit('Submitted', account.Id, contact.Id, inspector.Id);
            insert permit;

            permit.Fee_Amount__c = 20000;

            Test.startTest();
            update permit;
            Test.stopTest();
        }

        Integer shareCount = [
            SELECT COUNT()
            FROM Permit_Application__Share
            WHERE ParentId = :permit.Id
            AND UserOrGroupId = :inspector.Id
            AND RowCause = 'Manual'
        ];

        System.assertEquals(
            1,
            shareCount,
            'No duplicate share records should be created on an unrelated field update.'
        );
    }


    /*
     * Permit inserted as Draft with inspector assigned.
     * Neither becameSubmitted nor inspectorChangedOnSubmitted is true.
     * Asserts no share record is created.
     */
    @IsTest
    static void testNoShareWhenStatusNotSubmitted() {

        User inspector = getInspectorUser();
        User cinemaManager = getCinemaManagerUser();

        Account account;
        Contact contact;
        Permit_Application__c permit;

        System.runAs(cinemaManager) {

            account = createAccount();
            contact = createContact(account.Id);
            permit = buildPermit('Draft', account.Id, contact.Id, inspector.Id);

            Test.startTest();
            insert permit;
            Test.stopTest();
        }

        Integer shareCount = [
            SELECT COUNT()
            FROM Permit_Application__Share
            WHERE ParentId = :permit.Id
            AND UserOrGroupId = :inspector.Id
            AND RowCause = 'Manual'
        ];

        System.assertEquals(
            0,
            shareCount,
            'No share record should be created when status is not Submitted.'
        );
    }
}
