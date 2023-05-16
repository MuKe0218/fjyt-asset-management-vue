
<template>
    <div class="app-container">
        <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true">
        <el-form-item label="仓库名称">
            <el-input
            v-model="queryParams.warehouseName"
            placeholder="请输入仓库名称"
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
    <!-- 新增仓库按钮 -->
    <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
    <el-button
    type="primary"
    icon="el-icon-plus"
    size="mini"
    @click="handleAdd">新增</el-button>
    </el-col>
    </el-row>
    <!-- 仓库信息列表 -->
    <el-table v-loading="loading" :data="warehouseList">
        <el-table-column label="仓库编码" prop="warehouseCode" align="center" width="150">
        </el-table-column>
        <el-table-column label="仓库名称" prop="warehouseName" align="center" width="150">
        </el-table-column>
        <el-table-column label="仓库位置" prop="address" align="center" width="320">
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" width="320">
        </el-table-column>
        <el-table-column label="仓库状态" align="center" width="150">
          <template slot-scope="scope">
            <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(scope.row)">
            </el-switch>
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
    <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
        />
    <!-- 新增修改仓库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
            <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
                <el-input
                v-model="form.warehouseName"
                placeholder="请输入仓库名称">
            </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="省份" prop="provinceId">
                <el-select v-model="form.provinceId" filterable placeholder="请选择">
                <el-option
                v-for="item in provinceOption"
                :key="item.provinceId"
                :label="item.name"
                :value="item.provinceId">
                </el-option>
            </el-select>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            <el-form-item label="城市" prop="cityId">
                <el-select v-model="form.cityId" filterable placeholder="请选择">
                <el-option
                v-for="item in cityOption"
                :key="item.cityId"
                :label="item.name"
                :value="item.cityId">
                </el-option>
            </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="区县" prop="countyId">
                <el-select v-model="form.countyId" filterable placeholder="请选择">
                <el-option
                v-for="item in countyOption"
                :key="item.countyId"
                :label="item.name"
                :value="item.countyId">
                </el-option>
            </el-select>
            </el-form-item>
           </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              <el-form-item label="具体位置" prop="specificPosition">
                <el-input
                  type="textarea"
                  :rows="1"
                  placeholder="请具体位置"
                  v-model="form.specificPosition">
                </el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  v-model="form.remark">
                </el-input>
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
import {
  listWarehouse,
  warehouseById,
  changeStatus,
  addWarehouse,
  updateWarehouse,
  delWarehouse
} from '@/api/inventory/warehouse'
import {getProvince, getCity, getCounty} from '@/api/address'
export default {
  name: 'warehouse',
  data () {
    return {
      // 总条数
      total: 0,
      // 是否加载
      loading: true,
      // 是否打开对话框
      open: false,
      // 搜索条件
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 省份条件
      provinceQueryParams: {},
      // 城市条件
      cityQueryParams: {},
      // 区县条件
      countyQueryParams: {},
      // 仓库列表
      warehouseList: [],
      // 状态list
      statusList: [],
      // 新增修改form
      form: {},
      // 对话框标题
      title: '',
      // 省份选择列表
      provinceOption: [],
      // 城市选择列表
      cityOption: [],
      // 区县
      countyOption: [],
      // 规则
      rules: {
        warehouseName: [
          {required: true, message: '仓库名称不能为空', trigger: 'blur'}
        ],
        provinceId: [
          {required: true, message: '省份不能为空', trigger: 'blur'}
        ],
        cityId: [
          {required: true, message: '城市不能为空', trigger: 'blur'}
        ],
        countyId: [
          {required: true, message: '区县不能为空', trigger: 'blur'}
        ],
        specificPosition: [
          {required: true, message: '具体地址不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    // 监听省级
    'form.provinceId': {
      handler (provinceId) {
        this.cityOption = []
        this.countyOption = []
        this.cityQueryParams.provinceId = provinceId
        this.getCity(this.cityQueryParams)
      }
    },
    // 监听市级
    'form.cityId': {
      handler (cityId) {
        this.countyOption = []
        this.countyQueryParams.cityId = cityId
        this.getCounty(this.countyQueryParams)
      }
    }
  },
  created () {
    this.getList()
    this.getProvince()
  },
  methods: {
    // 搜索
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 获取仓库列表
    getList () {
      listWarehouse(this.queryParams).then(response => {
        this.warehouseList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 获取仓库详情
    getDetail (row) {
      warehouseById(row.id).then(response => {
        this.form = response.data
      })
    },
    // 获取省份
    getProvince () {
      getProvince(this.provinceQueryParams).then(response => {
        this.provinceOption = response.data
      })
    },
    // 获取城市
    getCity () {
      getCity(this.cityQueryParams).then(response => {
        this.cityOption = response.data
      })
    },
    // 获取区县
    getCounty () {
      getCounty(this.countyQueryParams).then(response => {
        this.countyOption = response.data
      })
    },
    // 仓库新增按钮
    handleAdd () {
      this.reset()
      this.open = true
      this.title = '新增仓库'
    },
    // 修改按钮
    handleUpdate (row) {
      this.getDetail(row)
      this.open = true
      this.title = '修改仓库'
    },
    // 修改状态
    handleStatusChange (row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + row.warehouseName + '"仓库吗？').then(function () {
        return changeStatus(row.id, row.status)
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(function () {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 删除按钮
    handleDelete (row) {
      this.$modal
        .confirm('是否确认删除"' + row.warehouseName + '"仓库')
        .then(function () {
          return delWarehouse(row.id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },

    // 确定按钮
    submitForm () {
      console.log(this.form.warehouseCode)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.warehouseCode !== undefined) {
            updateWarehouse(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addWarehouse(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 重置
    reset () {
      this.form = {
        id: undefined,
        warehouseCode: undefined,
        warehouseName: undefined,
        provinceId: undefined,
        cityId: undefined,
        countyId: undefined,
        specificPosition: undefined,
        remark: undefined
      }
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    }
  }
}
</script>
