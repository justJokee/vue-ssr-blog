<doc>
  @desc:   访客登录、信息提交
  @author: justJokee
</doc>
<template>
  <div class="submit">
    <div class="submit__avatar">
      <div class="submit__avatar-default">
        <img v-show="!!visitorInfo.imgUrl" :src="visitorInfo.imgUrl" :title="visitorInfo.name" />
        <i v-show="!visitorInfo.imgUrl" class="el-icon-user" :title="visitorInfo.name"></i>
      </div>
      <div class="submit__avatar-rel"></div>
    </div>
    <div class="submit__content">
      <div class="submit__input">
        <span v-if="currentReplyMessage.name" class="reply-name">回复 {{ currentReplyMessage.name }} :</span>
        <el-input
          ref="comment"
          type="textarea"
          :rows="3"
          placeholder="说点什么"
          @focus="focus"
          v-model="comment"
        ></el-input>
      </div>
      <div class="submit__handle">
        <div class="submit__emoji-userTag">
          <div class="submit__emoji">
            <emoji @getEmoji="getEmoji"></emoji>
          </div>
          <div class="submit__userTag" v-show="visitorInfo.name">
            <span>欢迎，{{ visitorInfo.name }}</span>
            <i class="el-icon-circle-close" title="退出" @click="logout"></i>
          </div>
        </div>

        <div class="submit__btn">
          <el-button v-if="currentReplyMessage._id" size="medium" @click="cancelReply">取消</el-button>
          <el-button size="medium" :disabled="!visitorInfo._id" @click="submitMessage">提交</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="登录" :visible.sync="customVisible" width="30%" custom-class="visitor-submit-box">
      <div class="submit__login">
        <el-form label-width="60px" :model="customInfo" :rules="submitRules" ref="customForm">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="customInfo.name" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="customInfo.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="网址" prop="link">
            <el-input v-model="customInfo.link" placeholder="请输入你的主页 例如：https://awesome.me"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit__register">
          <el-button size="small" type="primary" @click="register">注册</el-button>
        </div>
        <div class="submit__third-part">
          <div class="line">第三方登录</div>
          <div class="submit__third-app">
            <a href="javascript: void(0)" @click="openQQ" class="login-qq">
              <img src="/img/qq.png" alt="QQ登录" />
            </a>
            <a href="javascript: void(0)" class="login-github" @click="openGithub">
              <img src="/img/github.png" alt="github登录" />
            </a>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="信息完善"
      width="30%"
      :visible.sync="perfectVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="visitor-submit-box"
    >
      <div class="submit__perfect">
        <el-form label-width="80px" :model="perfect" :rules="submitRules" ref="perfectForm">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="perfect.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="网址" prop="link">
            <el-input
              v-model="perfect.link"
              placeholder="请输入你的主页 例如：https://awesome.me"
              prop="link"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="submit__perfect-footer">
          <el-button type="primary" size="small" @click="submitPerfect">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { storage } from '@/utils/storage'
import emoji from '@/components/emoji'

export default {
  name: 'submit',
  props: {
    currentReplyMessage: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    emoji
  },
  data() {
    const nameValidator = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,16}$/gi
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else if (!reg.test(value)) {
        callback(new Error('昵称支持中英文、数字、下划线的组合，限16位'))
      } else {
        callback()
      }
    }
    return {
      comment: '',
      customVisible: false,
      perfectVisible: false,
      customInfo: {
        name: '',
        email: '',
        link: ''
      },
      perfect: {
        email: '',
        link: ''
      },
      tempInfo: {},
      submitRules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }],
        email: [{ type: 'email', required: true, message: '请填写邮箱', trigger: 'blur' }],
        link: [{ type: 'url', required: false, message: '请输入合法地址' }]
      }
    }
  },
  mounted() {
    this.handleQQCb()
    this.addMessageListener()
  },
  computed: {
    ...mapState(['visitorInfo'])
  },
  methods: {
    ...mapMutations(['setVisitor']),
    openGithub() {
      // TODO: 环境变量 BASE_URL
      const BASE_URL = process.env.BASE_URL
      window.open(`${BASE_URL}/login/git`, '_blank', 'height=600,width=800,toolbar=no, menubar=no, scrollbars=no')
    },
    openQQ() {
      // return
      // this.qq_win = window.open(
      //   'https://graph.qq.com/oauth2.0/authorize?client_id=&response_type=token&scope=all&redirect_uri=https://www.mapblog.cn/qc_back.html',
      //   'oauth2Login_10000',
      //   'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes'
      // )
      QC.Login.showPopup({
        appId: '101999089',
        redirectURI: 'https://mapblog.cn/qc_back.html'
      })
    },
    register() {
      this.$refs.customForm.validate(async (valid) => {
        if (valid) {
          const res = await this.$api.saveVisitor({
            ...this.customInfo,
            imgUrl: '/img/avatar/avatar.jpeg',
            type: 0
          })

          if (res.status === 200) {
            this.setVisitorInfo(res.data)
            this.customVisible = false
            this.customInfo = {
              name: '',
              email: '',
              link: ''
            }
          }
        }
      })
    },
    submitPerfect() {
      this.$refs.perfectForm.validate(async (valid) => {
        if (valid) {
          const res = await this.$api.saveVisitor({
            ...this.tempInfo,
            ...this.perfect,
            date: new Date()
          })
          if (res.status === 200) {
            this.setVisitorInfo(res.data)
            this.perfect = {
              email: '',
              link: ''
            }
            this.tempInfo = {}
            this.perfectVisible = false
          }
        }
      })
    },
    addMessageListener() {
      window.addEventListener('message', this.handleGithubCb, false)
    },
    handleQQCb() {
      /**
       *  oInfo：{
            "ret":0,
            "msg":"",
            "nickname":"遲來の垨堠",
            "figureurl":"http://qzapp.qlogo.cn/qzapp/100229030/ECCC463F76A2E3C1D9217BBC30418164/30",
            "figureurl_1":"http://qzapp.qlogo.cn/qzapp/100229030/ECCC463F76A2E3C1D9217BBC30418164/50",
            "figureurl_2":"http://qzapp.qlogo.cn/qzapp/100229030/ECCC463F76A2E3C1D9217BBC30418164/100",
            "gender":"男",
            "vip":"1",
            "level":"7"
          }
       */

      QC.Login({}, (info, opts) => {
        console.log('QQ Callback--->>>>>', info, opts)
        // 获取opeId accessToken
        QC.Login.getMe(async (openId, accessToken) => {
          console.log('QQ Callback--->>>>>', openId, accessToken)

          // 查看QQ用户是否被存储了
          const res = await this.$api.isExistedVisitor({
            name: info.nickname,
            imgUrl: info.figureurl_qq || info.figureurl_2,
            qqOpenId: openId,
            type: 1
          })

          if (res.status === 200) {
            if (res.data._saved) {
              this.setVisitorInfo(res.data.info)
              this.customVisible = false
            } else {
              // 存储
              this.tempInfo = {
                name: info.nickname,
                imgUrl: info.figureurl_2,
                type: 1,
                qqOpenId: openId
              }
              this.customVisible = false
              this.perfectVisible = true
            }
          }
        })
      })
    },
    handleGithubCb(e) {
      if (e.data.type === 'github') {
        console.log('github登陆成功=====>>>>', e.data.data, 'isSaved::::', e.data.data._saved)
        // 此用户已登陆过
        if (e.data.data._saved) {
          delete e.data.data._saved
          // 初始化访客信息
          this.setVisitorInfo(e.data.data)
          this.customVisible = false
        } else {
          const info = e.data.data
          this.tempInfo = {
            name: info.login,
            imgUrl: info.avatar_url,
            type: 2,
            githubId: info.id
          }
          this.customVisible = false
          this.perfectVisible = true
        }
      }
    },
    setVisitorInfo(info) {
      this.setVisitor(info)
      storage.setVisitor(info)
    },
    submitMessage() {
      if (this.comment.trim() === '') {
        this.$message({
          type: 'warning',
          message: 'Oops 至少得说两句~'
        })
        return
      }
      this.$emit('submitContent', this.comment.trim(), () => {
        this.comment = ''
      })
    },
    cancelReply() {
      this.$emit('changeCurrentReplyMessage', {})
    },
    logout() {
      this.setVisitor({})
      storage.removeVisitor()
    },
    focus() {
      if (!storage.getVisitor()) this.customVisible = true
    },
    getEmoji(emoji) {
      this.$refs.comment.focus()
      this.comment += emoji
    }
  },
  destroyed() {
    window.removeEventListener('message', this.handleGithubCb)
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
      img {
        width: 100%;
        height: 100%;
        border-radius: 50% 50%;
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
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
  }
  &__emoji-userTag {
    display: flex;
    align-items: flex-start;
  }
  &__userTag {
    margin-left: 28px;
    color: #909399;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all ease 0.38s;
    .el-icon-circle-close {
      margin-left: 8px;
      font-size: 16px;
      opacity: 0;
      transition: all ease 0.38s;
    }
  }

  &__userTag:hover {
    color: #409eff;
    .el-icon-circle-close {
      opacity: 1;
    }
  }
  &__input {
    width: 100%;
    .reply-name {
      display: inline-block;
      margin-bottom: 4px;
    }
  }
  &__login {
    padding: 0 20px 0 0;
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
  &__perfect {
    padding: 0 20px 0 0;
  }
  &__perfect-footer {
    text-align: right;
  }
}
.visitor-submit-box {
  min-width: 340px;
}
</style>
