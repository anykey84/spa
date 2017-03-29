// load factories
export default (ngModule) => {
    require('./ContractFctr.js')(ngModule);
    require('./DictionaryTypesFctr.js')(ngModule);
    require('./GuidFctr.js')(ngModule);
    require('./OfficeFctr.js')(ngModule);
    require('./PersonFctr.js')(ngModule);
    require('./ProfileFctr.js')(ngModule);
    require('./ReportFctr.js')(ngModule);
    require('./URLFactory.js')(ngModule);
};