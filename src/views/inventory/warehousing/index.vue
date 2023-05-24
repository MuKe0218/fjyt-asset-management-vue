<template>
    <div class="app-container">
       <el-form
       :model="queryParams"
       size="small"
       :inline="true">
    <el-form-item label="入库单编号">
        <el-input
        v-model="queryParams.warehousingCode"
        placeholder="请输入入库单编号"
        style="width: 240px">
    </el-input>
    </el-form-item>
    <el-form-item>
        <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery">搜索</el-button>
    </el-form-item>
    </el-form>
<!-- 出库单列表 -->
    <el-table :data="warehousingList">
        <el-table-column label="入库单编号" align="center" width="150">
            <template slot-scope="scope">
                <el-link type="primary"
                @click="getDetail(scope.row)">
            {{scope.row.warehousingCode }}
            </el-link>
            </template>
        </el-table-column>
        <el-table-column label="入库资产" align="center" prop="assetNames" width="150"></el-table-column>
        <el-table-column label="入库时间" align="center"  width="150">
            <template slot-scope="scope">
                {{parseTime(scope.row.warehousingTime)}}
            </template>
        </el-table-column>
        <el-table-column label="入库单创建人" align="center" prop="createUser"  width="150">
        </el-table-column>
        <el-table-column label="入库单创建时间" align="center" width="150">
            <template slot-scope="scope">
                {{parseTime(scope.row.createTime)}}
            </template>
        </el-table-column>
    </el-table>
    <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
        />
    <!-- 详情描述 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="800px">
      <el-descriptions direction="vertical" :column="5" border
          >
          <el-descriptions-item
          label="出库时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{ parseTime(detailForm.warehousingTime)}}</el-descriptions-item>
          <el-descriptions-item
          label="创建人"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.createUser}}</el-descriptions-item>
          <el-descriptions-item
          label="创建时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{ parseTime(detailForm.createTime)}}</el-descriptions-item>
        </el-descriptions>
          <el-divider></el-divider>
          <el-table
          :data="detailForm.warehousingAssetList"
          style="width: 100%"
          height="250">
                <el-table-column label="资产编号"  align="center" prop="assetCode" width="180"/>
                <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="180" />
                <el-table-column label="类别"  align="center" prop="classifyName" width="180" />
                <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="200" />
          </el-table>
    </el-dialog>
    </div>
</template>
<script>
import {
  getWarehousingList,
  getWarehousingDetail
} from '@/api/inventory/warehousing'
export default {
  name: 'outbound',
  data () {
    return {
      // 总条数
      total: 0,
      // 是否打开详情
      detailOpen: false,
      // 详情头
      detailTitle: undefined,
      // 获取出库单列表
      warehousingList: undefined,
      // 搜索条件
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 详情
      detailForm: {}
    }
  },
  created () {
    this.getWarehousingList()
  },
  methods: {
    // 搜索按钮
    handleQuery () {
      this.getWarehousingList()
    },
    // 获取出库单列表
    getWarehousingList () {
      getWarehousingList(this.queryParams).then(response => {
        this.warehousingList = response.rows
        this.total = response.total
      })
    },
    // 获取详细信息
    getDetail (row) {
      this.detailTitle = row.warehousingCode
      this.detailOpen = true
      getWarehousingDetail(row.id).then(response => {
        this.detailForm = response.data
      })
    }
  }
}
</script>
