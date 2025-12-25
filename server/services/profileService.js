const Profile = require('../models/Profile')
const QueryBuilder = require('./queryBuilder')

class ProfileService {
    /**
     * 查询用户列表（带分页、过滤、排序）
     */
    async getProfiles(queryParams) {
        const {
            // 精确查询参数
            id,
            type,
            // 模糊查询参数
            description,

            // 范围查询
            createdStart,
            createdEnd,

            // 分页排序
            pageVo: {
                curPage: page,
                pageSize: limit,
            } = {
                curPage: 1,
                pageSize: 10,
            },
            fields
        } = queryParams
        // 创建查询构建器
        const queryBuilder = new QueryBuilder(Profile)
            .setPagination(page, limit)

        // 精确查询
        if (id) queryBuilder.exactMatch('_id', id)
        if (type) queryBuilder.exactMatch('type', type)

        // 模糊查询
        if (description) queryBuilder.fuzzyMatch('description', description)

        // 范围查询
        if (createdStart || createdEnd) queryBuilder.dateRange('createdAt', createdStart, createdEnd)


        // 字段选择
        if (fields) queryBuilder.setSelect(fields)

        // 执行查询
        return queryBuilder.exec()
    }

    async deleteOneProfile(id) {
        return await Profile.deleteOne({ _id: id })
    }
    async deleteManyProfiles(ids) {
        return await Profile.deleteMany({ _id: { $in: ids } })
    }
    async insertOneProfile(profile) {
        return await Profile.create(profile)
    }
    async insertManyProfiles(profiles) {
        return await Profile.insertMany(profiles)
    }
    async updateOneProfile(id, param) {
        return await Profile.updateOne({ _id: id }, param)
    }
}

module.exports = new ProfileService()