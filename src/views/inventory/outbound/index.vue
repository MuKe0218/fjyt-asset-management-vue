<template>
    <div class="app-container">
       <el-form
       :model="queryParams"
       size="small"
       :inline="true">
    <el-form-item label="出库单编号">
        <el-input
        v-model="queryParams.outboundCode"
        placeholder="请输入出库单编号"
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
    <el-table :data="outboundList">
        <el-table-column label="出库单编号" align="center" width="150">
            <template slot-scope="scope">
                <el-link type="primary"
                @click="getDetail(scope.row)">
            {{scope.row.outboundCode }}
            </el-link>
            </template>
        </el-table-column>
        <el-table-column label="出库资产" align="center" prop="assetNames" width="150"></el-table-column>
        <el-table-column label="出库时间" align="center"  width="150">
            <template slot-scope="scope">
                {{parseTime(scope.row.outboundTime)}}
            </template>
        </el-table-column>
        <!-- <el-table-column label="出库单创建人" align="center" prop="createUser"  width="150">
        </el-table-column> -->
        <el-table-column label="出库单创建时间" align="center"  width="150">
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
          >{{ parseTime(detailForm.outboundTime)}}</el-descriptions-item>
          </el-descriptions>
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
          <el-divider></el-divider>
          <el-table
          :data="detailForm.outboundAssetList"
          style="width: 100%"
          height="250">
                <el-table-column label="资产编号"  align="center" prop="assetCode" width="180"/>
                <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="180" />
                <el-table-column label="类别"  align="center" prop="classifyName" width="180" />
                <el-table-column label="数量"  align="center" prop="num" width="180" />
                <el-table-column label="金额"  align="center" prop="price" width="180" />
                <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="200" />
          </el-table>
    </el-dialog>
    </div>
</template>
<script>
import {
  getOutboundList,
  getOutboundDetail
} from '@/api/inventory/outbound'
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
      outboundList: undefined,
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
    this.getOutboundList()
  },
  methods: {
    // 搜索按钮
    handleQuery () {},
    // 获取出库单列表
    getOutboundList () {
      getOutboundList(this.queryParams).then(response => {
        this.outboundList = response.rows
        this.total = response.total
      })
    },
    // 获取详细信息
    getDetail (row) {
      this.detailTitle = row.outboundCode
      this.detailOpen = true
      getOutboundDetail(row.id).then(response => {
        this.detailForm = response.data
      })
    }
  }
}
</script>
