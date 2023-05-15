<template>
    <div class="app-container">
        <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true">
        <el-form-item label="资产编号" prop="assetCode">
            <el-input
            v-model="queryParams.assetCode"
            placeholder="请输入资产编号"
            style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="资产名称" prop="assetName">
            <el-input
            v-model="queryParams.assetName"
            placeholder="请输入资产名称"
            style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery">搜索</el-button>
            <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row>
        <el-button type="danger" icon="el-icon-delete" circle
        @click="cleanAsset"></el-button>
    </el-row>

    <el-table v-loading="loading" :data="assetList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="状态" prop="status" align="center" width="100" >
          <template slot-scope="scope" v-if="statusList[0]">
            <el-tag
            :type = "statusList[scope.row.status].type"
            >
              {{statusList[scope.row.status].label}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="资产编号"  align="center" prop="assetCode" width="150">
        </el-table-column>
        <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="200" />
        <el-table-column label="图片"  align="center" width="120">
          <template slot-scope="scope">
            <el-image
            style="width: 100px; height: 100px"
            :src="getimgUrl(scope.row)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="类别"  align="center" prop="classifyName" width="150" />
        <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="120" />
        <el-table-column label="备注" align="center" prop="remark" width="100"></el-table-column>
    </el-table>
    </div>
</template>
<script>
import {
  listAsset,
  getStatusList
} from '@/api/asset/assetinfo'
export default {
  name: 'assetclean',
  data () {
    return {
      // 是否加载列表
      loading: true,
      // 资产列表
      assetList: [],
      // 状态列表
      statusList: [],
      // 资产选择
      assetSelection: [],
      // 搜索条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assetCode: undefined,
        assetName: undefined,
        status: '5'
      }
    }
  },
  created () {
    this.getList()
    this.getAssetStatus()
  },
  methods: {
    getimgUrl (row) {
      return '/api/asset/file/' + row.assetCode
    },
    handleSelectionChange (val) {
      this.assetSelection = val
    },
    /** 查询资产状态列表 */
    getAssetStatus () {
      getStatusList().then(response => {
        this.statusList = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 查询资产列表 */
    getList () {
      this.loading = true
      listAsset(this.queryParams).then(response => {
        this.assetList = response.rows
        this.total = response.total
        this.loading = false
      }
      )
    },
    /** 清理报废 */
    cleanAsset () {
      console.log(this.assetSelection)
    }
  }
}
</script>
