<template>
    <div class="form">
        <el-upload
            class="upload"
            action=""
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit = 1
            :before-upload="UpladFile"
            >
            <!--  :on-change="saveFile"  :auto-upload="false"  :on-change="saveFile" :auto-upload="false" :before-upload="UpladFile" -->
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
            <el-form-item label="餐馆名" prop="name">
                <el-input v-model="form.name" auto-complete="off" style="width:20%"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" auto-complete="off" style="width:20%"></el-input>
            </el-form-item>

            <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" auto-complete="off" style="width:25%"></el-input>
            </el-form-item>

            <el-form-item label="详细信息" prop="info">
                <el-input type="textarea" v-model="form.info" 
                style="width:50%" autosize maxlength="50" show-word-limit placeholder="餐馆详细介绍">
                </el-input>
            </el-form-item>

            <el-form-item label="营业时间" prop="time">
                <el-input  placeholder="例如: 8:00 -- 21:00" v-model="form.time" style="width:25%">
                </el-input>
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
                dialogVisible:false,
                dialogImageUrl:'',
                fileList:[],        //文件列表
                form: {             //提交表单
                  name:'',
                  pic:'',
                  address:'',
                  phone:'',
                  info:'',
                  time:'',
                },
                submitLoading:false,
                uploadingFile:false,
                //表单验证
                formRules: {
                  dishes: [
                    { required: true, message: '请输入菜名', trigger: 'blur' },
                  ],
                  price: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                  ],
                  typeId:[
                    { required: true, message: '请输入菜品类别', trigger: 'blur' },
                  ],
                },
            }
        },
        created:function(){
            this.getTypeList()
        },
        methods: {

            submit(){
                this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.submitLoading = true;
                        let para = Object.assign({}, this.form);
							// para.publishingDate = (!para.publishingDate || para.publishingDate == '') ? '':util.formatDate.format(new Date(para.publishingDate), 'yyyy-MM-dd');
                            this.submitHotel(para);
						});
					}
				});
            },
            submitHotel:function(para){
               
                this.$axios.post('/menu/insert',para).then((res) => {
                    if(res.data!=null){
                        this.$message.success('提交成功');
                    }
                    this.$refs['form'].resetFields();
                    this.editLoading = false;
                        
                }).catch(function(error){
                        console.log(error);
                })
            },
            getTypeList(){
                this.$axios.post('/type/list').then((res) =>{
                this.typeList = res.data;
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            a(){

            },
            UpladFile(file){
                this.fileList = [...this.fileList,file];
                const formData = new FormData();
                var that = this;
                list.forEach((file) => {
                    formData.append('files',file);
                });
    
                formData.append('path','logo');
                this.$axios.post('/file/uploadFile',formData).then((res) => {
                    if(res.data!=null){
                        this.form.pic = res.data[0];
                        that.$message.error('文件提交成功');
                    }
                }).catch(function(error){
                    that.$message.error('文件提交失败');
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
        margin-top:0%;
        margin-left:10%;
    }

    .buttons{
        margin-top:4em;
        margin-left:5em;
    }
</style>