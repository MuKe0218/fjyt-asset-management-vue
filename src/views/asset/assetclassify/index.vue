<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="分类名称" prop="classifyName">
        <el-input
          v-model="queryParams.classifyName"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
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
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="classifyList"
      row-key="classifyId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="classifyName"
        label="分类名称"
        width="260"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="createUser"
        label="创建人"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateUser"
        label="修改人"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="updateTime"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- v-if="scope.row.parentId != 0" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级分类" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="classifyOptions"
                :normalizer="normalizer"
                placeholder="选择上级分类"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="classifyName">
              <el-input v-model="form.classifyName" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
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
import {listAssetClassify, addAssetClassify, updateAssetClassify, delAssetClassify, infoAssetClassify} from '@/api/asset/assetclassify'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default{
  name: 'assetclassify',
  components: {Treeselect},
  data () {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      classifyList: [],
      // 部门树选项
      classifyOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        classifyName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        classifyName: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: '上级分类不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getList()
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
    /** 查询分类列表 */
    getList () {
      this.loading = true
      listAssetClassify(this.queryParams).then(response => {
        this.classifyList = this.handleTree(response.data, 'classifyId')
        this.loading = false
      })
    },
    // 搜索按钮操作
    handleQuery () {
      this.getList()
    },
    // 重置按钮操作
    resetQuery () {
      this.resetForm('queryForm')
    },
    // 编辑按钮操作
    handleUpdate (row) {
      this.reset()
      infoAssetClassify(row.classifyId).then(response => {
        this.form = response.data
      })
      listAssetClassify().then(response => {
        this.classifyOptions = this.handleTree(response.data, 'classifyId')
      })
      this.open = true
      this.title = '编辑分类'
    },
    // 新增按钮操作
    handleAdd (row) {
      this.reset()
      this.open = true
      this.title = '新增分类'
      if (row !== undefined) {
        this.form.parentId = row.classifyId
      }
      listAssetClassify().then(response => {
        this.classifyOptions = this.handleTree(response.data, 'classifyId')
      })
    },
    // 提交按钮
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.classifyId !== undefined) {
            updateAssetClassify(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addAssetClassify(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        classifyName: undefined,
        orderNum: undefined
      }
      this.resetForm('form')
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.classifyName + '"的数据项？')
        .then(function () {
          return delAssetClassify(row.classifyId)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    }
  }
}
</script>
