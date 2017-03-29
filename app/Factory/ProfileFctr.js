export default (ngModule) => {

    ngModule.factory('Profile', ['$q', 'profileService',
        function ($q, profileService) {
            var profileFctr = {};

            var roles = [];
            var profiles = [];
            var rolesInit = false;

            profileFctr.InitRoles = function (item) {
                //console.log(item);
                roles = item;
                rolesInit = true;
            };

            profileFctr.GetRoles = function () {
                return roles;
            };

            profileFctr.GetRolePropertyValue = function (name) {
                var f = _.find(roles, function (r) {
                    return r.roleProperty == name;
                });
                if (f == null)
                    return false;
                return f.rolePropertyValue;
            };

            profileFctr.InitProfiles = function (item) {
                profiles = item;
            }

            profileFctr.GetProfiles = function () {
                return profiles;
            }

            // Если роли загружены, то ничего не делает,
            // иначе грузит роли.
            // Возвращает Promise. Работает через .then(function()[,function()])
            // Примеры в TimeControlDrct
            profileFctr.LoadRoles = function () {
                return $q.when(!rolesInit ? profileService.getRoles() : null)
                    .then(function (result) {
                        if (!_.isNil(result))
                            profileFctr.InitRoles(result.data);
                    });
            }
            // позволяет сразу получить значение роли через Promise
            profileFctr.GetRolePropertyPromise = function (name) {
                return profileFctr.LoadRoles().then(function (result) {
                    return profileFctr.GetRolePropertyValue(name);
                });
            }

            return profileFctr;
        }]);
}