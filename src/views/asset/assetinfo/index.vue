<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
    <el-form-item label="资产编号" prop="assetCode" >
        <el-input
          v-model="queryParams.assetCode"
          placeholder="请输入资产编号"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="资产名称" prop="assetName" >
        <el-input
          v-model="queryParams.assetName"
          placeholder="请输入资产名称"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="资产类别" prop="parentId" >
        <treeselect
            v-model = "queryParams.classifyId"
            placeholder="请选择类别"
            :options = "assetClassify"
            :normalizer="normalizer"
            style="width: 240px"
          />
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-select
        v-model="queryParams.status"
          placeholder="资产状态"
          clearable
          style="width: 240px"
        >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
    </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建方式" prop="createWay" >
        <el-select
        v-model="queryParams.createWay"
          placeholder="创建方式"
          clearable
          style="width: 240px"
        >
        <el-option
          v-for="item in createWayList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="createDateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px">
    </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-date-picker
          v-model="updateDateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px">
    </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini"
        @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['asset:info:add']"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          v-hasPermi="['asset:info:export']"
          >导出</el-button
        >
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="assetList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" label="dasds"/> -->
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
          <template slot-scope="scope" >
              <el-link type="primary"
              @click="getAssetDetail(scope.row)"
              >{{scope.row.assetCode}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="200" />
        <el-table-column label="图片"  align="center" width="120">
          <template slot-scope="scope">
            <el-image
            v-if="imageBoolean"
            style="width: 100px; height: 100px"
            :src="getimgUrl(scope.row)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="类别"  align="center" prop="classifyName" width="150" />
        <el-table-column label="规格/型号"  align="center" prop="assetSpecifications" width="120" />
        <el-table-column label="计量单位"  align="center" prop="assetUnit" width="100" />
        <el-table-column label="金额"  align="center" prop="assetPrice" width="80" />
        <el-table-column label="创建方式"  align="center" prop="createWay" width="150" >
          <template slot-scope="scope" v-if="createWayList[0]">
              {{createWayList[scope.row.createWay].label}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="100"></el-table-column>
        <el-table-column label="创建人"  align="center" prop="createUser" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
        </el-table-column>
        <el-table-column label="修改人"  align="center" prop="updateUser" width="100" />
        <el-table-column label="修改时间" align="center" prop="updateTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
        <template slot-scope="scope">
              <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button>
              <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
<!-- 添加或修改资产对话框 -->
<el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="资产名称" prop="assetName">
          <el-input
          v-model = "form.assetName"
          placeholder="请输入资产名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="资产类别" prop="classifyId" >
        <treeselect
            v-model = "form.classifyId"
            placeholder="请选择类别"
            :options = "assetClassify"
            :normalizer="normalizer"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="资产状态" prop="status">
          <el-select
          v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
     </el-col>
    <el-col :span="12">
      <el-form-item label="资产规格/型号" prop="assetSpecifications">
          <el-input
          v-model = "form.assetSpecifications"
          placeholder="请输入资产规格/型号" />
        </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-form-item label="资产计量单位" prop="assetUnit">
          <el-input
          v-model = "form.assetUnit"
          placeholder="请输入计量单位" />
        </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="资产金额" prop="assetPrice">
          <el-input
          v-model ="form.assetPrice"
          placeholder="请输入资产金额" />
        </el-form-item>
    </el-col>
  </el-row>
  <el-row :span="12">
    <el-col>
      <el-form-item label="图片">
        <el-upload
        ref="upload"
        :headers="this.upload.headers"
        :action="this.upload.url"
        list-type="picture-card"
        :auto-upload="false"
        :limit="1"
        :data="this.fileData">
        <i class="el-icon-plus"></i>
      </el-upload>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-form-item label="备注">
          <el-input
          v-model="form.remark"
          type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
    </el-col>
  </el-row>
</el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="800px" append-to-body>
          <el-descriptions direction="vertical" :column="6" border
          >
         <el-descriptions-item
         label="资产状态"
         :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}">
          <el-tag
            :type = "detailForm.type"
            >
              {{detailForm.label}}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
          label="资产名称"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.assetName}}</el-descriptions-item>
          <el-descriptions-item
          label="资产类别"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.classifyName}}</el-descriptions-item>
          <el-descriptions-item
          label="资产规格/型号"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.assetSpecifications}}</el-descriptions-item>
          <el-descriptions-item
          label="资产计量单位"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.assetUnit}}</el-descriptions-item>
          <el-descriptions-item
          label="资产金额"
          :contentStyle="{'text-align': 'center'}"
          :labelStyle="{'text-align':'center'}"
          >{{detailForm.assetPrice}}</el-descriptions-item>
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
              :data="assetFlowList"
              style="width: 100%"
              height="255">
            <el-table-column label="资产流动详情"  align="center" prop="assetName"  />
          </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  listAsset,
  addAsset,
  updateAsset,
  getStatusList,
  getCreateWayList,
  listAssetById,
  delAsset
} from '@/api/asset/assetinfo'
import {listAssetClassify} from '@/api/asset/assetclassify'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default{
  name: 'assetinfo',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 资产表格数据
      assetList: [],
      // 资产流动信息list
      assetFlowList: [],
      // 弹出层标题
      title: '',
      // 详情弹出层标题
      detailTitle: '',
      // 是否显示弹出层
      open: false,
      // 是否显示详情弹出层
      detailOpen: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 创建日期范围
      createDateRange: [],
      // 修改日期范围
      updateDateRange: [],
      // 状态
      statusList: [],
      tagType: undefined,
      // tagColour: '',
      value: undefined,
      // 创建方式
      createWayList: [],
      // 类别选项
      assetClassify: [],
      // 文件附带参数
      fileData: {
        assetCode: undefined
      },
      imageBoolean: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        assetName: undefined,
        status: undefined,
        assetCode: undefined,
        classifyId: undefined,
        createWay: undefined
      },
      // 表单参数
      form: {},
      // 详情表单参数
      detailForm: {
        type: undefined,
        label: undefined,
        createWayLabel: undefined
      },
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: '/api/asset/file/upload'
      },
      // 表单校验
      rules: {
        assetName: [
          { required: true, message: '资产名称不能为空', trigger: 'blur' }
        ],
        classifyId: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        assetPrice: [
          { required: true, message: '资产金额不能为空', trigger: 'blur' }
          // eslint-disable-next-line standard/object-curly-even-spacing
          // { type: 'number', message: '资产金额必须为数字值'}
        ]
      },
      url: ''
    }
  },
  created () {
    this.getList()
    this.getAssetStatus()
    this.getAssetClassify()
    this.getCreateWay()
  },
  methods: {
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
    getimgUrl (row) {
      return '/api/asset/file/' + row.assetCode
    },
    /** 获取资产详情 */
    getAssetDetail (row) {
      listAssetById(row.id).then(response => {
        this.detailForm = response.data
        this.detailForm.type = this.statusList[row.status].type
        this.detailForm.label = this.statusList[row.status].label
        this.detailForm.createWayLabel = this.createWayList[row.createWay].label
      })
      this.detailTitle = row.assetCode
      this.detailOpen = true
    },
    /** 查询资产状态列表 */
    getAssetStatus () {
      getStatusList().then(response => {
        this.statusList = response.data
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
    /** 搜索按钮操作 */
    handleQuery () {
      this.imageBoolean = false
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.createDateRange = []
      this.updateDateRange = []
      this.queryParams.classifyId = undefined
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 查询资产列表 */
    getList () {
      this.loading = true
      this.addDateRange(this.queryParams, this.createDateRange, 'CreateTime')
      this.addDateRange(this.queryParams, this.updateDateRange, 'UpdateTime')
      listAsset(this.queryParams).then(response => {
        this.assetList = response.rows
        this.total = response.total
        this.loading = false
        this.imageBoolean = true
      }
      )
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.title = '新增资产'
    },
    // 编辑按钮操作
    handleUpdate (row) {
      this.reset()
      listAssetById(row.id).then(response => {
        this.form = response.data
      })
      this.open = true
      this.title = '编辑分类'
      this.imageBoolean = false
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.assetName + '"的数据项？')
        .then(function () {
          return delAsset(row.id)
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
        assetId: undefined,
        assetName: undefined,
        assetClassifyId: undefined,
        assetSpecifications: undefined,
        assetUnit: undefined,
        assetNum: undefined,
        assetPrice: undefined,
        remark: undefined
      }
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.assetCode !== undefined) {
            updateAsset(this.form).then((response) => {
              this.fileData.assetCode = this.form.assetCode
              this.$refs.upload.submit()
              this.$refs.upload.clearFiles()
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addAsset(this.form).then((response) => {
              this.fileData.assetCode = response.data
              this.$refs.upload.submit()
              this.$refs.upload.clearFiles()
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    }
  }
}
</script>
