<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="paramsinfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList" style="width: 100%" stripe border>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- scope.row能获取这一行所有绑定过的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="paramsinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="$refs.addformRef.resetFields()">
      <!-- 内容主体区域 -->
      <el-form ref="addformRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item> <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item> <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getUsers();
  },
  data() {
    var checkEmail=(rule,value,callback)=>{
      const regEmail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(regEmail.test(value)){
        return callback()
      }
      callback('非法的邮箱')
    }
    var checkMobile=(rule,value,callback)=>{
      const regMobile=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if(regMobile.test(value)) return callback()
      callback('手机号格式不正确')
    }
    return {
      usersList: [],
      total: 0,
      //获取用户数据请求参数
      paramsinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      addDialogVisible: false,
      //添加用户数据
      addForm: {
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:[
          
           {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          
           {validator:checkMobile,trigger:'blur'}        
        ]
      }
    };
  },
  methods: {
    async getUsers() {
      const { data: res } = await this.$http.get("users", {
        params: this.paramsinfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    //每次展示多少条数据时触发
    handleSizeChange(psize) {
      this.paramsinfo.pagesize = psize;
      this.getUsers();
    },
    //当前页面改变时触发，将当前的展示的页码值传递给data里的paramsinfo.pagenum
    handleCurrentChange(pnum) {
      this.paramsinfo.pagenum = pnum;
      this.getUsers();
    },
    //修改用户状态，向后台发送AjAX请求，修改用户的状态
    async changeState(val) {
      const { data: res } = await this.$http.put(
        `users/${val.id}/state/${val.mg_state}`
      );
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state;
        return this.$message.error("修改用户状态失败！");
      }
      this.$message.success("用户状态修改成功！");
    },
    //添加用户
    addUser(){
      //添加用户预校验
      this.$refs.addformRef.validate(async valid=>{
        if(!valid) return
        const {data:res} =await this.$http.post('users',this.addForm)
        if(res.meta.status!==201) return this.$message.error('添加失败')
        this.$message.success('添加成功！')
        this.addDialogVisible=false
        this.getUsers()
      })
    }
  }
};
</script>
<style scoped lang="less">
.el-breadcrumb {
  font-size: 14px;
  margin-bottom: 20px;
}
.el-card {
  box-shadow: 0, 1px, 1px, rgba(0, 0, 0, 0.3);
  .el-table {
    margin-top: 10px;
  }
}
.el-pagination {
  margin-top: 15px;
}
</style>