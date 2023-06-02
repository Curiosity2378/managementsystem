<template>
  <div class="login">
    <div class="title">企业售后问题数字化管理系统</div>
    <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="75px">
      <el-form-item label="邮箱" prop="employeeEmail">
        <el-input type="text" v-model="passwordForm.employeeEmail"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="employeePassword">
        <el-input type="password" v-model="passwordForm.employeePassword"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <el-input type="text" v-model="passwordForm.verifyCode" style="width:200px;margin-right:13px;"></el-input>
        <el-button type="primary" @click="sendCode('passwordForm')">发送验证码</el-button>
      </el-form-item>
      <el-form-item style="text-align: center;margin-right: 100px;" label-width="0px">
        <el-button type="primary" style="width: 400px" @click="resetPassword">找回密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "My-Password",
  data() {
    var validateMail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱不能为空'));
      } else {
        callback()
      }
    };
    var validateCode = (rule, value, callback) => {
      if (this.isTrue) {
        if (value === '') {
          callback(new Error('验证码不能为空'));
        } else if (!this.isSuccess) {
          this.isSuccess = true;
          callback(new Error('验证码错误'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    var validateNewword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.passwordForm.employeePassword !== '') {
          this.$refs.passwordForm.validateField('employeePassword');
        }
        callback();
      }
    };
    return {
      isSuccess: true,
      isTrue: false,
      passwordForm: {
        employeeEmail: '',
        verifyCode: '',
        newPassword: '',
        employeePassword: ''
      },
      rules: {
        employeeEmail: [
          { validator: validateMail, trigger: 'blur' }
        ],
        verifyCode: [
          { validator: validateCode, trigger: 'blur' },
        ],
        newPassword: [
          { validator: validateNewword, trigger: 'blur' }
        ],
        employeePassword: [
          { validator: validatePassword, trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    sendSuccess() {
      this.$message({
        message: '验证码已发送',
        type: 'success',
        center: true
      });
    },
    sendCode(passwordForm) {
      let mail = this.passwordForm.employeeEmail;
      this.$refs[passwordForm].validate((valid) => {
        if (valid) {
          axios.get(
            `http://localhost:8080/lone/email/${mail}`
          ).then(
            response => {
              if (response.data) {
                console.log(response.data);
                this.sendSuccess()
              }
            }
          )
        }
      })
    },
    resetPassword() {
      let code = this.passwordForm.verifyCode;
      this.isTrue = true;
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          axios.post(
            `http://localhost:8080/lone/employee/${code}`,
            this.passwordForm
          ).then(
            response => {
              if (response.data) {
                this.$router.replace({
                  name: 'login',
                })
              } else {
                this.isSuccess = false;
                this.$refs['passwordForm'].validateField('verifyCode');
              }
            }
          )
        }
      })
      this.isTrue = false;
    },
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
  height: 350px;
  width: 400px;
  background-color: white;
  left: calc(50% - 250px);
  top: calc(50% - 250px);
  padding: 30px;
}
</style>