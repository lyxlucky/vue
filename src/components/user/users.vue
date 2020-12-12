<template>
  <!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryUserInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch @change="userUpdate(scope.row)" v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="small"
              @click="showEditVisible(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="removeUserById(scope.row.id)"
              size="small"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="Top Center 提示文字"
              placement="top"
            >
              <el-button size="small" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryUserInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="queryUserInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加用户的页面 -->
    <el-dialog
      @close="addDialogClose"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-form :model="addForm" :rules="addFormRules" ref="addform" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editUserVisible" width="30%">
      <span>
        <el-form
          :model="editUserInfo"
          :rules="editUserRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名">
            <el-input :disabled="true" v-model="editUserInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button @click="editUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      }
      let regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return callback();
      } else {
        return callback(new Error("您的输入有误！"));
      }
    };
    var checkEmail = (rules, value, callback) => {
      let regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!checkEmail) {
        callback(new Error("请输入邮箱"));
      }
      if (regEmail.test(value)) {
        return callback();
      } else {
        return callback(new Error("您的输入有误"));
      }
    };
    return {
      queryUserInfo: {
        query: "",
        pagenum: 1,
        pagesize: 1,
      },
      userlist: [],
      total: 0,
      //控制添加用户框的隐藏与否
      dialogVisible: false,
      //控制修改用户的显示与否
      editUserVisible: false,
      // 添加用户
      addForm: {
        username: "",
        password: "",
        mobile: "",
        email: "",
      },
      editUserInfo: {},
      //添加用户的验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在5个字符到10个字符之间" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 20, message: "密码长度为5到20个字符之间" },
        ],
        mobile: [
          { required: true, message: "请输入手机号" },
          { validator: checkPhone, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", { params: this.queryUserInfo });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      console.log(res);
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    async showEditVisible(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200) return this.$message.error("修改用户信息失败");
      this.editUserInfo = res.data;
      this.editUserVisible = true;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryUserInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryUserInfo.pagenum = newPage;
      this.getUserList();
    },
    userUpdate(scope) {
      console.log(scope);
    },
    addDialogClose() {
      this.$refs.addform.resetFields();
    },
    addUser() {
      this.$refs.addform.validate(async (valid) => {
        if (!valid) return;
        //发起添加用户请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) return this.$message.error("添加用户失败");
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //发起添加用户请求
        const { data: res } = await this.$http.put("users/" + this.editUserInfo.id, {
          email: this.editUserInfo.email,
          mobile: this.editUserInfo.mobile,
        });
        if (res.meta.status != 200) return this.$message.error("修改用户失败");
        this.$message.success("修改成功");
        this.editUserVisible = false;
        this.getUserList();
      });
    },
    // 根据id删除
    removeUserById(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status != 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="less" scoped></style>
