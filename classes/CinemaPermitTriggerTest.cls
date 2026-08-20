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


    @IsTest
    static void testSubmittedPermit() {

        Account account = createAccount();

        Contact contact =
            createContact(account.Id);

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
            SELECT
                Id,
                Status__c
            FROM Permit_Application__c
            WHERE Id = :permit.Id
        ];

        System.assertEquals(
            'Submitted',
            savedPermit.Status__c,
            'Permit should remain Submitted.'
        );
    }


    @IsTest
    static void testBulkSubmittedPermits() {

        Account account = createAccount();

        Contact contact =
            createContact(account.Id);

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
            'All permits should be inserted.'
        );
    }
}