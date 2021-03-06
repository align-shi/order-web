<template>
    <div>
        <div style="margin-bottom: 1em;">
            <el-col :span="2">
                <el-input v-model="order.tablenumber"  placeholder="请输入桌号名"></el-input>
            </el-col>
        
            <el-col :span="5" :offset="1">
                <el-input v-model="order.wxaccount"  placeholder="顾客微信名" ></el-input>
            </el-col>
            <el-button @click="search" icon="el-icon-search">搜索</el-button>
        </div>


        <el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" 
            @selection-change="handleSelectionChange" :cell-style="cellStyle" :header-cell-style="rowClass">


            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <div>
                            <el-card class="box-card" shadow="hover" v-for="(item,i) in props.row.carts" :key="i" 
                                style="float:left;margin-left:1em;margin-bottom:.5em;background-color:#F5F5F5">
                                菜品 : {{item.dishes}}   &#12288;&#12288;单价 : {{item.price}}    &#12288;&#12288;数量 : {{item.quantity}}
                            </el-card>
                        </div>
                        
                    </el-form>
                </template>
            </el-table-column>

            <el-table-column prop="openId" label="用户标识" show-overflow-tooltip width="140"></el-table-column>
            <el-table-column prop="wxaccount" label="顾客微信名" align="center"></el-table-column>
            <el-table-column prop="tablenumber" label="桌号" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="money" label="总额(元)" width="100"></el-table-column>
            
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="warning" plain @click="handleChangeStatus(scope.$index, scope.row)" v-show="scope.row.status == 1">
                  请求处理    <i class="el-icon-loading"></i>
                </el-button>
                <div v-show="scope.row.status == 2"> 已处理&#12288;<i class="el-icon-check"></i></div>
                <!-- <i class="el-icon-check" v-show="scope.row.status == 2"></i> -->
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
    </div>
</template>

<script>
export default {
    data(){
        return {

                total:5,
                currentPage: 1,
　　　　　　　　　pageSize: 5,
                
                msg:"",//记录每一条的信息，便于取id
       
                tableData: [],
                multipleSelection: [],
                order:{
                    tablenumber:null,
                    wxaccount:''
                }
        
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
          
        this.$axios({
            method: 'post',
            url: '/order/getListBy',
            data:{}
        }).then((res) => {
            this.tableData = res.data;
            this.total=this.tableData.length;
            // alert(JSON.stringify(res.data));
        }).catch(function(error){
            console.log(error);  
        })
        
      },
      search(){
        this.$axios({
            method: 'post',
            url: '/order/getListBy',
            data:this.order
        }).then((res) => {
            this.tableData = res.data;
            this.total=this.tableData.length;
            // alert(JSON.stringify(res.data));
        }).catch(function(error){
            console.log(error);  
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

      handleChangeStatus:function(index,row){

        this.$axios({
            method: 'post',
            url: '/order/handleOrder',
            params:{id:row.id}
        }).then((res) =>{
          if(res.data == true){
            this.$message.success('处理成功');
          }
          row.status = 2;
        }).catch(function(error){
          console.log(error)
          that.$message.error('处理失败')
        })
        
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

