<template>

    <div id="booksTable">
        
        <!-- <el-button type="primary" round @click="addFormVisible = true">添加菜品种类</el-button> -->
        <el-button icon="el-icon-edit" @click="addFormVisible = true" style="margin-bottom: 2em">添加菜品种类</el-button>
        <el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" 
            @selection-change="handleSelectionChange" :cell-style="cellStyle" :header-cell-style="rowClass">


            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="typeName" label="种类名称" show-overflow-tooltip width="200"></el-table-column>    
            <el-table-column label="操作">
                <template slot-scope="scope">
                <el-button size="mini" type=""  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">

          <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
            <el-form-item label="类别名:" prop="typeName">
              <el-input v-model="editForm.typeName" auto-complete="off" style="width:70%"></el-input>
            </el-form-item>       
          </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
		</el-dialog>

        <!--新添页面 -->
        <el-dialog title="新添" :visible.sync="addFormVisible" :close-on-click-modal="false">

          <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
            <el-form-item label="类别名" prop="typeName">
              <el-input v-model="addForm.typeName" auto-complete="off"></el-input>
            </el-form-item>  
            <el-form-item label="排序等级" prop="sort">
              <el-input v-model="addForm.sort" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark" auto-complete="off"></el-input>
            </el-form-item>        
          </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
		</el-dialog>

        
    </div>
    
</template>
<script>
export default {
    data(){
        return {
                addFormVisible:false,
                total:5,
                delVisible:false,    //提示删除框的状态
                currentPage: 1,
　　　　　　　　　pageSize: 5,
                
                msg:"",//记录每一条的信息，便于取id
                delarr:[],//存放删除的数据
                tableData: [],
                multipleSelection: [],      //被选中的行
                selection:[],               //被选中行待删除数据
                editFormVisible: false,//编辑界面是否显示
                findByName:'', //模糊查询的书名
                //菜品类别表
                typeList:[
                  
                ],
                type:'',  //目前菜品类别
                fileList:[],
                //编辑界面数据
                editForm: {
                  id:'',
                  typeName:''
                },
                addForm: {
                  typeName:''
                },
                editLoading:false,
                addLoading:false,
                //编辑表单验证
                editFormRules: {
                  typeName: [
                    { required: true, message: '请输入菜品类别名', trigger: 'blur' }
                  ]
                },
                addFormRules: {
                  typeName: [
                    { required: true, message: '请输入菜品类别名', trigger: 'blur' }
                  ]
                },
        
        }
    },
    
    created: function(){
        this.getPackData();
    },

    mounted() {
	    this.getPackData();
    },
    methods: {
      getPackData() {

        this.$axios.get('/type/list').then((res) =>{
         let result = res.data;
          this.tableData = result.data;
          this.total=this.tableData.length;
          // alert(JSON.stringify(res.data));
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
      handleSelectionChange(selection) {     
      
        this.multipleSelection = selection;
        // console.log(selection)       
    
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
        this.selection = this.multipleSelection;
        this.msg=row;
        this.delarr.push(this.msg.id);//把单行删除的每条数据的id添加进放删除数据的数组
        this.delVisible = true;
      },
      deleteRow(){
          
       let ids = [];
        if(this.selection.length!=0){
            for(var i = 0,len = this.selection.length;i<len;i++){
                ids.push(this.selection[i].id); 
            }
            this.$axios({
                    method: 'post',
                    url: '/type/delete',
                    params:{"ids":ids}
                }).then((res) => {
                    let result = res.data;
                    if(result.code==0){
                    this.getPackData();
                    this.$message.success('删除成功');
                    }else{
                      this.$message.error('删除失败');
                    }
                }).catch(function(error){
                    console.log(error);  
                })
        }
        else{
            this.$axios({
                method: 'post',
                url: '/type/delete',
                params:{"ids":this.delarr[0]}
            }).then((res) => {
                let result = res.data;
                    if(result.code==0){
                    this.getPackData();
                    this.$message.success('删除成功');
                    }else{
                      this.$message.error('删除失败');
                    }
            }).catch(function(error){
                console.log(error);  
            })
            this.msg="";
            this.delarr=[];
        }
        this.delVisible = false;//关闭删除提示模态框
      },

      //显示编辑界面   Object.assign({}, row) 浅拷贝、对象属性的合并
      handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
      },

      editType:function(para){
        var that = this
        this.$axios.post('/type/update',para).then((res) => {
          let result = res.data;
            if(result.code==0){
              this.$message.success('提交成功');
            }else{
              that.$message.error('修改失败');
            }
            this.$refs['editForm'].resetFields();
            this.editFormVisible = false;
            this.getPackData();
            this.editLoading = false;
                
          }).catch(function(error){
            that.editLoading = false;
            that.$message.error('修改失败');
       })
      },
      addType:function(para){
        var that = this
        this.$axios.post('/type/add',para).then((res) => {
          let result = res.data;
            if(result.code == 0){
              this.$message.success('提交成功');
            }else{
              this.$message.error('添加失败');
            }

            that.$refs['addForm'].resetFields();
            that.addFormVisible = false;
            that.getPackData();
            that.addLoading = false;
                
          }).catch(function(error){

            that.addLoading = false;
            that.$message.error('添加失败');
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
                        this.editType(para);
                    });
                }
            });
      },

      addSubmit:function(){
          this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        // para.publishingDate = (!para.publishingDate || para.publishingDate == '') ? '':util.formatDate.format(new Date(para.publishingDate), 'yyyy-MM-dd');
                        this.addType(para);
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
