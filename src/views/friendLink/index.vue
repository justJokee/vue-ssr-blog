<doc>
  @desc:   友链
  @author: friendLink 
</doc>
<template>
  <div class="friend">
    <layout _title="友链" cover="/img/cover/friendLink.jpg">
      <div class="friend-content" v-for="group in friendList" :key="group._id">
        <div class="friend-content-tip">{{ group.name }}</div>
        <ul class="friend-content-list" v-for="friend in group.friendLinkList" :key="friend._id">
          <li class="friend-content-list-item">
            <a class="link-item-inner effect-apollo" :href="friend.siteLink" :title="friend.siteName" target="_blank">
              <img class="lazyLoaded" :data-src="friend.siteAvatar" :src="friend.siteAvatar" onerror="imgError(this)" />
              <span class="siteName">{{ friend.siteName }}</span>
              <div class="linkDes">{{ friend.siteDescribe }}</div>
            </a>
          </li>
        </ul>
      </div>
      <div class="friend-my">
        <!-- 这里暂时写死,后面从配置读取<打算在后端写个配置入口> -->
        <p>站点名称：touchfish</p>
        <p>站点地址：https://touchfish.cc</p>
        <p>站点描述：远赴人间惊鸿宴，一睹人间盛世颜。</p>
        <p>站点图标：https://imgbox.touchfish.cc/img/logo.jpg</p>
      </div>
      <el-button style="margin-left: 2vw" type="warning" plain size="default" @click="applyFriendLink">
        交个朋友吧~
      </el-button>
    </layout>
    <!-- 收集友链的dia -->
    <el-dialog
      title="收集友链"
      :visible.sync="applyFriendLinkVisible"
      width="30vw"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="friend-dialog">
        <div class="friend-dialog-form">
          <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="form.siteName" placeholder="请输入网站名称"></el-input>
            </el-form-item>
            <el-form-item label="网站地址" prop="siteLink">
              <el-input v-model="form.siteLink" placeholder="请输入网站地址"></el-input>
            </el-form-item>
            <el-form-item label="网站描述" prop="siteDescribe">
              <el-input v-model="form.siteDescribe" placeholder="请输入网站描述" />
            </el-form-item>
            <el-form-item label="网站图标" prop="siteAvatar">
              <el-input v-model="form.siteAvatar" placeholder="请输入网站图标"></el-input>
            </el-form-item>
            <el-form-item
              label="通知邮箱"
              prop="messageEmail"
              title="不输入邮箱则展出后不会通知到您~该功能暂时未实现!!!"
            >
              <el-input v-model="form.messageEmail" placeholder="请输入通知邮箱"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="friend-dialog-btn">
          <el-button type="primary" plain @click="applyGo">
            <i class="el-icon-s-promotion"></i>
            提交
          </el-button>
          <el-button type="warning" plain @click="applyCancel">
            <i class="el-icon-close"></i>
            取消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/'

export default {
  name: 'friendLink',
  metaInfo() {
    return {
      title: `友链  - Marco's Blog`,
      meta: [
        {
          name: 'description',
          content: '友情链接页面!'
        },
        {
          name: 'keywords',
          content: '友链,友情链接,friendLink'
        }
      ]
    }
  },
  props: {},
  data() {
    return {
      friendLinkList: [],
      friendGroupList: [],
      applyFriendLinkVisible: false,
      form: {
        siteName: '',
        siteLink: '',
        siteDescribe: '',
        siteAvatar: '',
        messageEmail: ''
      },
      rules: {
        // 暂时保持现状都必填后续如果有需要可以改
        siteName: [
          {
            required: true,
            trigger: 'blur',
            min: 2,
            max: 20,
            // 中文,英文,数字,下划线,减号,点,星号,空格,@,#,$,%,^,&,*,(,),+,_,-,=,/,\,|,{,},[,],<,>,?,:,;,'
            pattern:
              /^[\u4e00-\u9fa5a-zA-Z0-9\u4e00-\u9fa5\u0020\u0023\u0024\u0025\u005e\u0026\u002a\u0028\u0029\u002b\u005f\u003d\u002f\u007c\u007b\u007d\u005b\u005d\u003c\u003e\u003f\u003a\u003b\u0027]+$/,
            message: '名称不可包含特殊符号或者为空'
          }
        ],
        siteLink: [
          {
            required: true,
            trigger: 'blur',
            // 验证a-z不包含.
            pattern:
              /^(?=^.{3,30}$)http(s)?:\/\/(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/,
            message: '网站地址为空或者格式不正确'
          }
        ],
        siteDescribe: [{ required: true, message: '请输入网站描述', trigger: 'blur', min: 1, max: 30 }],
        siteAvatar: [
          {
            required: true,
            message: '请输入网站图标地址',
            trigger: 'blur',
            // 验证图片链接 可能存在接口返回的情况所以直接验证网址即可
            pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/
          }
        ],
        messageEmail: [
          {
            required: false,
            message: '不输入邮箱或邮箱地址不正确则展出后不会通知到您~',
            trigger: 'blur',
            max: 50,
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
          }
        ]
      }
    }
  },
  async asyncData() {
    const friendLinkList = await api.getFriendLinkList()
    if (friendLinkList.status === 200)
      return { friendLinkList: friendLinkList.data.friendLinkList, friendGroupList: friendLinkList.data.groupList }
  },
  mounted() {},
  computed: {
    friendList() {
      // 将友链分组
      let groupList = JSON.parse(JSON.stringify(this.friendGroupList))
      const friendList = JSON.parse(JSON.stringify(this.friendLinkList))
      groupList = groupList.map((g) => {
        g.friendLinkList = friendList.filter((f) => f.groupId === g._id)
        return g
      })
      return groupList
    }
  },
  methods: {
    applyFriendLink() {
      this.applyFriendLinkVisible = true
    },
    applyCancel() {
      this.applyFriendLinkVisible = false
      this.$message({
        message: 'wow,太遗憾了!',
        type: 'warning'
      })
    },
    applyGo() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await this.$api.applyFriendLink(this.form)
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: res.info
            })
            this.applyFriendLinkVisible = false
            this.form = {
              siteName: '',
              siteLink: '',
              siteDescribe: '',
              siteAvatar: '',
              messageEmail: ''
            }
          } else {
            this.$message({
              type: 'warning',
              message: res.info
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请检查网站信息是否填写完整!'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';
.friend {
  &-content {
    display: inline-block;
    width: 100%;
    &-tip {
      padding: 8px 16px;
      background-color: #ecf8ff;
      border-radius: 4px;
      border-left: 5px solid #50bfff;
      margin-bottom: 1vh;
      margin-top: 1vh;
    }
    &-list {
      // 隔壁halo偷来的样式,懒得改了
      &-item {
        -webkit-text-size-adjust: 100%;
        word-break: break-all;
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
        color: #404040;
        font-size: 15px;
        line-height: 1.5;
        cursor: url(//cdn.jsdelivr.net/gh/LIlGG/halo-theme-sakura@1.3.3/source/cursor/normal.cur), auto;
        font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, 'PT Serif',
          'SongTi SC', 'MicroSoft Yahei', Georgia, serif;
        list-style: none;
        box-sizing: border-box;
        width: 48%;
        height: 100px;
        float: left;
        border: 1px solid #ececec;
        padding: 10px 30px;
        margin: 4px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;
        border-radius: 10px;
        &:hover {
          // 浅红色遮罩
          background-color: #fafafa;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
          border-color: #fafafa;
          z-index: 1;
          // 变大
          transform: scale(1.1);
        }
        .link-item-inner.effect-apollo {
          -webkit-text-size-adjust: 100%;
          word-break: break-all;
          text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
          font-size: 15px;
          line-height: 1.5;
          font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, 'PT Serif',
            'SongTi SC', 'MicroSoft Yahei', Georgia, serif;
          list-style: none;
          box-sizing: border-box;
          background-color: transparent;
          text-decoration: none;
          color: #e67474;
          outline: 0;
          transition: color 0.2s ease-out, border 0.2s ease-out, opacity 0.2s ease-out;
          cursor: url(//cdn.jsdelivr.net/gh/LIlGG/halo-theme-sakura@1.3.3/source/cursor/ayuda.cur), auto;
          .lazyLoaded {
            -webkit-text-size-adjust: 100%;
            word-break: break-all;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
            font-size: 15px;
            line-height: 1.5;
            font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, 'PT Serif',
              'SongTi SC', 'MicroSoft Yahei', Georgia, serif;
            list-style: none;
            color: #e67474;
            cursor: url(//cdn.jsdelivr.net/gh/LIlGG/halo-theme-sakura@1.3.3/source/cursor/ayuda.cur), auto;
            box-sizing: border-box;
            border: 0;
            max-width: 100%;
            float: right;
            box-shadow: inset 0 0 10px #000;
            opacity: 1;
            -webkit-transform: rotate(0);
            -webkit-transition: all ease 1s;
            margin-top: 5px;
            width: 65px;
            height: 65px;
            padding: 2px;
            border-radius: 100%;
          }
          .siteName {
            -webkit-text-size-adjust: 100%;
            word-break: break-all;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
            font-size: 15px;
            line-height: 1.5;
            font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, 'PT Serif',
              'SongTi SC', 'MicroSoft Yahei', Georgia, serif;
            list-style: none;
            cursor: url(//cdn.jsdelivr.net/gh/LIlGG/halo-theme-sakura@1.3.3/source/cursor/ayuda.cur), auto;
            box-sizing: border-box;
            padding-bottom: 10px;
            display: block;
            transition: all 0.3s;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #e7671d;
          }
          .linkDes {
            -webkit-text-size-adjust: 100%;
            word-break: break-all;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
            font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, 'PT Serif',
              'SongTi SC', 'MicroSoft Yahei', Georgia, serif;
            list-style: none;
            cursor: url(//cdn.jsdelivr.net/gh/LIlGG/halo-theme-sakura@1.3.3/source/cursor/ayuda.cur), auto;
            box-sizing: border-box;
            color: #949494;
            font-size: 13px;
            padding: 10px 0;
            border-top: 1px dashed #ddd;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            line-height: 25px;
            transition: all 0.5s;
          }
        }
      }
    }
  }
  &-my {
    padding: 2vh;
    margin-top: 2vh;
    border-top: 8px dotted #ececec;
    p {
      font-size: 17px;
      color: #e67474;
      margin-bottom: 10px;
    }
  }
}
</style>
