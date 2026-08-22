import {
    LightningElement,
    api,
    wire
} from 'lwc';

import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

import {
    CurrentPageReference
} from 'lightning/navigation';

import {
    createRecord
} from 'lightning/uiRecordApi';

import getPermitTracker
    from '@salesforce/apex/CinemaPermitTrackerController.getPermitTracker';

import GRIEVANCE_OBJECT
    from '@salesforce/schema/Grievance__c';

import GRIEVANCE_PERMIT
    from '@salesforce/schema/Grievance__c.Permit_Application__c';

import GRIEVANCE_SUBJECT
    from '@salesforce/schema/Grievance__c.Subject__c';

import GRIEVANCE_DESCRIPTION
    from '@salesforce/schema/Grievance__c.Description__c';

import GRIEVANCE_SUBMITTED_DATE
    from '@salesforce/schema/Grievance__c.Submitted_Date__c';

import GRIEVANCE_STATUS
    from '@salesforce/schema/Grievance__c.Status__c';

export default class CinemaPermitTracker
    extends LightningElement {

    @api permitId;

    permit;

    errorMessage;

    isLoading = true;

    showGrievanceModal = false;

    grievanceSubject = '';

    grievanceDescription = '';

    isSubmitting = false;

    currentPageReference;


    acceptedFormats = [
        '.pdf',
        '.png',
        '.jpg',
        '.jpeg',
        '.doc',
        '.docx'
    ];


    @wire(CurrentPageReference)
    handlePageReference(pageReference) {

        this.currentPageReference =
            pageReference;

        this.loadPermit();
    }


    get effectivePermitId() {

        if (this.permitId) {
            return this.permitId;
        }

        const state =
            this.currentPageReference?.state;

        return (
            state?.c__permitId ||
            state?.recordId ||
            null
        );
    }


    loadPermit() {

        this.isLoading = true;
        this.errorMessage = undefined;

        getPermitTracker({
            permitId: this.effectivePermitId
        })
            .then(result => {

                this.permit = result;

                if (!result) {

                    this.errorMessage =
                        'No accessible Permit Application was found.';
                }
            })
            .catch(error => {

                this.permit = undefined;

                this.errorMessage =
                    this.reduceError(error);
            })
            .finally(() => {

                this.isLoading = false;
            });
    }


    get timelineStages() {

        const stages = [
            'Submitted',
            'Review',
            'Approved',
            'Issued'
        ];

        const currentStatus =
            this.permit?.status || '';

        let currentIndex =
            this.getStageIndex(currentStatus);

        const isRejected =
            this.isRejected;

        return stages.map(
            (stageName, index) => {

                const completed =
                    !isRejected &&
                    currentIndex >= index;

                const current =
                    !isRejected &&
                    currentIndex === index;

                let cssClass =
                    'timeline-stage';

                if (completed) {
                    cssClass +=
                        ' completed';
                }

                if (current) {
                    cssClass +=
                        ' current';
                }

                return {
                    name: stageName,
                    number: index + 1,
                    completed,
                    current,
                    cssClass
                };
            }
        );
    }


    getStageIndex(status) {

        if (!status) {
            return -1;
        }

        const normalized =
            status.toLowerCase();

        if (
            normalized === 'submitted'
        ) {
            return 0;
        }

        if (
            normalized === 'review' ||
            normalized === 'under review' ||
            normalized === 'in review'
        ) {
            return 1;
        }

        if (
            normalized === 'approved'
        ) {
            return 2;
        }

        if (
            normalized === 'issued'
        ) {
            return 3;
        }

        return -1;
    }


    get isRejected() {

        const status =
            this.permit?.status;

        return (
            status &&
            status.toLowerCase() ===
            'rejected'
        );
    }


    get statusBadgeClass() {

        if (this.isRejected) {
            return 'status-badge rejected';
        }

        const status =
            this.permit?.status || '';

        if (
            status.toLowerCase() ===
            'approved'
        ) {
            return 'status-badge approved';
        }

        if (
            status.toLowerCase() ===
            'issued'
        ) {
            return 'status-badge issued';
        }

        return 'status-badge progress';
    }


    get hasGrievances() {

        return (
            this.permit &&
            this.permit.grievances &&
            this.permit.grievances.length > 0
        );
    }


    openGrievanceModal() {

        this.grievanceSubject = '';

        this.grievanceDescription = '';

        this.showGrievanceModal = true;
    }


    closeGrievanceModal() {

        if (this.isSubmitting) {
            return;
        }

        this.showGrievanceModal = false;
    }


    handleGrievanceInput(event) {

        const field =
            event.target.name;

        if (field === 'subject') {
            this.grievanceSubject =
                event.target.value;
        }

        if (field === 'description') {
            this.grievanceDescription =
                event.target.value;
        }
    }


    async submitGrievance() {

        if (
            !this.grievanceSubject ||
            !this.grievanceDescription
        ) {

            this.showToast(
                'Missing Information',
                'Please enter both Subject and Description.',
                'warning'
            );

            return;
        }

        this.isSubmitting = true;

        const fields = {};

        fields[GRIEVANCE_PERMIT.fieldApiName] =
            this.permit.permitId;

        fields[GRIEVANCE_SUBJECT.fieldApiName] =
            this.grievanceSubject;

        fields[GRIEVANCE_DESCRIPTION.fieldApiName] =
            this.grievanceDescription;

        fields[GRIEVANCE_SUBMITTED_DATE.fieldApiName] =
            this.today();

        fields[GRIEVANCE_STATUS.fieldApiName] = 'New';

        try {

            const recordInput = {
                apiName:
                    GRIEVANCE_OBJECT.objectApiName,
                fields
            };

            await createRecord(recordInput);

            this.showToast(
                'Grievance Submitted',
                'Your grievance has been submitted successfully.',
                'success'
            );

            this.showGrievanceModal = false;

            this.grievanceSubject = '';

            this.grievanceDescription = '';

            this.loadPermit();

        } catch (error) {

            this.showToast(
                'Unable to Submit Grievance',
                this.reduceError(error),
                'error'
            );

        } finally {

            this.isSubmitting = false;
        }
    }


    today() {

        return new Date()
            .toISOString()
            .split('T')[0];
    }


    showToast(
        title,
        message,
        variant
    ) {

        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }


    reduceError(error) {

        if (!error) {
            return 'Unknown error.';
        }

        if (Array.isArray(error.body)) {

            return error.body
                .map(item => item.message)
                .join(', ');
        }

        if (error.body?.message) {
            return error.body.message;
        }

        if (error.message) {
            return error.message;
        }

        return 'An unexpected error occurred.';
    }
}