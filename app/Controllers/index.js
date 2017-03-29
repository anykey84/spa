export default (ngModule) => {
    require('./AdminCtrl.js')(ngModule);
    require('./ArchiveCtrl.js')(ngModule);
    require('./ContractCtrl.js')(ngModule);
    require('./ContractInfoAllCtrl.js')(ngModule);
    require('./ContractInfoCtrl.js')(ngModule);
    require('./DepositInfoCtrl.js')(ngModule);
    require('./HomeCtrl.js')(ngModule);
    require('./PeopleCtrl.js')(ngModule);
    require('./PersonInfoCtrl.js')(ngModule);
    require('./PersonInfoAllCtrl.js')(ngModule);
    require('./PersonInputStreamCtrl.js')(ngModule);
    require('./ProfileCtrl.js')(ngModule);
    require('./RegionalCtrl.js')(ngModule);
    require('./ReportCtrl.js')(ngModule);
    require('./TaskCtrl.js')(ngModule);
    require('./TicketCtrl.js')(ngModule);
};