<template>
    <div id="navMenu">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>

         <el-menu default-active="1" class="el-menu-vertical-demo" 
            @open="handleOpen" @close="handleClose" :collapse="isCollapse" @select="handleSelect" :router="true"
            background-color="#F5F5F5">
            
            <el-submenu v-for="(item,i) in navList" :key="'1'+i" v-show="item.second" :index="item.name">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{ item.navItem}}</span>
                </template>
                <el-menu-item v-for="(sec,j) in item.second" :key="j" :index="sec.name">{{sec.navItem}}</el-menu-item>
            </el-submenu>
            
            <el-menu-item v-for="(item,i) in navList" :key="i" v-show="!item.second" :index="item.name">
            {{ item.navItem }}
            </el-menu-item>


        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: false,
                navList:[
                    
                    {name:'/orderTable',navItem:'订单查询'},
                    {name:'/hotelTable',navItem:'反馈信息'},
                    {name:'/vipTable',navItem:'用户管理'},
                    {name:'1',navItem:'菜品管理',
                        second:[{name:'/menuTable',navItem:'菜品列表'},
                                {name:'/createMenu',navItem:'新添菜品'},
                                {name:'/typeTable',navItem:'菜品品类'}]},                             
                ]
            };
        },
        created:function(){
           
        },
        methods: {
            handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
                this.$router.push(key);
            }
        }
  }
</script>
<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>
