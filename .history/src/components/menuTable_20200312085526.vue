<template>

    <div id="booksTable">

      <el-col :span="5">
        <el-input v-model="findByName"  placeholder="请输入菜品名" ></el-input>
      </el-col>
      <el-button  @click="findByNameButton" icon="el-icon-search">搜索</el-button>

      <el-select  v-model="type" placeholder="菜品类别" autocomplete="off" @change="typeChange()"
                  style="width: 30%">
        <el-option v-for="item in typeList" :key="item.id" :label="item.typeName"
                    :value="item.typeName"></el-option>
      </el-select>

        <el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" 
            @selection-change="handleSelectionChange" :cell-style="cellStyle" :header-cell-style="rowClass">


            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="picture" label="菜品" align="center">
              <template slot-scope="scope">            
                  <img :src="scope.row.picture"  min-width="70" height="70" />
              </template>  
            </el-table-column>
            <el-table-column prop="dishes" label="菜名" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="price" label="价格" width="100"></el-table-column>
            
            <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type=""  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="info" @click="handleChangeStatus(scope.$index, scope.row)" v-show="scope.row.status == 1">下架</el-button>
              <el-button size="mini" type="success" @click="handleChangeStatus(scope.$index, scope.row)" v-show="scope.row.status == 2">上架</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>

          

        </el-table>
        <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5,10,50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- 提示删除页面 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
          <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="delVisible = false">取 消</el-button>
              <el-button type="primary" @click="deleteRow" >确 定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑页面 -->
        <el-dialog title="编辑" :visible.sync="editFormVisible"  :close-on-click-modal="false">

          <el-upload
          class="upload"
          drag
          action=""
          :before-upload="UpladFile"
          multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip"></div>
          </el-upload>

          <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
            <el-form-item label="菜名" prop="dishes">
              <el-input v-model="editForm.dishes" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="价格" prop="price">
              <el-input v-model="editForm.price" auto-complete="off"></el-input>
            </el-form-item>
            
            <el-form-item label="菜品类别">
              <el-select clearable size='mini' v-model="editForm.typeId" placeholder="菜品类别" autocomplete="off"
                      style="width: 50%">
              <el-option v-for="item in typeList" :key="item.id" :label="item.typeName"
                        :value="item.id"></el-option>
              </el-select>
            </el-form-item>


          </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
		</el-dialog>

        
    </div>
    
</template>
<script>
export default {
    data(){
        return {

                total:5,
                delVisible:false,    //提示删除框的状态
                currentPage: 1,
　　　　　　　　　pageSize: 5,
                
                msg:"",//记录每一条的信息，便于取id
                delarr:[],//存放删除的数据
                tableData: [{"dishes":"芒果班乾","price":58,"picture":"http://101.133.228.179:8080/pointpayment/pic/600002.jpg","status":2},
                {"dishes":"芒果班乾","price":58,"picture":"http://101.133.228.179:8080/pointpayment/pic/600002.jpg","status":1},
                {"dishes":"芒果班乾","price":58,"picture":"http://101.133.228.179:8080/pointpayment/pic/600002.jpg","status":1},
                {"dishes":"芒果班乾","price":58,"picture":"http://101.133.228.179:8080/pointpayment/pic/600002.jpg","status":1},
                {"dishes":"芒果班乾","price":58,"picture":"http://101.133.228.179:8080/pointpayment/pic/600002.jpg","status":1},
                {"dishes":"芒果班乾","price":58,"picture":"http://101.133.228.179:8080/pointpayment/pic/600002.jpg","status":1}],
                multipleSelection: [],
                editFormVisible: false,//编辑界面是否显示
                findByName:'', //模糊查询的书名
                //菜品类别表
                typeList:[
                  
                ],
                type:'',  //目前菜品类别
                fileList:[],
                //编辑界面数据
                editForm: {
                  dishes:'',
                  price:'',
                  picture:'',
                  typeId:'',
                },
                editLoading:false,

                //编辑表单验证
                editFormRules: {
                  dishes: [
                    { required: true, message: '请输入菜品', trigger: 'blur' }
                  ],
                  price: [
                    { required: true, message: '请输入价格', trigger: 'blur' }
                  ],
                  typeId: [
                    { required: true, message: '请选择菜品类别', trigger: 'blur' }
                  ]
                },
        
        }
    },
    
    created: function(){
      this.getPackData();
      this.getTypeList();
    },

    mounted() {
			this.getTypeList();
    },
    methods: {
      typeChange(){
        this.getPackData();
      },
      
      getTypeList(){
        this.$axios.post('/type/list').then((res) =>{
          this.typeList = res.data;
          // alert(JSON.stringify(res.data));
        })
      },

      findByNameButton(){
         this.$axios({
            method: 'post',
            url: '/menu/getByName',
            params:{"name":this.findByName}
        }).then((res) => {
            this.tableData = res.data;
            this.total=this.tableData.length;
            // alert(JSON.stringify(res.data));
        }).catch(function(error){
            console.log(error);  
        })
      },
      getPackData() {
        this.$axios({
            method: 'post',
            url: '/menu/listByType',
            params:{"type":this.type}
        }).then((res) => {
            this.tableData = res.data;
            this.total=this.tableData.length;
            // alert(JSON.stringify(res.data));
        }).catch(function(error){
            console.log(error);  
        })
        
      },

      UpladFile(file){
        console.log(file)
        this.fileList = [...this.fileList, file];
        console.log(this.fileList);
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
              this.editForm.picture = res.data[0];
              // console.log(this.editForm.picture)
            }
        }).catch(function(error){
            
        })

        },
      toggleSelection(rows) {
          if (rows) {
              rows.forEach(function(row)  {
                  this.$refs.multipleTable.toggleRowSelection(row);
              });
          } else {
              this.$refs.multipleTable.clearSelection();
          }
      },
      handleSelectionChange(val) {
          this.multipleSelection = val;
      },
      callbackFunction(result) {
                alert(result + "aaa");
            },
      handleSizeChange(val){
        this.pageSize = val;
        this.currentPage = 1;
        // this.fetchData(1, val);
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val){
        this.currentPage = val;
        // this.fetchData(val, this.pageSize);
        // console.log(`当前页: ${val}`);
      },
      cellStyle({row,column,rowIndex,columnIndex}){
        return "text-align:center;" 
      },
      rowClass({row,rowIndex}){
        return "text-align:center;" 
      },

      handleDelete(index, row) {
        this.msg=row;
        this.delarr.push(this.msg.id);//把单行删除的每条数据的id添加进放删除数据的数组
        this.delVisible = true;
      },
      deleteRow(){
        this.$axios({
            method: 'post',
            url: '/menu/delete',
            params:{"id":this.delarr[0]}
        }).then((res) => {
            if(res.data==true){
              this.getPackData();
              this.$message.success('删除成功');
            }
        }).catch(function(error){
            console.log(error);  
        })

        this.msg="";
        this.delarr=[];
        this.delVisible = false;//关闭删除提示模态框
      },

      //显示编辑界面   Object.assign({}, row) 浅拷贝、对象属性的合并
      handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
      },
      handleChangeStatus:function(index,row){
        var that = this
        var status = 0;
        if(row.status == 1){
          status = 2;
        }else{
          status = 1;
        }
        
        this.$axios.post('/menu/update',{id:row.id,status:status}).then((res) =>{
          if(res.data == true){
            this.$message.success('提交成功');
          }
          row.status = status;
        }).catch(function(error){
          console.log(error)
          that.$message.error('提交失败')
        })
      },
      editMenu:function(para){
        // alert(JSON.stringify(para));
        this.$axios.post('/menu/update',para).then((res) => {
            if(res.data==true){
              this.$message.success('提交成功');
            }

            this.$refs['editForm'].resetFields();
            this.editFormVisible = false;
            this.getPackData();
            this.editLoading = false;
                
          }).catch(function(error){
                console.log(error);
       })
      },

      editSubmit:function(){
        this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
              //NProgress.start();
              
							let para = Object.assign({}, this.editForm);
              
							// para.publishingDate = (!para.publishingDate || para.publishingDate == '') ? '':util.formatDate.format(new Date(para.publishingDate), 'yyyy-MM-dd');
              this.editMenu(para);
						});
					}
				});
      }
      
    }

} 
</script>
<style>
    .el-table th {
        text-align: center;
    }

    /* .el-table tbody tr td:first-child {
        text-align: center;
    } */
    .upload{
      margin-left: 6em;
      margin-bottom: 2em;
    }
</style>
