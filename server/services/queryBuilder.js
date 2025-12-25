class QueryBuilder {
    query = {}
    populate = []
    sort = {}
    page = 1
    limit = 10
    select = ''
    constructor(model) {
        this.model = model
    }

    // 精确匹配
    exactMatch(field, value) {
        if (value !== undefined && value !== null && value !== '') {
            this.query[field] = value
        }
        return this
    }

    // 模糊查询
    fuzzyMatch(field, value) {
        if (value && value.trim()) {
            this.query[field] = { $regex: value.trim(), $options: 'i' }
        }
        return this
    }

    // 范围查询
    range(field, min, max) {
        if (min !== undefined || max !== undefined) {
            this.query[field] = {}
            if (min !== undefined) this.query[field].$gte = min
            if (max !== undefined) this.query[field].$lte = max
        }
        return this
    }

    // 日期范围查询
    dateRange(field, startDate, endDate) {
        if (startDate || endDate) {
            this.query[field] = {}
            if (startDate) this.query[field].$gte = new Date(startDate)
            if (endDate) this.query[field].$lte = new Date(endDate)
        }
        return this
    }

    // IN 查询
    in(field, values) {
        if (values && Array.isArray(values) && values.length > 0) {
            this.query[field] = { $in: values }
        }
        return this
    }

    // NOT IN 查询
    notIn(field, values) {
        if (values && Array.isArray(values) && values.length > 0) {
            this.query[field] = { $nin: values }
        }
        return this
    }

    // 布尔查询
    boolean(field, value) {
        if (value !== undefined) {
            this.query[field] = value === 'true' || value === true
        }
        return this
    }

    // 排序
    setSort(sortField, sortOrder = 'asc') {
        if (sortField) {
            this.sort[sortField] = sortOrder === 'desc' ? -1 : 1
        }
        return this
    }

    // 分页
    setPagination(page = 1, limit = 10) {
        this.page = parseInt(page) || 1
        this.limit = parseInt(limit) || 10
        return this
    }

    // 选择字段
    setSelect(fields) {
        if (fields) {
            this.select = fields
        }
        return this
    }

    // 关联查询
    setPopulate(populate) {
        if (populate) {
            this.populate = Array.isArray(populate) ? populate : [populate]
        }
        return this
    }

    // 执行查询
    async exec() {
        const skip = (this.page - 1) * this.limit

        // 构建查询
        let query = this.model.find(this.query)

        // 选择字段
        if (this.select) {
            query = query.select(this.select)
        }

        // 排序
        if (Object.keys(this.sort).length > 0) {
            query = query.sort(this.sort)
        }

        // 分页
        query = query.skip(skip).limit(this.limit)

        // 关联查询
        if (this.populate.length > 0) {
            for (const populate of this.populate) {
                query = query.populate(populate)
            }
        }


        // 执行查询
        const [data, total] = await Promise.all([
            query.lean().exec(),
            this.model.countDocuments(this.query)
        ])

        return {
            data,
            pageVo: {
                curPage: this.page,
                pageSize: this.limit,
                total,
                totalPages: Math.ceil(total / this.limit),
            }
        }
    }
}

module.exports = QueryBuilder