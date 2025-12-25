<template>
    <div class="search-list-wrapper">
        <el-collapse v-model="activeName">
            <el-collapse-item title="查询列表" name="1">
                <el-form :inline="true" :model="searchForm">
                    <el-form-item label="商品类型">
                        <el-input v-model="searchForm.type" placeholder="请输入商品类型"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述">
                        <el-input v-model="searchForm.description" placeholder="请输入商品描述"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">Create</el-button>
                        <el-button>Cancel</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="table-container">
            <div class="operation-buttons">
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="primary" @click="handleDelete">删除</el-button>
            </div>
            <el-table ref="multipleTableRef" :data="tableData" row-key="_id" style="width: 100%"
                      border v-loading="loading" element-loading-text="Loading...">
                <el-table-column type="selection" :selectable="selectable" width="55" />
                <el-table-column label="商品类型" prop="type" width="120" sortable>
                    <template #default="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.type" placeholder=""
                                  @change="onChange(scope.row)"></el-input>
                        <span v-else>{{ scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品描述" prop="description" width="140" sortable>
                    <template #default="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.description"
                                  placeholder="" @change="onChange(scope.row)"></el-input>
                        <span v-else>{{ scope.row.description }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="进货价" prop="incode" width="120" sortable>
                    <template #default="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.incode"
                                  @change="onChange(scope.row)"></el-input>
                        <span v-else>{{ scope.row.incode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="售价" prop="expend" width="120" sortable>
                    <template #default="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.expend"
                                  @change="onChange(scope.row)"></el-input>
                        <span v-else>{{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="现金" prop="cash" width="120" sortable>
                    <template #default="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.cash"
                                  @change="onChange(scope.row)"></el-input>
                        <span v-else>{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标记" prop="remark" width="200" sortable>
                    <template #default="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.remark"
                                  @change="onChange(scope.row)"></el-input>
                        <span v-else>{{ scope.row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="日期" prop="date" width="200" sortable>
                    <template #default="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="120">
                    <template #default="scope">
                        <el-button v-if="!scope.row.isAdd" link type="primary" size="small"
                                   @click="toProductDetail(scope.row)">
                            Detail
                        </el-button>
                        <el-button v-if="!scope.row.isAdd" link type="primary" size="small"
                                   @click="handleEdit(scope.row)">Edit</el-button>

                        <el-button v-if="scope.row.edited || scope.row.isAdd" link type="primary"
                                   size="small" @click="handleSave(scope.row)">Save</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="pageVo.total > 0" v-model:current-page="pageVo.currentPage"
                           v-model:page-size="pageVo.pageSize" :page-sizes="[10, 30, 50, 100]"
                           background layout="total, sizes, prev, pager, next, jumper"
                           :total="pageVo.total" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" class="page-container" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'
import { serchProfiles, deleteManyProfiles, insertOneProfile, updateOneProfile } from '@/apis/profiles'
import router from '@/router'
import { v1 as uuidv1 } from 'uuid'
const activeName = ref('1')
const searchForm = ref({
    type: "",
    description: ""
})
const pageVo = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0
})
const multipleTableRef = ref<TableInstance>()
const tableData = ref<any[]>([])
const loading = ref(false)
const handleSearch = async () => {
    loading.value = true
    const params = {
        type: searchForm.value.type.trim(),
        description: searchForm.value.description.trim(),
        pageVo: {
            curPage: pageVo.value.currentPage,
            pageSize: pageVo.value.pageSize
        }
    }
    const data: any = await serchProfiles(params)
    if (data.success) {
        (data.data || []).forEach((item: any) => {
            item.isEdit = false
        })
        tableData.value = data.data || []
        pageVo.value.total = data.pageVo.total
        pageVo.value.currentPage = data.pageVo.curPage
        pageVo.value.pageSize = data.pageVo.pageSize
    }
    loading.value = false
}
const handleAdd = () => {
    const newRow = {
        _id: uuidv1(),
        type: "",
        description: "",
        incode: "",
        expend: "",
        cash: "",
        remark: "",
        isEdit: true,
        isAdd: true,
    }
    tableData.value.unshift(newRow)
}
const handleDelete = async () => {
    const rows = multipleTableRef.value!.getSelectionRows()
    if (rows.length > 0) {
        loading.value = true
        const ids = rows.map((row) => row._id)
        const data: any = await deleteManyProfiles({ ids })
        if (data.success) {
            handleSearch()
        }
        loading.value = false
    }
}

const handleSave = async (row: any) => {
    loading.value = true;
    const param: any = {
        type: row.type,
        description: row.description,
        incode: row.incode,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
    }
    let data: any = {}
    if (row.isAdd) {
        data = await insertOneProfile(param)
    }

    if (row.edited) {
        param._id = row._id
        data = await updateOneProfile(row._id, param)
    }
    loading.value = false;
    if (data.success) {
        handleSearch()
    }

}
const selectable = () => {
    return true
}


const onChange = (row: any) => {
    if (row.isAdd) return
    row.edited = true
}

const handleEdit = (row: any) => {
    row.isEdit = true
}

const handleSizeChange = (val: number) => {
    pageVo.value.pageSize = val
    handleSearch()
}
const handleCurrentChange = (val: number) => {
    pageVo.value.currentPage = val;
    handleSearch()
}
const toProductDetail = (row: any) => {
    router.push({ name: 'productDetail', params: { id: row._id } })
}

</script>

<style scoped>
.search-list-wrapper {
    margin: 20px;
    padding: 0 20px 20px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--bg-color);
    box-shadow: 0 2px 12px var(--border-color-darker);

}

.table-container {
    margin-top: 40px;
}

.operation-buttons {
    margin-bottom: 10px;
}

.page-container {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}
</style>