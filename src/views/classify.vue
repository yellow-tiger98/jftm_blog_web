<template>
  <div>
    <div class="pagebg classify"></div>
    <div class="container">
      <h1 class="t_nav">
        <span><a href="https://hitokoto.cn/" target="_blank">{{hitokoto}}</a></span>
        <a href="/" class="n1">网站首页</a>
        <a href="javascript:void(0);" class="n2">分类</a>
      </h1>

      <div class="sortBox">
        <div class="time">
          <div class="block">
            <div class="radio" style="margin-bottom:20px;"></div>
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in activities" hide-timestamp :key="index">
                <span
                  @click="getBlogList(activity.typeId)"
                  :class="[activity.typeId == selectBlogUid ? 'sortBoxSpan sortBoxSpanSelect' : 'sortBoxSpan']"
                >{{activity.typeNa}}</span>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

        <div class="article">
          <div class="block" v-infinite-scroll="load">
            <span v-if="itemByDate.length == 0">还没写呢，先放着～</span>
            <el-timeline>
              <el-timeline-item
                v-for="item in itemByDate"
                :key="item.uid"
                :timestamp="item.createDate"
                placement="top"
              >
                <el-card>
                  <h4 @click="goToList('blogContent', item)" class="itemTitle">{{item.title}}</h4>
                  <br>
                  <el-tag class="elTag" type="danger">原创</el-tag>

                  <el-tag
                    class="elTag"
                    v-if="item.author"
                    @click="goToList('author', item)"
                  >{{item.author}}</el-tag>

                  <el-tag
                    class="elTag"
                    type="success"
                    v-if="item.type != null"
                    @click="goToList('blogSort', item)"
                  >{{item.typeName}}</el-tag>
                  <el-tag
                    class="elTag"
                    v-for="tagItem in item.signListName"
                    v-if="tagItem != null"
                    :key="tagItem"
                    type="warning"
                  >{{tagItem}}</el-tag>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBlogSortList, getArticleByBlogSortUid } from "../api/classify";
import axios from 'axios'
export default {
  data() {
    return {
      hitokoto: "",
      selectBlogUid: "",
      reverse: false,
      activities: [],
      itemByDate: [],
      articleByDate: {},
      count: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  components: {
    //注册组件
  },
  mounted() { },
  created() {
    var that = this;
    getBlogSortList().then(response => {
      if (response.code == this.$ECode.SUCCESS) {
        var activities = response.data;
        var result = [];
        for (var a = 0; a < activities.length; a++) {
          var dataForDate = {
            typeNa: activities[a].typeNa,
            typeId: activities[a].typeId
          };
          result.push(dataForDate);
        }
        this.activities = result;

        // 默认选择第一个
        this.blogSortUid = activities[0].typeId;
        this.getBlogList(activities[0].typeId);
      }
    });
    this.getHitoko()

  },
  methods: {
    getBlogList(blogSortUid) {
      this.currentPage = 1;
      this.pageSize = 10;
      this.selectBlogUid = blogSortUid;
      var params = new URLSearchParams();
      params.append("typeId", blogSortUid);
      params.append("page", this.currentPage);
      params.append("limit", this.pageSize);
      getArticleByBlogSortUid(params).then(response => {
        if (response.code == this.$ECode.SUCCESS) {
          this.itemByDate = response.data.records;
          this.currentPage = response.data.current;
          this.pageSize = response.data.size;
        }
      });
    },
    load() {
      var params = new URLSearchParams();
      if (
        this.selectBlogUid == null ||
        this.selectBlogUid == "" ||
        this.selectBlogUid == undefined
      ) {
        return;
      }
      params.append("typeId", this.selectBlogUid);
      params.append("page", this.currentPage + 1);
      params.append("limit", this.pageSize);
      getArticleByBlogSortUid(params).then(response => {
        if (response.code == this.$ECode.SUCCESS) {
          this.itemByDate = this.itemByDate.concat(response.data.records);
          this.currentPage = response.data.current;
          this.pageSize = response.data.size;
        }
      });
    },
    //跳转到搜索详情页
    goToList(type, entity) {
      switch (type) {
        case "tag":
        {
          // 标签uid
          let routeData = this.$router.resolve({
            path: "/list",
            query: { tagUid: entity.uid }
          });
          window.open(routeData.href, "_blank");
        }
          break;
        case "blogSort":
        {
          let routeData = this.$router.resolve({
            path: "/list",
            query: { sortUid: entity.blogSort.uid }
          });
          window.open(routeData.href, "_blank");
        }
          break;
        case "author":
        {
          let routeData = this.$router.resolve({
            path: "/list",
            query: { author: entity.author }
          });
          window.open(routeData.href, "_blank");
        }
          break;

        case "blogContent":
        {
            let routeData = this.$router.resolve({
              path: "/info",
              query: { blogUid: entity.uid }
            });
            window.open(routeData.href, "_blank");
        }
          break;
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


<style>
.sortBox {
  color: #555;
}

.sortBoxSpan {
  cursor: pointer;
}
.sortBoxSpan:hover {
  color: #409eff;
}
.sortBoxSpanSelect {
  color: #409eff;
}

.itemTitle {
  cursor: pointer;
}
.itemTitle:hover {
  color: #409eff;
}
.elTag {
  cursor: pointer;
}
</style>
