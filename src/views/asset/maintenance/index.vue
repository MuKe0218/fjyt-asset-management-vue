<template>
    <div class="app-container">
        <el-form
        ref="queryForm"
        :model="queryParams"
        size="small"
        :inline="true"
        >
        <el-form-item label="维修单编号" prop="maintenanceCode">
            <el-input
            v-model="queryParams.maintenanceCode"
            placeholder="请输入维修单编号"
            clearable
            style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="maintenanceUser">
            <el-input
            v-model="queryParams.maintenanceUser"
            clearable
            placeholder="请输入申请人"
            style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select
            v-model="queryParams.status"
            placeholder="维修单状态"
            style="width: 240px">
            <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="创建方式" prop="createWay">
            <el-select
            v-model="queryParams.createWay"
            placeholder="创建方式"
            style="width:240px">
            <el-option
            v-for="item in createWayList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
            <el-date-picker
            v-model="mainDateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width:240px">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间">
            <el-date-picker
            v-model="createDateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width:240px">
        </el-date-picker>
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
        <el-col :span="1.5">
        <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd">新增</el-button>
        </el-col>
    </el-row>

    <el-table v-loading="loading" :data="maintenanceList">
        <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope" v-if="statusList[0]">
                <el-tag
                :type="statusList[scope.row.status].type">
            {{ statusList[scope.row.status].label }}
            </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="维修编号" align="center" width="150">
            <template slot-scope="scope">
                <el-link type="primary"
                @click="getMainTenDetail(scope.row)">
            {{ scope.row.maintenanceCode }}
            </el-link>
            </template>
        </el-table-column>
        <el-table-column label="维修资产" prop="assetNames" align="center" width="150"></el-table-column>
        <el-table-column label="申请人" prop="maintenanceUser" align="center" width="150"></el-table-column>
        <el-table-column label="申请时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.maintenanceTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建方式" align="center" width="150">
            <template slot-scope="scope" v-if="createWayList[0]">
                <span>{{ createWayList[scope.row.createWay].label }}</span>
            </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" width="150"></el-table-column>
        <el-table-column label="创建人" prop="createUser" align="center" width="150"></el-table-column>
        <el-table-column label="创建时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{parseTime(scope.row.createTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="修改人" prop="updateUser" align="center" width="150"></el-table-column>
        <el-table-column label="修改时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)">修改</el-button>
                <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
        />
    <!-- 添加修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
            <el-col :span="12">
                <el-form-item label="申请人" prop="maintenanceUser">
                <el-input
                v-model="form.maintenanceUser"
                placeholder="请输入申请人">
            </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="申请时间" prop="maintenanceTime">
                    <el-date-picker
                    v-model="form.maintenanceTime"
                    type="date"
                    placeholder="选择申请时间">
                </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                    <el-input
                    v-model="form.remark"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容">
                </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
              <el-button
              type="primary"
              size="mini"
              round
              @click="handleAsset">添加资产</el-button>
              <el-table :data="form.assetSelectList" height="250">
                <el-table-column label="资产编号"  align="center" prop="assetCode" width="140"/>
                <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="类别"  align="center" prop="classifyName" width="130" />
                <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="140" />
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="removeAsset(scope.row)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 资产列表对话框 -->
    <el-dialog title="资产列表" :visible.sync="assetOpen" width="700px">
      <el-form :model="assetQueryParams"
      ref="assetQueryParams"
      size="small"
      :inline="true">
      <el-form-item label="资产名称" prop="assetName">
        <el-input
        v-model="assetQueryParams.assetName"
        placeholder="请输入资产"
        clearable
        style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="资产类别" prop="parentId" >
        <treeselect
            v-model = "assetQueryParams.classifyId"
            placeholder="请选择类别"
            :options = "assetClassify"
            :normalizer="normalizer"
            style="width: 200px"
          />
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="assetHandleQuery"
        >筛选</el-button>
    </el-form-item>
    </el-form>
      <el-button type="primary" size="mini" @click="determine">确 定</el-button>
      <!-- <el-button type="primary" size="mini" @click="toggleSelection(montageSelection())">显示已选择的资产</el-button> -->
      <el-table ref="multipleTable" :data="assetList" style="width: 100%" height="300" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="资产编号"  align="center" prop="assetCode" width="150">
        </el-table-column>
        <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="类别"  align="center" prop="classifyName" width="150" />
        <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="150" />
      </el-table>
    </el-dialog>
<!-- 资产列表对话框 -->
<el-dialog title="资产列表" :visible.sync="assetOpen" width="700px">
      <el-form :model="assetQueryParams"
      ref="assetQueryParams"
      size="small"
      :inline="true">
      <el-form-item label="资产名称" prop="assetName">
        <el-input
        v-model="assetQueryParams.assetName"
        placeholder="请输入资产"
        clearable
        style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="资产类别" prop="parentId" >
        <treeselect
            v-model = "assetQueryParams.classifyId"
            placeholder="请选择类别"
            :options = "assetClassify"
            :normalizer="normalizer"
            style="width: 200px"
          />
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="assetHandleQuery"
        >筛选</el-button>
    </el-form-item>
    </el-form>
      <el-button type="primary" size="mini" @click="determine">确 定</el-button>
      <!-- <el-button type="primary" size="mini" @click="toggleSelection(montageSelection())">显示已选择的资产</el-button> -->
      <el-table ref="multipleTable" :data="assetList" style="width: 100%" height="300" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="资产编号"  align="center" prop="assetCode" width="150">
        </el-table-column>
        <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="类别"  align="center" prop="classifyName" width="150" />
        <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="150" />
      </el-table>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="800px">
      <el-descriptions direction="vertical" :column="5" border
          >
        <el-descriptions-item
        label="维修状态"
        :contentStyle="{'text-align': 'center'}"
        :labelStyle="{'text-align':'center'}">
          <el-tag
            :type = "detailForm.type"
            >
              {{detailForm.label}}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
          label="申请人"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.maintenanceUser}}</el-descriptions-item>
          <el-descriptions-item
          label="申请时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{parseTime(detailForm.maintenanceTime)}}</el-descriptions-item>
          <el-descriptions-item
          label="备注"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.remark}}</el-descriptions-item>
          <el-descriptions-item
          label="创建方式"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.createWayLabel}}</el-descriptions-item>
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
          :data="detailForm.assetSelectList"
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
  listMaintenance,
  listMaintenanceById,
  maintenanceStatusList,
  addMaintenance,
  updateMaintenance,
  delMaintenance
} from '@/api/asset/maintenance'
import {listAssetWithoutPage, getCreateWayList} from '@/api/asset/assetinfo'
import {listAssetClassify} from '@/api/asset/assetclassify'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'maintenance',
  components: {Treeselect},
  data () {
    return {
      // 分页total
      total: 0,
      // 列表加载
      loading: true,
      // 是否打开新增修改对话框
      open: false,
      // 是否打开资产添加对话框
      assetOpen: false,
      // 是否打开详情对话框
      detailOpen: false,
      // 搜索条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        maintenanceCode: undefined,
        maintenanceUser: undefined,
        status: undefined,
        createWay: undefined
      },
      // 资产列表筛选条件
      assetQueryParams: {},
      // 维修列表
      maintenanceList: [],
      // 状态list
      statusList: [],
      // 分类列表
      assetClassify: [],
      // 创建方式list
      createWayList: [],
      // 资产列表
      assetList: [],
      // 申请日期范围
      mainDateRange: [],
      // 创建日期范围
      createDateRange: [],
      // 添加修改对话框标题
      title: '',
      // 详情对话框标题
      detailTitle: '',
      // 资产选择
      assetSelection: [],
      // 表单
      form: {
        assetSelectList: []
      },
      detailForm: {
        type: undefined,
        label: undefined,
        createWayLabel: undefined
      },
      // 规则
      rules: {
        maintenanceUser: [
          {required: true, message: '申请人必填', trigger: 'blur'}
        ],
        maintenanceTime: [
          {required: true, message: '申请时间必填', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getList()
    this.getUseStatusList()
    this.getAssetClassify()
    this.getCreateWay()
  },
  methods: {
    handleSelectionChange (val) {
      this.assetSelection = val
    },
    /** 转换分类数据结构 */
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.classifyId,
        label: node.classifyName,
        children: node.children
      }
    },
    // 搜索
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置
    resetQuery () {
      this.mainDateRange = []
      this.createDateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 筛选
    assetHandleQuery () {
      this.getAssetList()
    },
    // 确认选中的资产
    determine () {
      this.assetSelection.forEach(item => this.form.assetSelectList.push(item))
      for (let i = 0; i < this.form.assetSelectList.length; i++) {
        for (let j = 0; j < this.form.assetSelectList.length; j++) {
          if (this.form.assetSelectList[i].assetCode === this.form.assetSelectList[j].assetCode && i !== j) {
            this.form.assetSelectList.splice(j, 1)
          }
        }
      }
      this.assetOpen = false
    },
    // 移除选中的资产
    removeAsset (row) {
      for (let i = 0; i < this.form.assetSelectList.length; i++) {
        if (row.assetCode === this.form.assetSelectList[i].assetCode) {
          this.form.assetSelectList.splice(i, 1)
          break
        }
      }
    },
    // 获取维修列表
    getList () {
      this.loading = true
      this.addDateRange(this.queryParams, this.mainDateRange, 'MaintenanceTime')
      this.addDateRange(this.queryParams, this.createDateRange, 'CreateTime')
      listMaintenance(this.queryParams).then(response => {
        this.maintenanceList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 详情
    getMainTenDetail (row) {
      listMaintenanceById(row.id).then(response => {
        this.detailForm = response.data
        this.detailForm.type = this.statusList[row.status].type
        this.detailForm.label = this.statusList[row.status].label
        this.detailForm.createWayLabel = this.createWayList[row.createWay].label
      })
      this.detailTitle = row.useCode
      this.detailOpen = true
    },
    // 查询分类列表
    getAssetClassify () {
      listAssetClassify().then(response => {
        this.assetClassify = this.handleTree(response.data, 'classifyId')
      })
    },
    // 查询创建方式列表
    getCreateWay () {
      getCreateWayList().then(response => {
        this.createWayList = response.data
      })
    },
    // 获取状态列表
    getUseStatusList () {
      maintenanceStatusList().then(response => {
        this.statusList = response.data
      })
    },
    // 查询资产列表
    getAssetList () {
      listAssetWithoutPage(this.assetQueryParams).then(response => {
        this.assetList = response.data
      })
    },
    // 表单重置
    reset () {
      this.form = {
        remark: undefined,
        assetSelectList: []
      }
    },
    // 新增按钮
    handleAdd () {
      this.reset()
      this.form.assetSelectList = []
      this.title = '新增领用'
      this.open = true
    },
    // 修改按钮
    handleUpdate (row) {
      this.title = '修改领用'
      this.open = true
      listMaintenanceById(row.id).then(response => {
        this.form = response.data
      })
    },
    handleAsset () {
      this.getAssetList()
      this.assetOpen = true
    },
    // 删除
    handleDelete (row) {
      this.$modal
        .confirm('是否确认删除"' + row.maintenanceUser + '"的领用数据项？')
        .then(function () {
          return delMaintenance(row.id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    // 提交
    submitForm (row) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.useCode !== undefined) {
            updateMaintenance(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMaintenance(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 取消
    cancel () {
      this.open = false
      this.reset()
    }
  }
}
</script>
