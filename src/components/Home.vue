<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="primary" @click="logout" class="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="skyblue"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path+''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <i :class="subIcon[subItem.id]"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  created() {
    this.getMenusList();
    this.activePath = window.sessionStorage.getItem("activepath");
  },
  data() {
    return {
      menusList: [],
      //表驱动法主要解决if else 或者switch太繁琐,自定义一个对象来解决
      iconsObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "102": "iconfont icon-danju",
        "101": "iconfont icon-shangpin",
        "145": "iconfont icon-baobiao"
      },
      subIcon: {
        "110": "el-icon-user",
        "111": "el-icon-s-custom",
        "112": "el-icon-s-grid",
        "104": "el-icon-s-goods",
        "115": "el-icon-s-cooperation",
        "121": "el-icon-s-release",
        "107": "el-icon-goods",
        "146": "el-icon-s-data"
      },
      collapse: false,
      activePath: ''
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenusList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败！");
      this.menusList = res.data;
    },
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    saveNavState(activepath) {
      window.sessionStorage.setItem("activepath", activepath);
      this.activePath = activepath;
    }
  }
};
</script>
<style scoped lang="less">
.el-header {
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;

    > h3 {
      font-weight: normal;
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
 
  i {
    margin-right: 5px;
  }
  .el-menu{
    border-right: none;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    letter-spacing: 2px;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
</style>