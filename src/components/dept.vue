<template>
  <div class="dept-mg">
    <div>
      <a-button type="primary" class="button" @click="visible = true">
        新增部门
      </a-button>
      <a-button type="dashed" class="button" @click="back">
        返回上一页
      </a-button>
      <a-table
        class="table"
        bordered
        :columns="columns"
        :data-source="deptData"
        row-key="departmentId"
      >
        <template slot="action" slot-scope="text, record">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>新增部门</span>
            </template>
            <a-button
              class="icon-button"
              type="primary"
              shape="circle"
              icon="plus"
              @click="addClick(record)"
            />
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>修改部门</span>
            </template>
            <a-button
              class="icon-button"
              type="primary"
              shape="circle"
              icon="edit"
              @click="editClick(record)"
            />
          </a-tooltip>

          <a-tooltip placement="bottom">
            <template slot="title">
              <span>删除部门</span>
            </template>
            <a-button
              class="icon-button"
              type="primary"
              shape="circle"
              icon="delete"
              @click="deleteClick(record)"
            />
          </a-tooltip>
        </template>
      </a-table>
    </div>

    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="onSubmit"
      @cancel="closeModal"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="上级部门">
          <a-tree-select
            v-model="form.parentDepartmentId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptData"
            :replaceFields="{
              children: 'children',
              title: 'name',
              key: 'departmentId',
              value: 'departmentId',
            }"
            placeholder="请选择"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item ref="name" label="部门名称" prop="name">
          <a-input
            v-model="form.name"
            placeholder="请输入"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  addDept,
  searchDept,
  editDept,
  deleteDept,
} from "../system.service.js";
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formLayout: "horizontal",
      form: {
        name: undefined,
        departmentId: undefined,
        parentDepartmentId: undefined,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "长度大小 1 到 20",
            trigger: "blur",
          },
        ],
      },
      columns: [
        {
          title: "部门名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "部门ID",
          dataIndex: "departmentId",
          key: "departmentId",
        },
        {
          title: "Action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      deptData: [],
      expandedRowKeys: [],
    };
  },
  created() {
    this.loadDeptData();
  },
  methods: {
    back() {
      this.$router.back();
    },

    loadDeptData() {
      searchDept().then((res) => {
        this.deptData = res.data.result;
      });
    },

    closeModal() {
      this.visible = false;
      this.form.parentDepartmentId = undefined;
      this.form.departmentId = undefined;
      this.form.name = undefined;
      this.$refs.ruleForm.resetFields();
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          if (this.form.departmentId == undefined) {
            addDept(this.form).then((res) => {
              let data = res.data;
              if (data.code === "0") {
                this.loadDeptData()
                this.closeModal();
                this.confirmLoading = false;
                this.$message.success("部门新增成功");
              } else {
                this.confirmLoading = false;
                this.$message.error(data.message);
              }
            });
          } else {
            editDept(this.form).then((res) => {
              let data = res.data;
              if (data.code === "0") {
                this.closeModal();
                this.loadDeptData();
                this.confirmLoading = false;
                this.$message.success("部门更新成功");
              } else {
                this.confirmLoading = false;
                this.$message.error(data.message);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addClick(rowData) {
      this.form.parentDepartmentId = rowData.departmentId;
      this.visible = true;
    },
    editClick(rowData) {
      this.form.parentDepartmentId = rowData.parentDepartmentId;
      this.form.departmentId = rowData.departmentId;
      this.form.name = rowData.name;
      this.visible = true;
    },
    deleteClick(rowData) {
      deleteDept({ id: rowData.departmentId }).then((res) => {
        let data = res.data;
        if (data.code === "0") {
          this.loadDeptData();
          this.$message.success("部门`" + rowData.name + "`删除成功");
        } else {
          this.$message.error(data.message);
        }
      });
    },
  },
};
</script>

<style scoped>
.dept-mg {
  padding: 64px;
}
.button {
  margin-right: 10px;
}

.table {
  margin-top: 16px;
}

.icon-button {
  margin-right: 10px;
}
</style>
