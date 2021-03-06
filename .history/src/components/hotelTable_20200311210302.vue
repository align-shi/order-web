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
                <el-input v-model="form.dishes" auto-complete="off" style="width:40%"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="price">
                <el-input v-model="form.price" auto-complete="off" style="width:10%"></el-input>
            </el-form-item>

            <el-form-item label="详细信息" prop="price">
                <el-input type="textarea" rows="2" placeholder="餐馆详细介绍" v-model="textarea">
                </el-input>
            </el-form-item>

            <el-form-item label="营业时间" prop="price">
                <el-input  placeholder="例如: 8:00 -- 21:00" v-model="textarea">
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
                file:{},
                dialogVisible:false,
                dialogImageUrl:'',
                fileList:[],        //文件列表
                typeList:[],        //菜品类别表
                form: {             //提交表单
                  dishes:'',
                  price:'',
                  picture:'',
                  typeId:'',
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
							// para.publishingDate = (!para.publishingDate || para.publishingDate == '') ? '':util.formatDate.format(new Date(para.publishingDate), 'yyyy-MM-dd');
                            this.submitMenu(para);
						});
					}
				});
            },
            submitMenu:function(para){
                // alert(JSON.stringify(para));
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
                var list = this.fileList;
                var that = this;
                list.forEach((file) => {
                    console.log(file);
                    formData.append('files',file);
                });
                
                formData.append('path','pic');
                this.$axios.post('/file/uploadFile',formData).then((res) => {
                    if(res.data!=null){
                        this.fileList= [];
                        this.form.picture = res.data[0];

                    }
                }).catch(function(error){
                    this.uploadingFile = false;
                })
                this.uploadingFile = false;
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
        margin-left:14%;
    }

    .buttons{
        margin-top:4em;
        margin-left:5em;
    }
</style>