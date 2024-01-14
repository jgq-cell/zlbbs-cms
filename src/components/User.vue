<template>
  <div>
    <el-space direction="vertical" :size="20">
      <h1>用户管理</h1>
      <el-tabs
        v-model="tabName"
        type="card"
        class="demo-tabs"
        @tab-click="onTabChange"
      >
        <el-tab-pane label="前台用户" name="first"></el-tab-pane>
        <el-tab-pane
          label="后台管理员"
          name="second"
          v-if="has_permission('cms_user')"
        ></el-tab-pane>
      </el-tabs>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="join_time" label="加入时间" />
        <el-table-column label="员工">
          <template #default="scope">
            <el-tag v-if="scope.row.is_staff">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.is_active" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" circle @click="onActiveUser(scope.$index)">
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

    <!-- 激活/禁用用户确认对话框 -->
    <el-dialog v-model="confirmDialogVisible" title="提示" width="30%">
      <span>{{ message }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onConfirmActiveUser"
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
  name: 'User',
  data() {
    return {
      tabName: 'first',
      confirmDialogVisible: false,
      users: [],
      activingIndex: null,
      message: '',
      count: 0,
      page: 1
    }
  },
  mounted() {
    this.getUserList(1, 1)
  },
  methods: {
    has_permission(permission) {
      return this.$auth.user.permissions.indexOf(permission) > -1
    },
    getUserList(page, type) {
      this.$http.getUserList(page, type).then((res) => {
        if (res.code === 200) {
          let data = res.data
          this.users = data.users
        } else {
          ElMessage.error('获取用户列表失败！')
        }
      })
    },
    onActiveUser(index) {
      this.activingIndex = index
      this.confirmDialogVisible = true
      let user = this.users[index]
      console.log(user.is_active)
      if (user.is_active) {
        this.message = '您确定要拉黑此用户吗？'
      } else {
        this.message = '您确定要取消拉黑此用户吗？'
      }
    },
    onConfirmActiveUser() {
      let user = this.users[this.activingIndex]
      const form = {
        is_active: user.is_active ? 0 : 1,
        id: user.id
      }
      this.$http.activeUser(form).then((res) => {
        if (res.code == 200) {
          let user = res.data
          this.users.splice(this.activingIndex, 1, user)
          ElMessage.success('操作成功！')
        } else {
          ElMessage.info('操作失败！')
        }
        this.confirmDialogVisible = false
      })
    },
    onPageChange(current_page) {
      this.getUserList(current_page, this.type)
    },
    onTabChange(tab) {
      let type = null
      if (tab.props.name == 'second') {
        type = 2
      } else if (tab.props.name == 'first') {
        type = 1
      }
      this.getUserList(1, type)
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
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
