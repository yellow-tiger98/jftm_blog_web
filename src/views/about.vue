<template>
  <div>
    <div class="pagebg ab"></div>
    <div class="container">
      <h1 class="t_nav">
        <span><a href="https://hitokoto.cn/" target="_blank">{{hitokoto}}</a></span>
        <a href="/" class="n1">网站首页</a>
        <a href="/" class="n2">关于我</a>
      </h1>
      <div class="news_infos">
      <div class="aboutbox">
        <div class="newsview">
        <div
          class="news_con ck-content"
          v-html="blogContent"
          v-highlight
          @click="imageChange"
        >{{blogContent}}</div>
        </div>

      </div>

      </div>
      <div class="sidebar">
        <div class="about">
          <p class="avatar">
            <img :src="touxiang_url" alt />
          </p>
          <p class="abname">{{info.nickName}}</p>
          <p class="abposition">{{info.occupation}}</p>
        </div>
        <follow-us></follow-us>
      </div>
    </div>
  </div>
</template>

<script>
    import FollowUs from "../components/FollowUs";
    import Sticky from "@/components/Sticky";
    import {getWebConfig} from "../api";
    import axios from 'axios';
    import touxiang from '../../static/images/touxiang.jpeg'

    export default {
        name: "about",
        data() {
            return {
                touxiang_url: touxiang,
                hitokoto: "",
                info: {},
                blogContent: ""
            };
        },
        components: {
            //注册组件
            FollowUs,
            Sticky
        },
        created() {
            var that = this;
            // 获取配置信息
            getWebConfig().then(response => {
                if (response.code == this.$ECode.SUCCESS) {
                  console.log(response)
                    this.info.nickName = response.data.showName;
                    this.info.occupation = response.data.showDesc;
                    setTimeout(()=>{
                      this.blogContent = response.data.introduction;
                  }, 200)
                }
            });
          this.getHitoko()
        },
        methods: {
          // 获取关于我文章
          getAboutMe: function(){

          },
          // 点击图片放大
          imageChange: function(e) {
                //首先需要判断点击的是否是图片
                var type = e.target.localName;
                if (type == "img") {
                    // window.open(e.target.currentSrc);
                    this.dialogPictureVisible = true;
                    this.dialogImageUrl = e.target.currentSrc;
                }
          },
          // 获取一言
          getHitoko: function() {
            axios
              .get('https://v1.hitokoto.cn?c=d')
              .then(response => (
                  this.hitokoto = response.data.hitokoto
                ))
            }
        }
    };
</script>

<style scoped>
  .emoji-panel-wrap {
    width: 470px;
  }
  .emoji-size-small {
    zoom: 0.3;
    margin: 5px;
    vertical-align: middle;
  }
  .emoji-size-large {
    zoom: 0.5;
    margin: 5px;
  }
  .news_infos .newsview img {
    max-width: 650px;
    height: auto;
  }
  .fixck {
    /* font-family: Arial, Verdana, sans-serif !important;
      font-size: 12px !important;
      color: #222 !important;
      line-height: normal !important; */
  }

  .fixck p {
    margin: 12px 0 !important;
  }

  .fixck a {
    text-decoration: underline !important;
    color: #00e !important;
  }

  .fixck ul li {
    list-style: disc;
  }

  .fixck ol li {
    list-style: decimal;
  }

  .fixck ul,
  .fixck ol {
    padding-left: 40px !important;
    padding-right: 40px !important;
  }

  .fixck li {
    display: list-item !important;
  }

  .fixck h1 {
    font-weight: bold !important;
    font-size: 32px !important;
    margin: 21px 0 !important;
  }

  .fixck h2 {
    font-weight: bold !important;
    font-size: 24px !important;
    margin: 19px 0 !important;
  }

  .fixck h3 {
    font-weight: bold !important;
    font-size: 19px !important;
    margin: 18px 0 !important;
  }

  .fixck h4 {
    font-weight: bold !important;
    font-size: 16px !important;
    margin: 21px 0 !important;
  }

  .fixck h5 {
    font-weight: bold !important;
    font-size: 13px !important;
    margin: 22px 0 !important;
  }

  .fixck h6 {
    font-weight: bold !important;
    font-size: 11px !important;
    margin: 24px 0 !important;
  }

  .news_con {
    line-height: 1.8;
    font-size: 16px;
    text-align: justify;
  }
  .el-pagination {
    white-space: "";
  }
  .message_infos {
    width: 100%;
    /*min-height: 500px;*/
    margin-left: 10px;
  }
  .noComment {
    width: 100%;
    text-align: center;
  }
  .personResume {
    margin: 20px 20px 20px 20px;
    font-size: 16px;
  }
</style>
