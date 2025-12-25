const profileService = require('../services/profileService');
const utils = require('../utils');
class ProfileController {
    async getProfiles(params, res) {
        try {
            const profiles = await profileService.getProfiles(params);
            utils.requestSuccess(res, profiles.data, { pageVo: profiles.pageVo })
        } catch (err) {
            utils.requestFail(res, 500, err.message);
        }
    }

    async deleteProfile(ids = [], res) {
        try {
            let response = null;
            switch (ids.length) {
                case 0:
                    throw new Error("params is empty");
                    break;
                case 1:
                    response = await profileService.deleteOneProfile(ids[0]);
                    break
                default:
                    response = await profileService.deleteManyProfiles(ids);
                    break;
            }

            if (response.deletedCount === 0) {
                throw new Error("delete failed");
            }
            utils.requestSuccess(res, response)
        } catch (err) {
            utils.requestFail(res, 500, err.message);

        }
    }

    async addProfile(params, res) {
        try {
            let response = null;
            if (utils.isEmpty(params) || (!utils.isObject(params) && !Array.isArray(params))) {
                throw new Error("params is empty or params is error");
            }
            if (Array.isArray(params)) {
                response = await profileService.insertManyProfiles(params);
            }

            if (utils.isObject(params)) {
                response = await profileService.insertOneProfile(params);
            }

            utils.requestSuccess(res, response)
        } catch (err) {
            utils.requestFail(res, 500, err.message);
        }
    }
    async updateOneProfile(id, params, res) {
        try {
            const response = await profileService.updateOneProfile(id, params);
            console.log(response, '------response');
            utils.requestSuccess(res, response)
        } catch (err) {
            utils.requestFail(res, 500, err.message);
        }
    }
}

module.exports = new ProfileController();