<doc>
  @desc:   访客登录、信息提交
  @author: justJokee
</doc>
<template>
  <div class="submit">
    <div class="submit__avatar">
      <div class="submit__avatar-default">
        <i class="el-icon-user"></i>
      </div>
      <div class="submit__avatar-rel"></div>
    </div>
    <div class="submit__content">
      <div class="submit__input">
        <el-input type="textarea" :rows="3" placeholder="说点什么" @focus="focus" v-model="comment"></el-input>
      </div>
      <div class="submit__handle">
        <div class="submit__emoji"></div>
        <div class="submit__btn">
          <el-button size="medium">提交</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="登录" :visible.sync="dialogVisible" width="30%">
      <div class="submit__login">
        <el-form label-width="80px" :model="submitInfo">
          <el-form-item label="昵称">
            <el-input v-model="submitInfo.name" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="submitInfo.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="网址">
            <el-input v-model="submitInfo.link" placeholder="请输入你的主页"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit__register">
          <el-button size="small" type="primary">注册</el-button>
        </div>
        <div class="submit__third-part">
          <div class="line">第三方登录</div>
          <div class="submit__third-app">
            <a
              href="javascript: void(0)"
              onclick="return window.open('https://graph.qq.com/oauth2.0/authorize?client_id=&response_type=token&scope=all&redirect_uri=https://www.mapblog.cn/qc_back.html', 'oauth2Login_10000' ,'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');"
              class="login-qq"
            >
              <img src="/img/qq.png" alt="QQ登录" />
            </a>
            <a href="javascript: void(0)" class="login-github" @click="login">
              <img src="/img/github.png" alt="github登录" />
            </a>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import note from '@/components/note/'

export default {
  name: 'submit',
  components: {
    note
  },
  data() {
    return {
      comment: '',
      dialogVisible: false,
      submitInfo: {
        name: '',
        email: '',
        link: ''
      }
    }
  },
  mounted() {
    this.initQQ()
  },
  methods: {
    login() {
      window.open(
        'http://localhost:6180/login/git',
        '_blank',
        'height=600,width=800,toolbar=no, menubar=no, scrollbars=no'
      )
    },
    initQQ() {
      QC.Login({}, (info, opts) => {
        // 获取opeId accessToken
        QC.Login.getMe((openId, accessToken) => {
          // 存储
        })
      })
    },
    focus() {
      // alert(33)
      this.dialogVisible = true
      console.log(333)
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.submit {
  display: flex;
  margin-top: 24px;
  &__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    @include themeify() {
      color: themed('color-avatar-icon');
      background: themed('color-avatar-bg');
    }
    &-default {
      @include flex-box-center;
      width: 100%;
      height: 100%;
      .el-icon-user {
        font-size: 42px;
      }
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    margin-left: 18px;
  }
  &__handle {
    @include flex-box-space;
    padding: 12px 0;
  }
  &__input {
    width: 100%;
  }
  &__login {
    padding: 0 30px 0 0;
  }
  &__register {
    text-align: right;
  }
  &__third-part {
    .line {
      color: #b9b9b9;
      margin: 15px 0;
      font-size: 10px;
      text-align: center;
    }
  }
  &__third-app {
    display: flex;
    justify-content: center;
    a {
      display: inline-block;
      width: 50px;
      height: 50px;
      margin: 20px;
    }
    img {
      border: none;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
