<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
    <el-form-item label="资产编码" prop="assetCode" >
        <el-input
          v-model="queryParams.assetName"
          placeholder="请输入资产编码"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          v-hasPermi="['asset:info:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['asset:infp:remove']"
          >删除</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          v-hasPermi="['asset:info:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="assetList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="状态" prop="status" align="center" width="100"></el-table-column>
        <el-table-column label="资产编号"  align="center" prop="assetId" width="100" />
        <el-table-column label="资产名称"  align="center" prop="assetName" :show-overflow-tooltip="true" width="100" />
        <el-table-column label="资产图片"  align="center" prop="assetImg" :show-overflow-tooltip="true" width="100" />
        <el-table-column label="资产类别"  align="center" prop="assetClassify" width="100" />
        <el-table-column label="资产规格/型号"  align="center" prop="assetSpecifications" width="120" />
        <el-table-column label="资产计量单位"  align="center" prop="assetUnit" width="100" />
        <el-table-column label="资产金额"  align="center" prop="assetPrice" width="80" />
        <el-table-column label="资产使用/借用/报修人"  align="center" prop="assetHaveUser" width="150" />
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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['asset:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['asset:info:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 添加或修改资产对话框 -->
<el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="资产名称" prop="assetName">
          <el-input
          v-model = "form.assetName"
          placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="资产类别" prop="assetClassifyId">
          <treeselect
            v-model = "form.assetClassifyId"
            placeholder="请选择类别"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="12">
      <el-form-item label="资产规格/型号" prop="assetSpecifications">
          <el-input
          v-model = "form.assetSpecifications"
          placeholder="请输入资产规格/型号" />
        </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="资产计量单位" prop="assetUnit">
          <el-input
          v-model = "form.assetUnit"
          placeholder="请输入计量单位" />
        </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-form-item label="资产数量" prop="assetNum">
          <el-input-number v-model="form.assetNum" controls-position="right" :min="0" />
        </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="资产金额" prop="assetPrice">
          <el-input
          v-model="form.assetPrice"
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
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :auto-upload="false"
        :limit="1"
        :data="queryParams">
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
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {listAsset, addAsset, updateAsset, getStatusList} from '@/api/asset/assetinfo'
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态
      statusList: [],
      // 类别选项
      assetClassify: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assetName: undefined,
        status: undefined,
        assetCode: undefined
      },
      dialogImageUrl: '',
      dialogVisible: false,
      // 表单参数
      form: {},
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: '/api/asset/file/upload'
      },
      // 表单校验
      rules: {
        assetName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
    this.getAssetStatus()
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
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
      this.dateRange = []
      this.handleQuery()
    },
    /** 查询资产列表 */
    getList () {
      this.loading = true
      listAsset(this.queryParams).then(response => {
        this.assetList = response.rows
        this.total = response.total
        this.assetStatus = response.assetStatus
        this.loading = false
      }
      )
      listAssetClassify().then(response => {
        this.assetClassify = this.handleTree(response.data, 'classifyId')
      })
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
      this.$refs.upload.clearFiles()
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
              this.queryParams.assetCode = this.form.assetCode
              this.$refs.upload.submit()
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addAsset(this.form).then((response) => {
              this.queryParams.assetCode = response.data
              this.$refs.upload.submit()
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
