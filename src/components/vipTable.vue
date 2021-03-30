<template>
    <div>
        <div style="margin-bottom: 1em;">
            <!-- <el-col :span="2">
                <el-input v-model="order.tablenumber"  placeholder="请输入桌号名"></el-input>
            </el-col> -->
        
            <el-col :span="5" >
                <el-input v-model="wxaccount"  placeholder="顾客微信名" ></el-input>
            </el-col>
            <el-button @click="search" icon="el-icon-search">搜索</el-button>
        </div>


        <el-table ref="multipleTable" :data="tableData" border style="width: 100%" 
            @selection-change="handleSelectionChange" :cell-style="cellStyle" :header-cell-style="rowClass">


            <el-table-column prop="username" label="用户昵称" show-overflow-tooltip min-width="10%"></el-table-column>
            <el-table-column prop="imageUrl" label="头像" align="center" min-width="20%">
              <template slot-scope="scope">            
                  <img :src="scope.row.imgUrl"  min-width="70" height="70" />
              </template>  
            </el-table-column>
            <el-table-column align="center" prop="gender" label="性别" min-width="10%">
                <template slot-scope="{row: {gender}}">
                <span v-if="+gender === 1">男</span>
                <span v-else>女</span>
                </template>
            </el-table-column>

            <el-table-column prop="country" label="国家" show-overflow-tooltip min-width="20%"></el-table-column>
            <el-table-column prop="province" label="省份" min-width="10%"></el-table-column>

            <el-table-column align="center" prop="vip" label="是否vip" min-width="10%">
                <template slot-scope="{row: {vip}}">
                <span v-if="+vip === 1">是</span>
                <span v-else>否</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
                <el-button type="warning" plain @click="handleChangeStatus(scope.$index, scope.row)" v-show="scope.row.vip == 1">
                 取消vip
                </el-button>
                <el-button type="warning" plain @click="handleChangeStatus(scope.$index, scope.row)" v-show="scope.row.vip == 0">
                 设置成vip
                </el-button>
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
                wxaccount:''
        
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
            method: 'get',
            url: '/user/getUserList',
            params:{"pageSize":this.pageSize,"pageNo":this.currentPage}
        }).then((res) => {
            let result = res.data;
            if(result.code == 0){
            this.tableData = result.data.list;
            this.total=result.data.total;
            }
            // alert(JSON.stringify(res.data));
        }).catch(function(error){
            console.log(error);  
        })
        
      },
      search(){
        this.$axios({
            method: 'get',
            url: '/user/getUserList',
            params:{"pageSize":this.pageSize,"pageNo":this.currentPage,"username":this.wxaccount}
        }).then((res) => {
            let result = res.data;
            if(result.code == 0){
            this.tableData = result.data.list;
            this.total=result.data.total;
            }
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
        if(this.wxaccount != ''){
            this.search();
        }else{
            this.getPackData();
        }
        // this.fetchData(1, val);
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val){
        this.currentPage = val;
        if(this.wxaccount != ''){
            this.search();
        }else{
            this.getPackData();
        }
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
          let status = 0;
        if(row.vip ==0){
            status = 1;
        }
        this.$axios({
            method: 'post',
            url: '/user/edit',
            data:{"username":row.username,"status":status}
        }).then((res) =>{
          if(res.data.code == 0){
            this.$message.success('处理成功');
            this.getPackData();
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