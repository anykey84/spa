// load Services
export default (ngModule) => {
    require('./Address/AddressService.js')(ngModule);

    require('./AlertMessages/AlertMessagesService.js')(ngModule);

    require('./Contract/ContractLoanInfoService.js')(ngModule);
    require('./Contract/ContractParameterService.js')(ngModule);
    require('./Contract/ContractPersonService.js')(ngModule);
    require('./Contract/ContractService.js')(ngModule);
    require('./Contract/ContractStatusService.js')(ngModule);

    require('./CreditHistory/CreditHistoryService.js')(ngModule);
    require('./Communication/CommunicationService.js')(ngModule); 
    require('./AdwareChannel/AdwareChannelService.js')(ngModule); 

    require('./Deposit/DepositService.js')(ngModule);

    require('./Document/DocumentService.js')(ngModule);
    
    require('./Office/OfficeService.js')(ngModule);

    require('./Payment/PaymentService.js')(ngModule);
    require('./Payment/TicketService.js')(ngModule);

    require('./Person/PersonDocumentService.js')(ngModule);
    require('./Person/PersonFileService.js')(ngModule);
    require('./Person/PersonKPKService.js')(ngModule);
    require('./Person/PersonService.js')(ngModule);

    require('./Phone/PhoneService.js')(ngModule);

    require('./Product/ProductService.js')(ngModule);

    require('./Profile/ProfileService.js')(ngModule);

    require('./Report/ReportService.js')(ngModule);

    require('./Role/RoleService.js')(ngModule);

    require('./Task/TaskService.js')(ngModule);

    require('./TimeControl/TimeControlService.js')(ngModule);

    require('./DateService.js')(ngModule);
};