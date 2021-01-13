<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <span>课程:xxx</span><br>
        <span>阶段:xxx</span><br>
        <span>课时:xxx</span>
      </div>
      <el-form label-width="70px">
        <el-form-item label="视频上传">
          <input type="file" ref='video-file'>
        </el-form-item>
                <el-form-item label="封面上传">
          <input type="file" ref='image-file'>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleUpload"
          >开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中: {{ uploadPercent }}</p>
          <p v-if="isUploadSuccess">视频转码中: {{ isTransCodeSuccess ? '完成' : '正在处理，请稍后' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]
      const uploader = this.uploader as any

      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')
      uploader.startUpload()
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          let uploadAddressAdnAuth

          if (uploadInfo.isImage) {
            const { data } = await getAliyunImagUploadAddressAdnAuth()

            uploadAddressAdnAuth = data.data
            this.imageURL = data.data.imageURL
          } else {
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })

            uploadAddressAdnAuth = data.data
            this.videoId = uploadAddressAdnAuth.videoId
          }

          ;(this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAdnAuth.uploadAuth,
            uploadAddressAdnAuth.uploadAddress,
            uploadAddressAdnAuth.imageId || uploadAddressAdnAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          console.log(uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log(uploadInfo)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo: any, totalSize: any, loadedPercent: any) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log(uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          this.isUploadSuccess = true

          const { data } = await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            fileId: this.videoId,
            fileName: (this.video as any).files[0].name,
            coverImageUrl: this.imageURL
          })

          console.log(data)

          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)

            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
            }
          }, 3000)
        }
      })
    }
  }
})
</script>
