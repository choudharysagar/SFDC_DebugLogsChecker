public with sharing class DebugLogsChecker {
@AuraEnabled(cacheable=true)
public static List<ApexLogWrapper> getApexLogs(Integer recordCount) { // Accept record count parameter
    List<ApexLog> logs = [SELECT Id, Request, Application, Operation, Status, DurationMilliseconds, LogLength, StartTime FROM ApexLog ORDER BY StartTime DESC LIMIT :recordCount]; // Use dynamic limit
    List<ApexLogWrapper> logWrappers = new List<ApexLogWrapper>();
    
    for(ApexLog log : logs) {
        logWrappers.add(new ApexLogWrapper(log));
    }
    
    return logWrappers;
}

public class ApexLogWrapper {
    @AuraEnabled
    public String Id { get; set; }
    @AuraEnabled
    public String Request { get; set; }
    @AuraEnabled
    public String Application { get; set; }
    @AuraEnabled
    public String Operation { get; set; }
    @AuraEnabled
    public String Status { get; set; }
    @AuraEnabled
    public Integer DurationMilliseconds { get; set; }
    @AuraEnabled
    public Integer LogLength { get; set; }
    @AuraEnabled
    public DateTime StartTime { get; set; }
    
    public ApexLogWrapper(ApexLog log) {
        this.Id = log.Id;
        this.Request = log.Request;
        this.Application = log.Application;
        this.Operation = log.Operation;
        this.Status = log.Status;
        this.DurationMilliseconds = log.DurationMilliseconds;
        this.LogLength = log.LogLength;
        this.StartTime = log.StartTime;
    }
}
@AuraEnabled
    public static void deleteApexLogs(List<String> logIds) {
        HttpRequest req = new HttpRequest();
        req.setMethod('DELETE');
        req.setEndpoint(System.URL.getSalesforceBaseUrl().toExternalForm() + '/services/data/v54.0/tooling/sobjects/ApexLog/' + String.join(logIds, ','));
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        System.debug('sessionID: '+UserInfo.getSessionId());

        Http http = new Http();
        HttpResponse res = http.send(req);

        // Check response status
        if (res.getStatusCode() != 204) {
            String errorMessage = 'Error deleting logs. Status code: ' + res.getStatusCode();
            if (res.getBody() != null && res.getBody().trim() != '') {
                errorMessage += ', Response: ' + res.getBody();
            }
            System.debug('errorMessage: '+errorMessage);
            throw new AuraHandledException(errorMessage);
        }
    }
}