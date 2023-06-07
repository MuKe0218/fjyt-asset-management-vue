<template>
    <div class="app-container">
        <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch">
    <el-form-item label="借用单编号" prop="borrowCode">
        <el-input v-model="queryParams.borrowCode"
        placeholder="请输入借用单编号"
        clearable
        style="width: 240px"/>
    </el-form-item>
    <el-form-item label="申请人" prop="borrowName">
        <el-input v-model="queryParams.borrowName"
        placeholder="请输入申请人姓名"
        clearable
        style="width: 240px"/>
    </el-form-item>
    <el-form-item label="状态" prop="status">
        <el-select
        v-model="queryParams.status"
        placeholder="借用单状态"
        clearable
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
        clearable
        style="width: 240px">
        <el-option
        v-for="item in createWayList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="借用开始时间">
        <el-date-picker
        v-model="startDateRange"
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
    <el-form-item label="预计归还时间">
        <el-date-picker
        v-model="returnDateRange"
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
    <el-form-item label="创建时间">
        <el-date-picker
        v-model="createDateRange"
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
        <el-button
        icon="el-icon-refresh"
        size="mini"
        @click="resetQuery"
        >重置</el-button>
    </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
    <el-button
    type="primary"
    icon="el-icon-plus"
    size="mini"
    @click="handleAdd">新增</el-button>
    </el-col>
    </el-row>
    <el-table v-loading="loading" :data="assetBorrowList">
        <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope" v-if="statusList[0]">
                <el-tag
                :type="statusList[scope.row.status].type">
            {{statusList[scope.row.status].label}}
            </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="借用编号" align="center" width="150">
            <template slot-scope="scope">
                <el-link type="primary"
                @click="getBorrowDetail(scope.row)">
            {{scope.row.borrowCode }}
            </el-link>
            </template>
        </el-table-column>
        <el-table-column label="借用资产" prop="assetNames" align="center" width="150"></el-table-column>
        <el-table-column label="申请人" prop="borrowUser" align="center"  width="150"></el-table-column>
        <el-table-column label="申请时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{parseTime(scope.row.borrowTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="借用开始时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{parseTime(scope.row.borrowStartTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="预计归还时间时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{parseTime(scope.row.expectedReturnTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建方式"  align="center" width="150" >
          <template slot-scope="scope" v-if="createWayList[0]">
              {{createWayList[scope.row.createWay].label}}
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
                icon="el-icon-refresh-right"
                v-if="scope.row.status != '3'"
                @click="handleReturn(scope.row)">归还</el-button>
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
    <!-- 添加修改领用对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请人" prop="borrowUser">
                <el-input
                v-model="form.borrowUser"
                placeholder="请输入申请人"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="申请时间" prop="borrowTime">
              <el-date-picker
                v-model="form.borrowTime"
                type="date"
                placeholder="选择申请时间">
              </el-date-picker>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
            <el-form-item label="开始时间" prop="borrowStartTime">
              <el-date-picker
                v-model="form.borrowStartTime"
                type="date"
                placeholder="选择借用开始时间">
              </el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="归还时间" prop="expectedReturnTime">
              <el-date-picker
                v-model="form.expectedReturnTime"
                type="date"
                placeholder="选择预计归还时间">
              </el-date-picker>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="form.remark">
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
    <!-- 详情对话框 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="800px">
      <el-descriptions direction="vertical" :column="5" border
          >
        <el-descriptions-item
        label="领用状态"
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
          >{{detailForm.borrowUser}}</el-descriptions-item>
          <el-descriptions-item
          label="申请时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{parseTime(detailForm.borrowTime)}}</el-descriptions-item>
          <el-descriptions-item
          label="借用开始时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{parseTime(detailForm.borrowStartTime)}}</el-descriptions-item>
          <el-descriptions-item
          label="归还时间"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{parseTime(detailForm.expectedReturnTime)}}</el-descriptions-item>
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
  listBorrow,
  listBorrowById,
  borrowStatusList,
  addBorrow,
  updateBorrow,
  assetReturn,
  delBorrow
} from '@/api/asset/assetborrow'
import {listAssetWithoutPage, getCreateWayList} from '@/api/asset/assetinfo'
import {listAssetClassify} from '@/api/asset/assetclassify'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default{
  name: 'assetBorrow',
  components: {Treeselect},
  data () {
    return {
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 加载中
      loading: true,
      // 是否打开对话框
      open: false,
      // 是否打开详情对话框
      detailOpen: false,
      // 是否打开资产列表对话框
      assetOpen: false,
      // 状态list
      statusList: [],
      // 创建方式list
      createWayList: [],
      // 领用单list
      assetBorrowList: [],
      // 资产列表list
      assetList: [],
      // 分类
      assetClassify: [],
      // 借用开始时间
      startDateRange: [],
      // 预计归还时间
      returnDateRange: [],
      // 创建时间范围
      createDateRange: [],
      // 资产选择
      assetSelection: [],
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        borrowCode: undefined,
        borrowName: undefined,
        status: undefined,
        createWay: undefined
      },
      // 资产queryparams
      assetQueryParams: {
        assetName: undefined,
        classifyId: undefined,
        status: '0'
      },
      // form表单
      form: {
        assetSelectList: []
      },
      // 详情form
      detailForm: {
        type: undefined,
        label: undefined,
        createWayLabel: undefined
      },
      // 新增修改对话框标题
      title: undefined,
      // 详情对话框标题
      detailTitle: undefined,
      // form规则
      rules: {
        borrowUser: [
          {required: true, message: '申请人必填', trigger: 'blur'}
        ],
        borrowTime: [
          {required: true, message: '申请时间必填', trigger: 'blur'}
        ],
        borrowStartTime: [
          {required: true, message: '借用开始时间必填', trigger: 'blur'}
        ],
        expectedReturnTime: [
          {required: true, message: '归还时间必填', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getList()
    this.getBorrowStatusList()
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
    // 搜索按钮操作
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置按钮操作
    resetQuery () {
      this.createDateRange = []
      this.startDateRange = []
      this.returnDateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 查询领用列表
    getList () {
      this.loading = true
      this.addDateRange(this.queryParams, this.createDateRange, 'CreateTime')
      this.addDateRange(this.queryParams, this.startDateRange, 'BorrowStartTime')
      this.addDateRange(this.queryParams, this.returnDateRange, 'ExpectedReturnTime')
      listBorrow(this.queryParams).then(response => {
        this.assetBorrowList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 获取状态列表
    getBorrowStatusList () {
      borrowStatusList().then(response => {
        this.statusList = response.data
      })
    },
    // 查询资产列表
    getAssetList () {
      listAssetWithoutPage(this.assetQueryParams).then(response => {
        this.assetList = response.data
      })
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
    // 资产筛选
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
    // 点击编码获取详情
    getBorrowDetail (row) {
      this.detailOpen = true
      listBorrowById(row.id).then(response => {
        this.detailForm = response.data
        this.detailForm.type = this.statusList[row.status].type
        this.detailForm.label = this.statusList[row.status].label
        this.detailForm.createWayLabel = this.createWayList[row.createWay].label
      })
    },
    // 新增按钮操作
    handleAdd () {
      this.resetForm('form')
      this.form.assetSelectList = []
      this.title = '新增借用'
      this.open = true
    },
    // 添加领用资产
    handleAsset () {
      this.getAssetList()
      this.getAssetClassify()
      this.assetOpen = true
    },
    // 归还
    handleReturn (row) {
      assetReturn(row.id).then(response => {
        this.$modal.msgSuccess('已归还')
        this.getList()
      })
    },
    // 修改按钮操作
    handleUpdate (row) {
      this.title = '修改借用'
      this.open = true
      listBorrowById(row.id).then(response => {
        this.form = response.data
      })
    },
    // 删除按钮操作
    handleDelete (row) {
      this.$modal
        .confirm('是否确认删除"' + row.borrowUser + '"的借用数据项？')
        .then(function () {
          return delBorrow(row.id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    // 表单重置
    reset () {
      this.form = {
        borrowUser: undefined,
        borrowTime: undefined,
        borrowStartTime: undefined,
        expectedReturnTime: undefined,
        remark: undefined,
        assetSelectList: []
      }
    },
    // 添加修改确认
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.useCode !== undefined) {
            updateBorrow(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBorrow(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 添加修改取消
    cancel () {
      this.open = false
      this.reset()
    }
  }
}
</script>
