<template>
  <div id="store" class="mt-3">
    <div class="container text-center">
      <h1>全台桌遊店家</h1>
      <h3>資料來源 - 新天鵝堡與桌末狂歡</h3>
      <nav>
        <ul class="pagination justify-content-center flex-wrap">
          <li class="page-item d-none d-md-block" :class="{'disabled': (currPage === 1)}" @click.prevent="setPage(currPage-1); reOrder()">
            <a class="page-link" href="#">Prev</a>
          </li>
          <li class="page-item" 
              v-bind:class="{'active': (currPage === (n))}"               
              @click.prevent="setPage(n); reOrder()"               
              v-for="n in totalPage">
            <a class="page-link" href="#">{{n}}</a>
          </li>
          <li class="page-item d-none d-md-block" :class="{'disabled': (currPage === totalPage)}" @click.prevent="setPage(currPage+1); reOrder()">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
      <div class="search">搜尋：
        <input type="text" v-model="filter_name">
        <button @click="filter_name = ''; reOrder()">清除</button>
      </div>
      <div class="search">店家類型：
        <button @click="filter_name = '桌遊專門店'; reOrder(); currPage=1;">桌遊專門店</button>
        <button @click="filter_name = '桌遊販賣店'; reOrder(); currPage=1;">桌遊販賣店</button>
        <button @click="filter_name = '複合式餐飲桌遊店'; reOrder(); currPage=1;">複合式餐飲桌遊店</button>
        <button @click="filter_name = '其他'; reOrder(); currPage=1;">其他</button>
      </div>
      <div class="search">縣市：
        <button @click="filter_name = '臺北'; reOrder(); currPage=1;">臺北</button>
        <button @click="filter_name = '新北'; reOrder(); currPage=1;">新北</button>
        <button @click="filter_name = '桃園'; reOrder(); currPage=1;">桃園</button>
        <button @click="filter_name = '臺中'; reOrder(); currPage=1;">臺中</button>
        <button @click="filter_name = '高雄'; reOrder(); currPage=1;">高雄</button>
      </div>
    </div>
    <div class="container">
      <div class="inner-column">
        <div class="store" v-for="(data,id) in filteredRows.slice(pageStart,pageStart+countOfPage)">
          <div class="box" data-toggle="modal" data-target="#store-info" @click="getNo(data.no)">
            <div class="title">{{data.storeName}}</div>
            <hr/>
            <img class="img-fluid w-100" :src="'./static/image/' + data.storePhoto " alt=""></img>
            <div class="address">地址：{{data.storeAddress}}</div>
            <hr/>
            <div class="info">類型：{{data.storeType}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="store-info">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning-light">
            <h5 class="modal-title">{{filterStore[0].storeName}}</h5>
            <button type="button" class="close" data-dismiss="modal" >
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-5">
                <img :src="'./static/image/'+filterStore[0].storePhoto " alt="" class="img-fluid w-100">
                <div class="my-1">
                  類型：{{filterStore[0].storeType}}
                  <br>地址：{{filterStore[0].storeAddress}}
                  <br>電話：{{filterStore[0].storeNumber}}
                  <br>營業時間：<span v-html="filterStore[0].storeTime" ></span>
                  <br>消費模式：<span v-html="filterStore[0].storeSpend" ></span>
                </div>
              </div>
              <div class="col-md-7">
                <iframe :src="filterStore[0].googleURL" class="w-100 h-100"></iframe>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>

export default {
  name: 'boardGame',
  data () {
    return {
      stores: [],
      stores_id: "1",
      outclick_show: false,
      page: 0,
      countOfPage: 16,
      currPage: 1,
      filter_name: '', 
    }
  },
  computed: { 
    filteredRows: function(){
      // 因為 JavaScript 的 filter 有分大小寫，
      // 所以這裡將 filter_name 與 stores[n].name 通通轉小寫方便比對。
      var filter_name = this.filter_name.toLowerCase();

      // 如果 filter_name(移除空白後) 有內容，回傳過濾後的資料，否則將原本的 stores 回傳。
      return ( this.filter_name.trim() !== '' )?
        this.stores[2].data.filter(function(d){ 
          return d.storeName.toLowerCase().indexOf(filter_name) > -1 
          || d.storeType.toLowerCase().indexOf(filter_name) > -1
          || d.storeAddress.toLowerCase().indexOf(filter_name) > -1
          || d.storePlace.toLowerCase().indexOf(filter_name) > -1
          || d.storeArea.toLowerCase().indexOf(filter_name) > -1
          || d.storeNumber.toLowerCase().indexOf(filter_name) > -1
        })
      :this.stores[2].data;
      // console.log("search");
    },    
    // 搜尋陣列中 stores[2].data.no(在store.js) 與從 getNo() 中取得的data.no相吻合的data.no
    filterStore: function () {
      let vm = this
      return this.stores[2].data.filter(function (el){
        return el.no? el.no===vm.stores_id: 0
      })
    },
    pageStart: function(){
      return (this.currPage - 1) * this.countOfPage;
    },
    totalPage: function(){
      return Math.ceil(this.filteredRows.length / this.countOfPage);
    }
  },
  methods: {        
    setPage: function(idx){
      if( idx <= 0 || idx > this.totalPage ){
        return false;
      }
      this.currPage = idx;    
      return idx;
    },        
    // 傳入data.no 給 stores_id，讓 filterStore 得以從陣列庫中搜尋提取相應資料
    getNo: function(id){
      let vm = this
      this.stores_id = id
      console.log('data.no=', this.stores_id)   
      console.log('this.filterStore()=', vm.filterStore[0].storeName)   
    },  
    closeInfo: function(){
      this.outclick_show = false, 
      $(".store-info").css("transform","translate(-50%,-50%) scale(0)");
    },
    reOrder: function() {    
      let vm = this
      setTimeout(function(){ vm.grid.masonry('reloadItems'); }, 50); 
      setTimeout(function(){ vm.grid.masonry('layout'); }, 50); 
      setTimeout(function(){ vm.grid.masonry('reloadItems'); }, 150); 
      setTimeout(function(){ vm.grid.masonry('layout'); }, 150); 
      // console.log('reloading...')
    },
  },
  created() {
    const store = require("./storeData/store")
    this.stores = store.store_array
  },
  mounted() {
    // masonry
    let vm = this
    vm.grid = $('.inner-column').masonry({
      itemSelector: '.store',
      columnWidth: 220,
      isFitWidth: true
    }); 
    // started
    setTimeout(function(){ vm.grid.masonry('reloadItems'); }, 50); 
    setTimeout(function(){ vm.grid.masonry(); }, 50); 
    setTimeout(function(){ vm.grid.masonry('reloadItems'); }, 500); 
    setTimeout(function(){ vm.grid.masonry(); }, 500); 

    // for searching 
    $( ".search" ).keydown(function(e) {  
      vm.reOrder()
      vm.currPage = 1
      console.log('searching...')
    });    
  }
}    
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>