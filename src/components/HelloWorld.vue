<template>
  <div>
    <div id="app">
      <a-layout id="components-layout-demo-top-side">
        <a-layout-header class="header"> </a-layout-header>
        <a-layout-content style="padding: 0 50px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>List</a-breadcrumb-item>
            <a-breadcrumb-item>App</a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout style="padding: 24px 0; background: #fff">
            <a-layout-sider width="256" style="background: #fff">
              <a-button type="primary" @click="deptLink"> 部门管理 </a-button>
              <div>
                <a-menu style="width: 256px" mode="inline" @click="handleClick">
                  <template v-for="item in deptData">
                    <a-menu-item
                      v-if="
                        item.children == null ||
                        item.children == undefined ||
                        item.children.length === 0
                      "
                      :key="item.departmentId"
                    >
                      <a-icon type="pie-chart" />
                      <span>{{ item.name }}</span>
                    </a-menu-item>
                    <sub-menu
                      v-else
                      :key="item.departmentId"
                      :menu-info="item"
                    />
                  </template>
                </a-menu>
              </div>
            </a-layout-sider>
            <a-layout-content
              :style="{ padding: '16px 24px', minHeight: '280px' }"
            >
              <div v-if="selectDeptId != undefined" style="text-align: left; margin-bottom: 16px">
                <a-button type="primary" @click="visible = true">
                  新增用户
                </a-button>
              </div>
              <a-table
                bordered
                :columns="columns"
                :data-source="userData"
                row-key="userId"
              >
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
                <span slot="action" slot-scope="text, record">
                  <a @click="editClick(record)">Edit</a>
                  <a-divider type="vertical" />
                  <a @click="deleteClick(record)">Delete</a>
                </span>
              </a-table>
            </a-layout-content>
          </a-layout>
        </a-layout-content>
        <a-layout-footer style="text-align: center"> </a-layout-footer>
      </a-layout>
    </div>
    <a-modal
      title="用户"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <a-form-model
          ref="ruleForm"
          :rules="rules"
          :model="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-model-item ref="name" prop="name" label="Name">
            <a-input v-model="form.name" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item ref="email" prop="email" label="Email">
            <a-input v-model="form.email" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item ref="mobile" prop="mobile" label="Mobile">
            <a-input v-model="form.mobile" placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  searchDept,
  searchUser,
  addUser,
  editUser,
  deleteUser,
} from "../system.service";
import SubMenu from "./sub-menu.vue";
export default {
  name: "HelloWorld",
  components: {
    "sub-menu": SubMenu,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      selectDeptId: undefined,
      deptData: [],
      userData: [],
      columns: [
        {
          dataIndex: "name",
          key: "name",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "name" },
        },
        {
          title: "email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "mobile",
          dataIndex: "mobile",
          key: "mobile",
        },
        {
          title: "Action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      form: {
        userId: undefined,
        name: undefined,
        email: undefined,
        mobile: undefined,
        employeeType: 1,
        departmentId: undefined,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入Email",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入Mobile",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.loadDept();
    this.loadUser();
  },
  methods: {
    searchNode(item) {
      if (
        item.children == null ||
        item.children == undefined ||
        item.children.length === 0
      ) {
        return item;
      }
      return this.searchNode(item.children[0]);
    },
    deptLink() {
      this.$router.push({
        name: "dept",
      });
    },
    loadDept() {
      searchDept().then((res) => {
        this.deptData = res.data.result;
      });
    },
    handleClick(e) {
      this.selectDeptId = e.key;
      this.loadUser();
    },
    loadUser() {
      searchUser({ id: this.selectDeptId }).then((res) => {
        this.userData = res.data.result;
      });
    },
    editClick(rowData) {
      this.form.name = rowData.name;
      this.form.email = rowData.email;
      this.form.mobile = rowData.mobile;
      this.form.userId = rowData.userId;
      this.form.departmentId = rowData.departmentId;
      this.visible = true;
    },
    deleteClick(rowData) {
      deleteUser({ id: rowData.userId }).then((res) => {
        let data = res.data;
        if (data.code === "0") {
          this.loadUser();
          this.$message.success("用户`" + rowData.name + "`删除成功");
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          if (this.form.userId == undefined) {
            this.form.departmentId = this.selectDeptId;
            addUser(this.form).then((res) => {
              let data = res.data;
              if (data.code === "0") {
                this.loadUser();
                this.closeModal();
                this.confirmLoading = false;
                this.$message.success("用户新增成功");
              } else {
                this.$message.error(data.message);
              }
            });
          } else {
            editUser(this.form).then((res) => {
              let data = res.data;
              if (data.code === "0") {
                this.closeModal();
                this.loadUser();
                this.confirmLoading = false;
                this.$message.success("用户更新成功");
              } else {
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
    handleCancel() {
      this.closeModal();
    },
    closeModal() {
      this.form = {
        userId: undefined,
        name: undefined,
        email: undefined,
        mobile: undefined,
        employeeType: 1,
        departmentId: undefined,
      };
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
