<template>
  <div>
    <el-space direction="vertical" :size="20">
      <h1>帖子管理</h1>
      <el-table :data="posts" style="width: 100%">
        <el-table-column label="标题">
          <template #default="scope">
            <a
              :href="$http.server_host + '/post/detail/' + scope.row.id"
              target="_blank"
              >{{ scope.row.title }}</a
            >
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" width="180" />
        <el-table-column prop="board.name" label="所属板块" />
        <el-table-column prop="author.username" label="作者" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="danger"
              circle
              size="mini"
              @click="onDeletePost(scope.$index)"
            >
              <el-icon><delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="count"
          :current-page="page"
          @current-change="onPageChange"
        />
      </div>
    </el-space>

    <!-- 删除轮播图确认对话框 -->
    <el-dialog v-model="confirmDialogVisible" title="提示" width="30%">
      <span>如果删除帖子，该帖子下所有的评论也会被删除，您确定要删除吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onConfirmDeletePost"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'Post',
  data() {
    return {
      deletingIndex: null,
      confirmDialogVisible: false,
      posts: [],
      count: 0,
      page: 1
    }
  },
  mounted() {
    this.getPostList(1)
  },
  methods: {
    getPostList(page) {
      this.$http
        .getPostList(page)
        .then((resp) => {
          if (resp.code === 200) {
            let data = resp.data
            this.posts = data['posts']
            this.count = data['count']
            this.page = data['page']
          }
        })
        .catch(() => {
          ElMessage.error('获取帖子列表失败！')
        })
    },
    onDeletePost(index) {
      this.confirmDialogVisible = true
      this.deletingIndex = index
    },
    onConfirmDeletePost() {
      let delete_id = this.posts[this.deletingIndex].id
      this.$http
        .deletePost(delete_id)
        .then((resp) => {
          if (resp.code === 200) {
            this.count--
            this.posts.splice(this.deletingIndex, 1)
            ElMessage.success('删除帖子成功！')
          }
        })
        .catch(() => {
          ElMessage.error('删除帖子失败！')
        })
      this.confirmDialogVisible = false
    },
    onPageChange(current_page) {
      this.getPostList(current_page)
    }
  },
  components: {
    Delete
  }
}
</script>

<style scoped>
.el-space {
  display: block;
}
</style>
