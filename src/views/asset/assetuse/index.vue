<template>
    <div class="app-container">
        <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch">
    <el-form-item label="领用单编号" >
        <el-input v-model="queryParams.useCode"
        placeholder="请输入领用单编号"
        clearable
        style="width: 240px"/>
    </el-form-item>
    <el-form-item label="申请人">
        <el-input v-model="queryParams.useName"
        placeholder="请输入申请人姓名"
        clearable
        style="width: 240px"/>
    </el-form-item>
    <el-form-item label="状态">
        <el-select
        v-model="queryParams.status"
        placeholder="领用单状态"
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
    <el-form-item label="创建方式" >
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
    <el-form-item label="申请时间">
        <el-date-picker
        v-model="useDateRange"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholde="开始日期"
        end-placeholde="结束日期"
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
        start-placeholde="开始日期"
        end-placeholde="结束日期"
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
    <el-table v-loading="loading" :data="assetUseList">
        <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope" v-if="statusList[0]">
                <el-tag
                :type="statusList[scope.row.status].type">
            {{statusList[scope.row.status].label}}
            </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="领用编号" align="center" width="150">
            <template slot-scope="scope">
                <el-link type="primary"
                @click="getUseSetail(scope.row)">
            {{scope.row.useCode }}
            </el-link>
            </template>
        </el-table-column>
        <el-table-column label="领用资产" prop="assetName" align="center" width="150"></el-table-column>
        <el-table-column label="申请人" prop="useUser" align="center"  width="150"></el-table-column>
        <el-table-column label="申请时间" align="center" width="150">
            <template slot-scope="scope">
                <span>{{parseTime(scope.row.useTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建方式"  align="center" width="150" >
          <template slot-scope="scope" v-if="createWayList[0]">
              {{createWayList[scope.row.createWay].label}}
          </template>
        </el-table-column>
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
        <el-table-column label="操作" align="center" width="200">
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
    <!-- 添加修改领用对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        </el-form>
    </el-dialog>
    <!-- 详情对话框 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="800px">
    </el-dialog>
    </div>
</template>

<script>
export default{
  name: 'assetuse',
  data () {
    return {
      // 显示搜索条件
      showSearch: true,
      // 加载中
      loading: true,
      // 是否打开对话框
      open: false,
      // 是否打开详情对话框
      detailOpen: false,
      // 状态list
      statusList: [],
      // 创建方式list
      createWayList: [],
      // 领用单list
      assetUseList: [],
      // 领用单申请时间
      useDateRange: [],
      // 创建时间范围
      createDateRange: [],
      // 查询条件
      queryParams: {
        useCode: undefined,
        status: undefined,
        createWay: undefined,
        useName: undefined
      },
      // form表单
      form: {},
      // 新增修改对话框标题
      title: undefined,
      // 详情对话框标题
      detailTitle: undefined,
      // form规则
      rules: {}
    }
  },
  created () {

  },
  methods: {
    // 搜索按钮操作
    handleQuery () {
    },
    // 重置按钮操作
    resetQuery () {
      this.createDateRange = []
      this.resetForm('queryForm')
    },
    // 查询领用列表
    getList () {
      this.loading = true
      this.addDateRange(this.queryParams, this.useDateRange, 'useTime')
      this.addDateRange(this.queryParams, this.createDateRange, 'CreateTime')
    },
    // 新增按钮操作
    handleAdd () {
      this.title = '新增领用'
      this.open = true
    },
    // 修改按钮操作
    handleUpdate (row) {
      this.title = '修改领用'
      this.open = true
    },
    // 删除按钮操作
    handleDelete (row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.useName + '"的数据项？')
        .then(function () {
          return null
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
