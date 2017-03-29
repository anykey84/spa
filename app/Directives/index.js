// load Directives
export default (ngModule) => {
    require('./Address/AddressDrct.js')(ngModule);

    require('./Admin/Document/DocumentDrct.js')(ngModule);
    require('./Admin/Profile/ProfileDrct.js')(ngModule);
    require('./Admin/Profile/ProfileOfficeDrct.js')(ngModule);
    require('./Admin/Profile/ProfileRoleDrct.js')(ngModule);
    require('./Admin/Role/RoleDrct.js')(ngModule);
    require('./Admin/Role/RolePropertyDrct.js')(ngModule);
    require('./Admin/Route/RouteDrct.js')(ngModule);
    //require('./Communication/CommunicationService.js')(ngModule); 

    require('./AlertMessages/AlertMessagesDrct.js')(ngModule);
    require('./AlertMessages/AlertMessagesNewTasksDrct.js')(ngModule);

    //require('./Contract/ContractAttachProfileInWorkDrct.js')(ngModule);
    require('./Contract/ContractInWorkDrct.js')(ngModule);
    require('./Contract/ContractLoanInfoDrct.js')(ngModule);
    require('./Contract/ContractParameterDrct.js')(ngModule);
    require('./Contract/ContractPaymentDrct.js')(ngModule);
    require('./Contract/ContractPersonDrct.js')(ngModule);
    require('./Contract/ContractsByFilters.js')(ngModule);
    require('./Contract/ContractsForCheckDrct.js')(ngModule);
    require('./Contract/ContractsForOperatorDrct.js')(ngModule);
    require('./Contract/ContractStatusDrct.js')(ngModule);
    require('./Contract/ContractTableDrct.js')(ngModule);

    require('./Deposit/DepositContractParameterDrct.js')(ngModule);
    require('./Deposit/DepositInfoDrct.js')(ngModule);
    require('./Deposit/DepositPaymentDrct.js')(ngModule);
    require('./Deposit/DepositStatusDrct.js')(ngModule);

    require('./File/ImageDrct.js')(ngModule);
    require('./File/ImageListDrct.js')(ngModule);

    require('./Office/OfficeDrct.js')(ngModule);
    require('./Office/OfficeSelectDrct.js')(ngModule);
    
    require('./Person/JuridicalInputStreamDrct.js')(ngModule);
    require('./Person/PersonAllInfoDrct.js')(ngModule);
    require('./Person/PersonAttachProfileInWorkDrct.js')(ngModule);
    require('./Person/PersonCheckTerroristsList.js')(ngModule);
    require('./Person/PersonCreditHistoryDrct.js')(ngModule);
    require('./Person/PersonDepositDrct.js')(ngModule);
    require('./Person/PersonDrct.js')(ngModule);
    require('./Person/PersonFinder.js')(ngModule);
    require('./Person/PersonKPKDrct.js')(ngModule);
    require('./Person/PersonInputStreamDrct.js')(ngModule);
    require('./Person/PersonLoanDrct.js')(ngModule);
    require('./Person/PersonPhoneAnalysisDrct.js')(ngModule);
    require('./Person/PersonPhoneDrct.js')(ngModule);
    require('./Person/PersonsByFiltersDrct.js')(ngModule);
    require('./Person/PersonSearchByPhoneDrct.js')(ngModule);
    require('./Person/PersonTableDrct.js')(ngModule);

    require('./PersonDocument/PersonDocumentDrct.js')(ngModule);

    require('./PersonFile/PersonFileDrct.js')(ngModule);

    require('./Profile/ProfileInWorkDrct.js')(ngModule);

    require('./ProgressBar/ProgressBarDrct.js')(ngModule);

    require('./ReportFile/ReportFileDrct.js')(ngModule);

    require('./Reports/ReportProfilePenaltyDrct.js')(ngModule);

    require('./ServerMessages/ServerMessagesDrct.js')(ngModule);

    require('./System/FocusMeDrct.js')(ngModule);
    require('./System/InputDateDrct.js')(ngModule);

    require('./Task/TaskDrct.js')(ngModule);
    require('./Task/TasksByTaskTypeDrct.js')(ngModule);

    require('./Ticket/CashRestsDrct.js')(ngModule);
    require('./Ticket/PaymentBankDrct.js')(ngModule);
    require('./Ticket/PaymentOtherDrct.js')(ngModule);
    require('./Ticket/PaymentSalaryDrct.js')(ngModule);
    require('./Ticket/PaymentTransferDrct.js')(ngModule);

    require('./TimeControl/TimeControlDrct.js')(ngModule);

    require('./NgEnter.js')(ngModule);

};