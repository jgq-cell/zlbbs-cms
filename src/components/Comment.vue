<template>
  <div>
    <el-space direction="vertical" :size="20">
      <h1>评论管理</h1>
      <el-table :data="comments" style="width: 100%">
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="author.username" label="作者" />
        <el-table-column label="帖子">
          <template #default="scope">
            <a
              :href="
                this.$http.server_host + '/post/detail/' + scope.row.post.id
              "
              target="_blank"
              >{{ scope.row.post.title }}</a
            >
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="danger"
              circle
              @click="onDeleteComment(scope.$index)"
            >
              <el-icon><Delete /></el-icon>
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
      <span>您确定要删除这个评论吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onConfirmDeleteComment"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
export default {
  name: 'Comment',
  data() {
    return {
      deletingIndex: null,
      confirmDialogVisible: false,
      comments: [],
      count: 0,
      page: 1
    }
  },
  components: {
    Delete
  },
  mounted() {
    this.getCommentList(1)
  },
  methods: {
    getCommentList(page) {
      this.$http
        .getCommentList(page)
        .then((resp) => {
          if (resp.code === 200) {
            let data = resp.data
            this.comments = data.comments
            this.count = data.count
            this.page = data.page
          }
        })
        .catch(() => {
          ElMessage.error('获取评论列表失败！')
        })
    },
    onDeleteComment(index) {
      this.deletingIndex = index
      this.confirmDialogVisible = true
    },
    onConfirmDeleteComment() {
      let comment_id = this.comments[this.deletingIndex].id
      this.$http.deleteComment(comment_id).then((res) => {
        if (res.code === 200) {
          this.comments.splice(this.deletingIndex, 1)
          this.confirmDialogVisible = false
          ElMessage.success('评论删除成功！')
        } else {
          ElMessage.info(res.message)
        }
      })
    },
    onPageChange(current_page) {
      this.getCommentList(current_page)
    }
  }
}
</script>

<style scoped>
.el-space {
  display: block;
}
</style>
