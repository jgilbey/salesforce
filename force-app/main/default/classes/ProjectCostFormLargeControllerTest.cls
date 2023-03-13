@isTest
public with sharing class ProjectCostFormLargeControllerTest {
  private static final String PROJECT_COST_DEVELOPMENT_RTDN = 'Large_Grants_Development';

  private static final String PROJECT_CASH_DEVELOPMENT_RTDN = 'Large_Development';

  private static final String PROJECT_COST_AND_CASH_DELIVERY_RTDN = 'Large_Grants_Delivery';

  @TestSetup
  static void makeData() {
    //should modify TestDataFactory instead
    Database.DMLOptions dmo = new Database.DMLOptions();
    dmo.assignmentRuleHeader.useDefaultRule = true;
    case largeProject = TestDataFactory.createLargeGrantCase(false); //TODO large
    largeProject.setOptions(dmo); //large
    insert largeProject; //large
  }

  @isTest
  //getCostRecordTypeIdByDeveloperName
  private static void testGetCostRecordTypeIdByDeveloperName() {
    Test.startTest();
    String result = ProjectCostFormLargeController.getCostRecordTypeIdByDeveloperName(
      PROJECT_COST_DEVELOPMENT_RTDN
    );
    Test.stopTest();
    system.assertNotEquals(null, result);
    //use the static var in the large projectg controller check the result is not null
  }

  @isTest
  private static void testGetCashRecordTypeIdByDeveloperName() {
    //use the static var in the large projectg controller check the result is not null
    Case large = [SELECT RecordType.Name FROM Case LIMIT 1];
    Test.startTest();
    String result = ProjectCostFormLargeController.getCashRecordTypeIdByDeveloperName(
      PROJECT_CASH_DEVELOPMENT_RTDN
    );
    Test.stopTest();
    system.assertNotEquals(null, result);
  }

  @isTest
  private static void testGetCashContributionsDev() {
    Case project = [SELECT Id FROM Case LIMIT 1];
    List<Project_Income__c> incomes = TestDataFactory.createProjectIncome(
      project.Id,
      3
    );

    //assign appropriate record id

    Test.startTest();
    List<Project_Income__c> result = ProjectCostFormLargeController.getCashContributionsDevelopment(
      project.Id
    );
    Test.stopTest();
    system.assert(result.size() >= 3);
  }

  @isTest
  private static void testGetCashContributionsDel() {
    Case project = [SELECT Id FROM Case LIMIT 1];
    insert TestDataFactory.createProjectIncome(project.Id, 3);
    Test.startTest();
    List<Project_Income__c> incomes = ProjectCostFormLargeController.getCashContributionsPotentialDelivery(
      project.Id
    );
    Test.stopTest();

    system.assert(incomes.size() >=3 );
  }

  @isTest
  private static void testGetProjectCostsDev() {
    Case project = [SELECT Id FROM Case LIMIT 1];

    List<project_cost__c> costs = TestDataFactory.createProjectCost(
      project.Id,
      3
    );

    String recordtypeId = ProjectCostFormLargeController.getCostRecordTypeIdByDeveloperName(
      PROJECT_COST_DEVELOPMENT_RTDN
    );
    List<project_cost__c> costsWithCorrectRT = new List<project_cost__c>();
    for (project_cost__c cost : costs) {
      cost.RecordTypeId = recordtypeId;
      costsWithCorrectRT.add(cost);
    }

    insert costsWithCorrectRT;
    Test.startTest();
    List<Project_Cost__c> result = ProjectCostFormLargeController.getProjectCostsDevelopment(
      project.Id
    );

    for (project_cost__c cost : result) {
      system.debug(cost);
    }
    Test.stopTest();
    system.assert(result.size() >=3 );
  }

  @isTest
  private static void testGetProjectCostsDel() {
    Case project = [SELECT Id FROM Case LIMIT 1];

    insert TestDataFactory.createProjectCost(project.Id, 3);
    Test.startTest();
    List<Project_Cost__c> costs = ProjectCostFormLargeController.getProjectCostsPotentialDelivery(
      project.Id
    );
    Test.stopTest();
    system.assert(costs.size() >=3 );
  }
}
