<template>
  <div class="login">
    <div class="title">企业售后问题数字化管理系统</div>
    <el-form :model="employeeForm" status-icon :rules="rules" ref="employeeForm" label-width="50px">
      <el-form-item label="账户" prop="employeeUsername">
        <el-input type="text" v-model.trim="employeeForm.employeeUsername"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="employeePassword">
        <el-input type="password" v-model="employeeForm.employeePassword"></el-input>
      </el-form-item>
      <el-form-item class="bottom" style="text-align: center;padding-right: 50px;">
        <el-button type="primary" style="width: 350px;" @click="login('employeeForm')">登录</el-button>
        <el-link :underline="false" @click="resetPassword"
          style="text-align: center;color:rgb(18, 131, 186);margin-left: 40px;">已有账号，忘记密码？</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  name: "My-Login",
  data() {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账户不能为空'));
      } else {
        this.$http.get(
          `/employee/checkUsername/${value}`, 
        ).then(
          response => {
            let isExist = response.data.isSuccess;
            console.log(isExist);
            if(isExist){
              callback();
            }else{
              callback(new Error('该账户不存在'));
            }
          }
        )
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        if (this.isCorrect) {
          callback(new Error('密码不能为空'));
        } else {
          this.isCorrect = true;
          callback(new Error('密码错误'));
        }
      }else{
        callback();
      }
    };
    return {
      isCorrect: true,
      employeeForm: {
        employeeUsername: '',
        employeePassword: '',
      },
      rules: {
        employeeUsername: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        employeePassword: [
          { validator: validatePass, trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(['CHANGEMANAGE']),
    resetPassword() {
      this.$router.push({
        name: 'password',
      })
    },
    login(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$http.post(
            "/employee/login",
            this.employeeForm
          ).then(
            response => {
              let username = response.data.message;
              let token = response.data.token;
              if (response.data.isSuccess) {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('username', username );
                axios.get(
                  `http://localhost:8080/lone/employee/${username}`
                ).then(
                  response => {
                    this.CHANGEMANAGE(response.data.isManage)
                  }
                )
                this.$router.push({
                  name: "home"
                })
              } else {
                this.isCorrect = false;
                this.employeeForm.employeePassword = '';
              }
            }
          )
        }

      })

    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  margin: 15px 0px;
}

.login {
  position: absolute;
  height: 250px;
  width: 400px;
  background-color: white;
  left: calc(50% - 250px);
  top: calc(50% - 150px);
  padding: 30px;
}

.bottom {
  padding-right: 50px;
  margin: 0px auto;
}
</style>