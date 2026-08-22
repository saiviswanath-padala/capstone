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

import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';

import {
    getPicklistValues
} from 'lightning/uiObjectInfoApi';

import getDashboard
    from '@salesforce/apex/CinemaSubsidyDashboardController.getDashboard';


import SUBSIDY_OBJECT
    from '@salesforce/schema/Subsidy_Assignment__c';

import SUBSIDY_PERMIT
    from '@salesforce/schema/Subsidy_Assignment__c.Permit_Application__c';

import SUBSIDY_CATEGORY
    from '@salesforce/schema/Subsidy_Assignment__c.Category__c';

import SUBSIDY_REQUEST_TYPE
    from '@salesforce/schema/Subsidy_Assignment__c.Request_Type__c';

import SUBSIDY_AMOUNT
    from '@salesforce/schema/Subsidy_Assignment__c.Requested_Amount__c';

import SUBSIDY_DATE
    from '@salesforce/schema/Subsidy_Assignment__c.Requested_Date__c';

import SUBSIDY_NOTES
    from '@salesforce/schema/Subsidy_Assignment__c.Notes__c';

import SUBSIDY_STATUS
    from '@salesforce/schema/Subsidy_Assignment__c.Status__c';

import SUBSIDY_ELIGIBILITY
    from '@salesforce/schema/Subsidy_Assignment__c.Eligibility_Status__c';


export default class CinemaSubsidyDashboard
    extends LightningElement {

    @api permitId;

    subsidies = [];

    permits = [];

    errorMessage;

    isLoading = true;

    showRequestModal = false;

    isSubmitting = false;

    currentPageReference;


    requestPermitId = '';

    requestCategory = '';

    requestType = '';

    requestAmount;

    requestDate;

    requestNotes = '';


    categoryOptions = [];

    requestTypeOptions = [];

    statusOptions = [];

    eligibilityOptions = [];


    @wire(CurrentPageReference)
    handlePageReference(pageReference) {

        this.currentPageReference =
            pageReference;

        this.loadDashboard();
    }


    @wire(getObjectInfo, {
        objectApiName: SUBSIDY_OBJECT
    })
    subsidyObjectInfo;


    @wire(getPicklistValues, {
        recordTypeId:
            '$subsidyObjectInfo.data.defaultRecordTypeId',
        fieldApiName: SUBSIDY_CATEGORY
    })
    categoryPicklist({
        data,
        error
    }) {

        if (data) {

            this.categoryOptions =
                data.values.map(
                    item => ({
                        label: item.label,
                        value: item.value
                    })
                );
        }

        if (error) {
            console.error(error);
        }
    }


    @wire(getPicklistValues, {
        recordTypeId:
            '$subsidyObjectInfo.data.defaultRecordTypeId',
        fieldApiName: SUBSIDY_REQUEST_TYPE
    })
    requestTypePicklist({
        data,
        error
    }) {

        if (data) {

            this.requestTypeOptions =
                data.values.map(
                    item => ({
                        label: item.label,
                        value: item.value
                    })
                );
        }

        if (error) {
            console.error(error);
        }
    }


    @wire(getPicklistValues, {
        recordTypeId:
            '$subsidyObjectInfo.data.defaultRecordTypeId',
        fieldApiName: SUBSIDY_STATUS
    })
    statusPicklist({
        data,
        error
    }) {

        if (data) {

            this.statusOptions =
                data.values.map(
                    item => ({
                        label: item.label,
                        value: item.value
                    })
                );
        }

        if (error) {
            console.error(error);
        }
    }


    @wire(getPicklistValues, {
        recordTypeId:
            '$subsidyObjectInfo.data.defaultRecordTypeId',
        fieldApiName: SUBSIDY_ELIGIBILITY
    })
    eligibilityPicklist({
        data,
        error
    }) {

        if (data) {

            this.eligibilityOptions =
                data.values.map(
                    item => ({
                        label: item.label,
                        value: item.value
                    })
                );
        }

        if (error) {
            console.error(error);
        }
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


    loadDashboard() {

        this.isLoading = true;

        this.errorMessage = undefined;

        getDashboard({
            permitId: this.effectivePermitId
        })
            .then(result => {

                this.subsidies =
                    result?.subsidies || [];

                this.permits =
                    result?.permits || [];

            })
            .catch(error => {

                this.subsidies = [];

                this.permits = [];

                this.errorMessage =
                    this.reduceError(error);
            })
            .finally(() => {

                this.isLoading = false;
            });
    }


    get permitOptions() {

        return this.permits.map(
            permit => ({
                label: permit.label,
                value: permit.id
            })
        );
    }


    get totalSubsidies() {

        return this.subsidies.length;
    }


    get pendingCount() {

        return this.subsidies.filter(
            subsidy =>
                this.isPendingStatus(
                    subsidy.status
                )
        ).length;
    }


    get approvedCount() {

        return this.subsidies.filter(
            subsidy =>
                subsidy.status &&
                subsidy.status.toLowerCase()
                    .includes('approved')
        ).length;
    }


    get commissionerReviewCount() {

        return this.subsidies.filter(
            subsidy =>
                subsidy.commissionerNotificationRequired
        ).length;
    }


    get categoryGroups() {

        const groups = {};

        this.subsidies.forEach(
            subsidy => {

                const category =
                    subsidy.category ||
                    'Uncategorized';

                if (!groups[category]) {

                    groups[category] = [];
                }

                groups[category].push({
                    ...subsidy,
                    statusClass:
                        this.getStatusClass(
                            subsidy.status
                        )
                });
            }
        );

        return Object.keys(groups)
            .sort()
            .map(category => ({
                category,
                count: groups[category].length,
                records: groups[category]
            }));
    }


    get hasGroups() {

        return this.categoryGroups.length > 0;
    }


    isPendingStatus(status) {

        if (!status) {
            return true;
        }

        const value =
            status.toLowerCase();

        return (
            value.includes('pending') ||
            value.includes('requested') ||
            value.includes('review')
        );
    }


    getStatusClass(status) {

        if (!status) {
            return 'status-pill pending';
        }

        const value =
            status.toLowerCase();

        if (
            value.includes('approved')
        ) {
            return 'status-pill approved';
        }

        if (
            value.includes('rejected') ||
            value.includes('denied')
        ) {
            return 'status-pill rejected';
        }

        if (
            value.includes('review') ||
            value.includes('pending') ||
            value.includes('requested')
        ) {
            return 'status-pill pending';
        }

        return 'status-pill';
    }


    openRequestModal() {

        this.resetRequestForm();

        const selectedPermit =
            this.effectivePermitId;

        if (selectedPermit) {
            this.requestPermitId =
                selectedPermit;
        }

        this.showRequestModal = true;
    }


    closeRequestModal() {

        if (this.isSubmitting) {
            return;
        }

        this.showRequestModal = false;
    }


    resetRequestForm() {

        this.requestPermitId = '';

        this.requestCategory = '';

        this.requestType = '';

        this.requestAmount = null;

        this.requestDate =
            this.today();

        this.requestNotes = '';
    }


    handleRequestInput(event) {

        const field =
            event.target.name;

        const value =
            event.target.value;

        switch (field) {

            case 'permit':
                this.requestPermitId = value;
                break;

            case 'category':
                this.requestCategory = value;
                break;

            case 'requestType':
                this.requestType = value;
                break;

            case 'amount':
                this.requestAmount = value;
                break;

            case 'requestedDate':
                this.requestDate = value;
                break;

            case 'notes':
                this.requestNotes = value;
                break;

            default:
                break;
        }
    }


    async submitSubsidy() {

        if (
            !this.requestPermitId ||
            !this.requestCategory ||
            !this.requestType ||
            !this.requestAmount ||
            !this.requestDate
        ) {

            this.showToast(
                'Missing Information',
                'Please complete all required subsidy fields.',
                'warning'
            );

            return;
        }


        if (
            Number(this.requestAmount) <= 0
        ) {

            this.showToast(
                'Invalid Amount',
                'Requested amount must be greater than zero.',
                'warning'
            );

            return;
        }


        this.isSubmitting = true;


        const fields = {};

        fields[
            SUBSIDY_PERMIT.fieldApiName
        ] =
            this.requestPermitId;

        fields[
            SUBSIDY_CATEGORY.fieldApiName
        ] =
            this.requestCategory;

        fields[
            SUBSIDY_REQUEST_TYPE.fieldApiName
        ] =
            this.requestType;

        fields[
            SUBSIDY_AMOUNT.fieldApiName
        ] =
            Number(this.requestAmount);

        fields[
            SUBSIDY_DATE.fieldApiName
        ] =
            this.requestDate;

        fields[
            SUBSIDY_NOTES.fieldApiName
        ] =
            this.requestNotes;


        /*
         * Automatically choose Requested if that
         * value exists in the org.
         */
        const requestedStatus =
            this.findPicklistValue(
                this.statusOptions,
                'Requested'
            );

        if (requestedStatus) {

            fields[
                SUBSIDY_STATUS.fieldApiName
            ] =
                requestedStatus;
        }


        /*
         * Automatically choose Pending if available.
         */
        const pendingEligibility =
            this.findPicklistValue(
                this.eligibilityOptions,
                'Pending'
            );

        if (pendingEligibility) {

            fields[
                SUBSIDY_ELIGIBILITY.fieldApiName
            ] =
                pendingEligibility;
        }


        try {

            const recordInput = {
                apiName:
                    SUBSIDY_OBJECT.objectApiName,
                fields
            };

            await createRecord(recordInput);


            this.showToast(
                'Subsidy Request Submitted',
                'The subsidy request was created successfully.',
                'success'
            );


            this.showRequestModal = false;

            this.resetRequestForm();

            this.loadDashboard();


        } catch (error) {

            this.showToast(
                'Unable to Create Subsidy',
                this.reduceError(error),
                'error'
            );

        } finally {

            this.isSubmitting = false;
        }
    }


    findPicklistValue(
        options,
        desiredValue
    ) {

        if (!options || !options.length) {
            return null;
        }

        const exact =
            options.find(
                option =>
                    option.value === desiredValue
            );

        if (exact) {
            return exact.value;
        }

        const caseInsensitive =
            options.find(
                option =>
                    option.value.toLowerCase() ===
                    desiredValue.toLowerCase()
            );

        if (caseInsensitive) {
            return caseInsensitive.value;
        }

        return null;
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