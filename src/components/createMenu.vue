<template>
    <div class="form">
          
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

          <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
            <el-form-item label="图片:" prop="imageUrl">

              <el-upload
            class="upload"
            action=""
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit = 1
            :before-upload="UpladFile"
            :file-list="successList.logo"
            >
            <!-- <span v-if="successUrl" class="avatar-uploader-icon">
											<img :src="successUrl" class="avatar">
										</span> -->
            <!-- <img v-if="successUrl" :src="successUrl" class="upload"> -->
            <!--  :on-change="saveFile"  :auto-upload="false"  :on-change="saveFile" :auto-upload="false" :before-upload="UpladFile" -->
            <i class="el-icon-plus"></i>
          </el-upload>
              </el-form-item>
            <el-form-item label="菜名" prop="name">
              <el-input v-model="form.name" auto-complete="off" style="width:40%"></el-input>
            </el-form-item>

            <el-form-item label="价格" prop="realPrice">
              <el-input v-model="form.realPrice" auto-complete="off" style="width:40%"></el-input>
            </el-form-item>

            <el-form-item label="VIP价格" prop="price">
              <el-input v-model="form.price" auto-complete="off" style="width:40%"></el-input>
            </el-form-item>

            <el-form-item label="详细描述" prop="detail">
              <el-input v-model="form.detail" auto-complete="off" style="width:40%"></el-input>
            </el-form-item>
            
            <el-form-item label="菜品类别" prop="productType">
              <el-select clearable  v-model="form.productType" placeholder="菜品类别" autocomplete="off"
                      style="width: 30%">
              <el-option v-for="item in typeList" :key="item.id" :label="item.typeName"
                        :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>

        <div class="buttons">
            <el-button type="primary" @click.native="submit" :loading="submitLoading">提交</el-button>
            <el-button @click.native="clean" style="margin-left:5em;">取消</el-button>
        </div>

    </div>
</template>
<script>
    export default {

        data(){
            return{
                file:{},
                dialogVisible:false,
                dialogImageUrl:'',
                successList:{
                  logo:[],
                },
                fileList:[],        //文件列表
                typeList:[],        //菜品类别表
                form: {             //提交表单
                  name:'',
                  price:'',
                  realPrice:'',
                  imageUrl:'',
                  productType:'',
                  detail:'',
                },
                submitLoading:false,
                //表单验证
                formRules: {
                  dishes: [
                    { required: true, message: '请输入菜名', trigger: 'blur' },
                  ],
                  price: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                  ],
                  typeId:[
                    { required: true, message: '请选择菜品类别', trigger: 'blur' },
                  ],
                },
            }
        },
        created:function(){
            this.getTypeList()
        },
        methods: {
            // saveFile(file){
            //     this.file  = file.raw;
            //     this.fileList = [...this.fileList, this.file];
            // },
            submit(){
                this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.submitLoading = true;
                        let para = Object.assign({}, this.form);
                        console.log(para);
							// para.publishingDate = (!para.publishingDate || para.publishingDate == '') ? '':util.formatDate.format(new Date(para.publishingDate), 'yyyy-MM-dd');
                            this.submitMenu(para);
						});
					}
				});
            },
            submitMenu:function(para){
                // alert(JSON.stringify(para));
                let that = this;
                this.$axios.post('/product/add',para).then((res) => {
                  let result = res.data;
                    if(result.code == 0){
                        this.$message.success('提交成功');
                    }else{
                      this.$message.error('提交失败:'+result.message);
                    }
                    that.$refs['form'].resetFields();
                    that.submitLoading = false;
                    that.successList.logo = [];
                        
                }).catch(function(error){
                        console.log(error);
                })
            },
            getTypeList(){
                this.$axios.get('/type/list').then((res) =>{
                let result = res.data;
                this.typeList = result.data;
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
             handleSuccess(file) {
               console.log(11111);
            },
            a(){

            },
            UpladFile(file){
               this.successList.logo = [];
                const formData = new FormData();
                formData.append('file',file);
                var _this = this;
                this.$axios.post('/product/upload',formData).then((res) => {
                    if(res.data!=null){
                      this.form.imageUrl = res.data.data;
                      let successUrl = "http://localhost:8080/"+res.data.data;
                      _this.successList.logo.push({ "name": res.data.data,"url": successUrl })
                    }
                }).catch(function(error){
                    console.log(error);
                })
            }
        },
        computed: {
           
        }
    }
</script>
<style>
    .upload{
      margin-left: 6em;
      margin-bottom: 2em;
    }

    .form{
        margin-top:2%;
        margin-left:20%;
    }

    .buttons{
        margin-top:4em;
        margin-left:5em;
    }
</style>
