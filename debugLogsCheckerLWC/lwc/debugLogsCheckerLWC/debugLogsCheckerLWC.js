import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi'; //new
import getApexLogs from '@salesforce/apex/DebugLogsChecker.getApexLogs';
import deleteApexLogs from '@salesforce/apex/DebugLogsChecker.deleteApexLogs'; //new
const columns = [
{ label: 'View', fieldName: 'Id', type: 'button', wrapText: true, typeAttributes: { label: { fieldName: 'Id' }, variant: 'base',iconName: 'utility:apex' } },
{ label: 'Request', fieldName: 'Request', type: 'text', wrapText: true, sortable: false },
{ label: 'Application', fieldName: 'Application', type: 'text', wrapText: true, sortable: false },
{ label: 'Operation', fieldName: 'Operation', type: 'text', wrapText: true, sortable: false },
{ label: 'Status', fieldName: 'Status', type: 'text', wrapText: true, sortable: false },
{ label: 'Duration Milliseconds', fieldName: 'DurationMilliseconds', type: 'text', wrapText: true, sortable: false },
{ label: 'Log Length', fieldName: 'LogLength', type: 'text', wrapText: true, sortable: false },
{ label: 'Start Time', fieldName: 'StartTime', type: 'text', wrapText: true, sortable: false }
];

export default class debugLogsCheckerLWC extends LightningElement {
logs;
error;
selectedValue = '10'; // Default selected record count
wiredLogsResult; //new
options = [
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' }
];

@wire(getApexLogs, { recordCount: '$selectedValue' }) // Pass selected record count to Apex method
wiredLogs(result) {
    this.wiredLogsResult = result;
    if (result.data) {
        this.logs = result.data;
        this.error = undefined;
    } else if (result.error) {
        this.error = result.error;
        this.logs = undefined;
    }
}

refreshLogs() {
    return refreshApex(this.wiredLogsResult);
}

get columns() {
    return columns;
}

handleChange(event) {
    this.selectedValue = event.target.value; // Update selected record count
}

handleRowAction(event) {
    const rowId = event.detail.row.Id;
    window.open(`https://d2w00000rs9neeaz-dev-ed.develop.lightning.force.com/lightning/setup/ApexDebugLogDetail/page?address=%2Fp%2Fsetup%2Flayout%2FApexDebugLogDetailEdit%2Fd%3Fapex_log_id%3D${rowId}`);
}
//new-start
handleDeleteLogs() {
        const selectedLogIds = this.template.querySelector('lightning-datatable').getSelectedRows().map(row => row.Id);
        if (selectedLogIds.length === 0) {
            return; // No logs selected, no need to proceed
        }

        deleteApexLogs({ logIds: selectedLogIds })
            .then(() => {
                return refreshApex(this.wiredLogsResult);
            })
            .catch(error => {
                // Handle error
            });
    }

    get columns() {
        return columns;
    }

    handleChange(event) {
        this.selectedValue = event.target.value; // Update selected record count
    }
//new-end
}