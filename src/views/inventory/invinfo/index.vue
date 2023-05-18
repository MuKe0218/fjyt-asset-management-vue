
<template>
    <div class="app-container">
        <el-tabs v-model="activeName">
        <el-tab-pane label="已入库" name="first">
            <el-select v-model="receivedParams.id" placeholder="请选择仓库" filterable clearable>
            <el-option
            v-for="item in warehouseOption"
            :key="item.id"
            :label="item.warehouseName"
            :value="item.id">
            </el-option>
            </el-select>
            <el-table :data="receivedList" height="600px">
                <el-table-column label="仓库"  align="center" prop="warehouseName"  width="150" />
                <el-table-column label="资产名称"  align="center" prop="assetName"  width="150" />
                <el-table-column label="资产类别"  align="center" prop="classifyName" width="150" />
                <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="150" />
                <el-table-column label="数量"  align="center" prop="num" width="150" />
                <el-table-column label="计量单位"  align="center" prop="assetUnit" width="150" />
                <el-table-column label="总金额(元)"  align="center" prop="totalPrice" width="150" />
                </el-table>
        </el-tab-pane>
        <el-tab-pane label="未入库" name="second">
            <el-table :data="notReceivedList" height="600px">
                <el-table-column label="资产编号"  align="center" prop="assetCode" width="150">
                </el-table-column>
                <el-table-column label="名称"  align="center" prop="assetName"  width="150" />
                <el-table-column label="图片"  align="center" width="150">
                  <template slot-scope="scope">
                  <el-image
                  style="width: 100px; height: 100px"
                  :src="getimgUrl(scope.row)"
                  ></el-image>
                </template>
                </el-table-column>
                <el-table-column label="类别"  align="center" prop="classifyName" width="150" />
                <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="150" />
                <el-table-column label="计量单位"  align="center" prop="assetUnit" width="150" />
                <el-table-column label="金额"  align="center" prop="assetPrice" width="150" />
                <el-table-column label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <el-button type="text"
                    @click="handleWarehousing(scope.row)">入库</el-button>
                  </template>
                </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 入库对话框 -->
        <el-dialog
        title="请选择入库仓库"
        :visible.sync="open"
        width="25%">
          <el-select v-model="id" placeholder="请选择仓库" filterable clearable>
            <el-option
            v-for="item in warehouseOption"
            :key="item.id"
            :label="item.warehouseName"
            :value="item.id">
            </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
              <el-button @click="open = false">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { listWarehouseWithoutPage } from '@/api/inventory/warehouse'
import {
  receivedAssetList,
  notReceivedAssetList,
  assetWarehousing
} from '@/api/inventory/inventoryInfo'
export default {
  name: 'invinfo',
  data () {
    return {
      // 入库对话框
      open: false,
      // 选中的标签 默认第一个
      activeName: 'first',
      // 下拉框文本
      // dropdownText: '按资产名称统计',
      // 已入库查询条件
      receivedParams: {},
      // 未入库查询条件
      notReceiveParams: {},
      // 已入库list
      receivedList: [],
      // 未入库list
      notReceivedList: [],
      // 仓库list
      warehouseOption: [],
      // 提交入库from
      form: {},
      // 对话框选择的仓库id
      id: undefined
    }
  },
  watch: {
    activeName: {
      handler (text) {
        if (text === 'first') {
          this.getReceivedAssetList()
        } else {
          this.getNotReceivedAssetList()
        }
      }
    },
    'receivedParams.id': {
      handler (id) {
        this.getReceivedAssetList()
      }
    }
  },
  created () {
    this.getReceivedAssetList()
    this.getWarehouseList()
  },
  methods: {
    // 获取图片
    getimgUrl (row) {
      return '/api/asset/file/' + row.assetCode
    },
    // 获取已入库列表
    getReceivedAssetList () {
      receivedAssetList(this.receivedParams).then(response => {
        this.receivedList = response.data
      })
    },
    // 获取未入库列表
    getNotReceivedAssetList () {
      notReceivedAssetList(this.notReceiveParams).then(response => {
        this.notReceivedList = response.data
      })
    },
    // 获取仓库列表
    getWarehouseList () {
      listWarehouseWithoutPage().then(response => {
        this.warehouseOption = response.data
      })
    },
    // 入库按钮
    handleWarehousing (row) {
      this.form.id = row.id
      this.form.warehouseId = undefined
      this.open = true
    },
    // 确认按钮
    submit () {
      this.form.warehouseId = this.id
      assetWarehousing(this.form).then(response => {
        this.$message({
          message: '入库成功',
          type: 'success'
        })
        this.open = false
        this.getNotReceivedAssetList()
      })
    }
  }
}
</script>
