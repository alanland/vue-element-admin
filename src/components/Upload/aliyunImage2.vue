<template>
<div class="singleImageUpload2 upload-container">
  <el-upload
    class="avatar-uploader"
    action="/rest/aliyunoss/upload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-remove="handleRemove"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>

  <div v-show="imageUrl && imageUrl.length>0" class="image-preview">
    <div class="image-preview-wrapper" v-show="imageUrl && imageUrl.length>1">
      <img :src="imageUrl">
      <div class="image-preview-action">
        <i @click="rmImage" class="el-icon-delete"></i>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ossApi from '@/api/cmn/oss'

export default {
  name: 'aliyunImageUpload2',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      if (this.value) {
        return '/rest/aliyunoss/item?key=' + this.value
      } else {
        return this.value
      }
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: {token: '', key: ''}
    }
  },
  methods: {
    rmImage() {
      const key = this.imageUrl.split('key=')[1]
      ossApi.remove({key: key}).then(() => this.emitInput(''))
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleAvatarSuccess(res, file) {
      this.emitInput(res.data)
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleRemove(file, fileList) {
      console.log(file)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 805

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 800K!') // 1M
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.upload-container {
  width: 178px;
  height: 178px;
  position: relative;
  border: 1px dashed #cccaae;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 178px;
    height: 178px;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
