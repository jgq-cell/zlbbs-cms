<template>
  <div id="banner">
    <el-space direction="vertical" :size="20" style="width: 100%">
      <h1>轮播图管理</h1>
      <div style="text-align: right">
        <el-button type="primary" @click="onAddBanner">
          <el-icon><plus /></el-icon>
          添加轮播图
        </el-button>
      </div>
      <el-table :data="banners" style="width: 100%">
        <el-table-column prop="name" label="名称" width="250" />
        <el-table-column label="图片">
          <template #default="scope">
            <el-image
              :src="formatImageUrl(scope.row.image_url)"
              style="width: 100px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column label="跳转链接">
          <template #default="scope">
            <a href="scope.row.link_url" target="_blank">
              {{ scope.row.link_url }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" />
        <el-table-column prop="create_time" label="创建时间" />

        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button
              type="primary"
              @click="onEditDialog(scope.$index)"
              circle
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              type="danger"
              @click="onDeleteDialog(scope.$index)"
              circle
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

    <!-- 添加/修改轮播图表单对话框 -->
    <el-dialog
      v-model="bannerDialogVisible"
      title="添加/修改轮播图"
      width="30%"
    >
      <el-form :model="form" :rules="rules" ref="dialogForm" label-width="65px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="图片" prop="image_url">
          <div style="display: flex; width: 100%">
            <el-input
              v-model="form.image_url"
              autocomplete="off"
              style="margin-right: 10px"
            />
            <el-upload
              :action="$http.server_host + '/cmsapi/banner/image/upload'"
              name="image"
              :show-file-list="false"
              accept="image/png, image/jpeg"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :headers="{ Authorization: 'Bearer ' + $auth.token }"
            >
              <el-button type="primary">上传图片</el-button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="跳转" prop="link_url">
          <el-input v-model="form.link_url" autocomplete="off" />
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-input
            v-model="form.priority"
            autocomplete="off"
            type="number"
            :min="1"
            :max="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bannerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onDialogSubmit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除轮播图消息对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="提示" width="30%">
      <span>您确定要删除这个轮播图吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onDialogDeleteSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'Banner',
  components: {
    Plus,
    Edit,
    Delete
  },
  data() {
    return {
      bannerDialogVisible: false,
      deleteDialogVisible: false,
      delete_index: null,
      edit_index: null,
      banners: [],
      page: 1,
      count: 0,
      form: {
        name: '',
        image_url: '',
        link_url: '',
        priority: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入轮播图名称！', trigger: 'blur' },
          {
            min: 3,
            message: '轮播图名称长度大于2个字',
            trigger: 'blur'
          }
        ],
        image_url: [
          { required: true, message: '请上传轮播图！', trigger: 'blur' }
        ],
        link_url: [
          { required: true, message: '请输入轮播图跳转链接！', trigger: 'blur' }
        ],
        priority: [
          {
            required: true,
            message: '请输入轮播图优先级！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getBannerList(1)
  },
  methods: {
    getBannerList(page) {
      this.$http.getBannerList(page).then((res) => {
        if (res.code === 200) {
          let data = res.data
          this.banners = data.banners
          this.page = data.page
          this.count = data.count
        } else {
          ElMessage.error('获取轮播图列表失败！')
        }
      })
    },
    onPageChange(current_page) {
      this.getBannerList(current_page)
    },
    formatImageUrl(image_url) {
      if (image_url.startsWith('http')) {
        return image_url
      } else {
        return this.$http.server_host + image_url
      }
    },
    initForm(banner) {
      if (banner) {
        this.form = {
          id: banner.id,
          name: banner.name,
          image_url: banner.image_url,
          link_url: banner.link_url,
          priority: banner.priority
        }
      } else {
        this.form = {
          name: '',
          image_url: '',
          link_url: '',
          priority: 1
        }
      }
    },
    onAddBanner() {
      this.bannerDialogVisible = true
      this.initForm()
    },
    onDeleteDialog(index) {
      this.deleteDialogVisible = true
      this.delete_index = index
    },
    onEditDialog(index) {
      this.bannerDialogVisible = true
      this.edit_index = index
      this.initForm(this.banners[index])
    },
    onUploadSuccess(response) {
      if (response.code === 200) {
        let image_name = response['data']['banner_image']
        let image_url = '/media/banner/' + image_name
        this.form.image_url = image_url
      }
    },
    onUploadError(error, uploadFile, uploadFiles) {
      console.log(error)
      console.log(uploadFile)
      console.log(uploadFiles)
    },
    onDialogDeleteSubmit() {
      let delete_id = this.banners[this.delete_index].id
      this.$http
        .deleteBanner(delete_id)
        .then((resp) => {
          if (resp.code === 200) {
            this.banners.splice(this.delete_index, 1)
            ElMessage.success('删除轮播图成功！')
          }
        })
        .catch(() => {
          ElMessage.error('删除轮播图失败！')
        })
      this.deleteDialogVisible = false
    },
    onDialogSubmit() {
      this.$refs['dialogForm'].validate((valid) => {
        if (!valid) {
          ElMessage.error('请确保数据输入正确！')
          return
        }
      })
      // 走编辑操作
      if (this.form.id) {
        this.$http
          .editBanner(this.form)
          .then((resp) => {
            if (resp.code === 200) {
              let banner = resp.data
              this.banners.splice(this.edit_index, 1, banner)

              ElMessage.success('编辑轮播图成功！')
            }
          })
          .catch(() => {
            ElMessage.error('编辑轮播图失败！')
          })
      } else {
        // 走添加操作
        this.$http
          .addBanner(this.form)
          .then((resp) => {
            if (resp.code === 200) {
              this.getBannerList(this.page)
              ElMessage.success('添加轮播图成功！')
            }
          })
          .catch(() => {
            ElMessage.error('添加轮播图失败！')
          })
      }
      this.bannerDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-space {
  display: block;
}
</style>
