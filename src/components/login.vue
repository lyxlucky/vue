<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="" srcset="">
            </div>
            <div>
                <el-form ref="loginFormRef" :model= "loginForm" :rules="rules" class="login_form">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
                        <el-button type="info"  @click="resetForm('loginFormRef')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 登陆表单的数据绑定
            loginForm:{
                username:"admin",
                password:"123456"
            },
            // 表单验证规则
            rules:{
                // 验证账号是否合法
                username:[
                    {required:true,message:"请输入用户名",trigger:'blur'},
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password:[
                    {required:true,message:"请输入密码",trigger:'blur'}
                ]
            }
        }
    },
    methods:{
         resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitForm(formName) {
        //   await 只能用在被async修饰的方法中
            this.$refs[formName].validate(async(valid) => {
                if (valid) {
                // alert('submit!');
                const {data:res} = await this.$http.post('login',this.loginForm)
                // console.log(res)
                if(res.meta.status!=200)return this.$message.error('用户名或密码错误');
                this.$message.success('登录成功');
                // 将登录成功的token保存到客户端的sessionStorage中
                //  项目中除了登录接口之外的其他api，需要登录才能访问
                //  token只应该在打开网页期间生效，所以保存到sessionStorage中
                window.sessionStorage.setItem("token",res.data.token)
                //通过编程式导航跳转到后台页面 
                this.$router.push("/home")
            } else {
                return false;
             }
        });
      },
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.avatar_box{
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>