
<template>
    <div class="app-container">
        <el-form
        :model="queryParams"
        size="small"
        :inline="true">
        <el-form-item label="采购单编号">
            <el-input
            v-model="queryParams.procureCode"
            placeholder="请输入采购单编号"
            clearable
            style="width: 240px">
        </el-input>
        </el-form-item>
        <el-form-item label="申请人">
            <el-input
            v-model="queryParams.procureUser"
            placeholder="请输入采购申请人"
            clearable
            style="width: 240px">
        </el-input>
        </el-form-item>
        <el-form-item label="采购申请时间">
          <el-date-picker
            v-model="procureDateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
            clearable
            >
        </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button>
        </el-form-item>
    </el-form>

    <!-- 采购申请列表 -->
    <el-table :data="procureList">
        <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope" v-if="statusList[0]">
                <el-tag
                :type="statusList[scope.row.status].type">
            {{statusList[scope.row.status].label}}
            </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="采购单编号" align="center" width="150">
            <template slot-scope="scope">
                <el-link type="primary"
                @click="handleGetProcureDetail(scope.row)">
            {{scope.row.procureCode }}
            </el-link>
            </template>
        </el-table-column>
        <el-table-column label="采购物品" prop="assetNames" align="center" width="150">
        </el-table-column>
        <el-table-column label="采购申请人" prop="procureUser" align="center" width="150">
        </el-table-column>
        <el-table-column label="采购申请时间" align="center" width="150">
            <template slot-scope="scope">
                {{ parseTime(scope.row.procureTime) }}
            </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" width="200"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope" v-if="scope.row.status !== '3'">
            <el-button
                size="mini"
                type="text"
                @click="handleAccept(scope.row)">验收</el-button>
          </template>
        </el-table-column>
    </el-table>
    <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
        />

        <!-- 详情 -->
        <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="800px">
          <el-descriptions>
            <el-descriptions-item
        label="采购状态"
        :contentStyle="{'text-align': 'center'}"
        :labelStyle="{'text-align':'center'}">
          <el-tag
            :type = "detailForm.type"
            >
              {{detailForm.label}}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
          label="采购申请人"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.procureUser}}</el-descriptions-item>
          <el-descriptions-item
          label="采购申请时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{parseTime(detailForm.procureTime)}}</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
          <el-table
          :data="detailForm.mapList"
          style="width: 100%"
          height="250">
                <el-table-column label="物品名称"  align="center" prop="assetName" width="150"/>
                <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="150" />
                <el-table-column label="计量单位"  align="center" prop="unit" width="150" />
                <el-table-column label="数量"  align="center" prop="num" width="150" />
                <el-table-column label="金额"  align="center" prop="price" width="150" />
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
  getProcureList,
  getProcureDetail,
  getStatusList,
  checkAndAccept
} from '@/api/procure/procureInfo'
export default {
  name: 'procureInfo',
  data () {
    return {
      // 分页total
      total: 0,
      // 详情对话框是否显示
      detailOpen: false,
      // 详情对话框标题
      detailTitle: '',
      // 采购列表
      procureList: [],
      // 状态列表
      statusList: [],
      // 搜索条件
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 采购申请时间搜索日期范围
      procureDateRange: [],
      // 详情form
      detailForm: {
        type: undefined,
        label: undefined
      }
    }
  },
  created () {
    this.getProcureList()
    this.getStatusList()
  },
  methods: {
    // 搜索按钮
    handleQuery () {
      this.getProcureList()
    },
    // 获取采购单列表
    getProcureList () {
      this.addDateRange(this.queryParams, this.procureDateRange)
      getProcureList(this.queryParams).then(response => {
        this.procureList = response.rows
        this.total = response.total
      })
    },
    // 获取详情
    handleGetProcureDetail (row) {
      getProcureDetail(row.id).then(response => {
        this.detailForm = response.data
        this.detailForm.type = this.statusList[row.status].type
        this.detailForm.label = this.statusList[row.status].label
      })
      this.detailTitle = row.procureCode
      this.detailOpen = true
    },
    getStatusList () {
      getStatusList().then(response => {
        this.statusList = response.data
      })
    },
    // 验收
    handleAccept (row) {
      checkAndAccept(row.id).then(response => {
        this.$modal.msgSuccess('验收成功')
        this.getProcureList()
      })
    }
  }
}
</script>
