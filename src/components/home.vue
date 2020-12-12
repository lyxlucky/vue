<template>
  <!-- <el-button type="info" @click="exit">退出</el-button> -->
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <span>电商后台管理系统</span>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu :default-active="activePath" router background-color="#333744" text-color="#fff" active-text-color="#409bff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false">
          <el-submenu :index="'' + item.id" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveStatus('/' + subitem.path)" v-for="subitem in item.children" :key="item.children.id" :index="'/' + subitem.path">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        125: "el-icon-user-solid",
        103: "el-icon-s-management",
        101: "el-icon-s-shop",
        102: "el-icon-s-claim",
        145: "el-icon-s-data",
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的连接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) return $this.message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(res);
    },
    // 点击按钮实现菜单的折叠与展开
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存连接的激活状态
    saveStatus(index) {
      window.sessionStorage.setItem("activePath", index);
      this.index = this.activePath;
    },
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
