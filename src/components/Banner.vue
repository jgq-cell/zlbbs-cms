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
    </el-space>

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
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'Banner',
  components: {
    Plus
  },
  data() {
    return {
      bannerDialogVisible: false,
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
  mounted() {},
  methods: {
    onAddBanner() {
      this.bannerDialogVisible = true
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
    onDialogSubmit() {
      this.$refs['dialogForm'].validate((valid) => {
        if (!valid) {
          ElMessage.error('请确保数据输入正确！')
          return
        }
      })
      this.$http
        .addBanner(this.form)
        .then((resp) => {
          console.log(resp)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.el-space {
  display: block;
}
</style>
