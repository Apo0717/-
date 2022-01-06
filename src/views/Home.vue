<template>
  <div>
    <div class="header-wrap">
      <div class="header-title">110年12月</div>
      <div class="header-info">
        共 {{ allItem.itemNum }} 張，總金額{{ allItem.amount }}元
      </div>
    </div>
    <div
      class="item-row"
      v-for="(i, k) in itemData.arr"
      :key="k"
      @click="i.click = !i.click"
    >
      <div class="type">
        <div class="status">{{ i.showWay }}</div>
        <div class="date">{{ i.showTime }}</div>
      </div>
      <div class="info">
        <div class="title">{{ i.showTitle }}</div>
        <div class="sellerName">{{ i.showSeller }}</div>
      </div>
      <div class="price">{{ i.showAmount }}元</div>
      <light-box
        v-show="i.click"
        :showWay="i.showWay"
        :invNum="i.invNum"
        :time="i.time"
        :showSeller="i.showSeller"
        :showDetais="i.showDetais"
        :showAmount="i.showAmount"
      ></light-box>
    </div>
    <div class="key-in">
      <div class="qr-code">掃描輸入</div>
      <router-link to="/input">
        <div class="manual-input">手輸發票</div>
      </router-link>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import apiHelper from "../utils/apiHelper";
import moment from "moment";
import LightBox from "../components/LightBox.vue";

export default {
  name: "Home",
  components: { LightBox },
  setup() {
    const itemData = reactive({
      arr: [],
    });

    const allItem = reactive({
      amount: 0,
      itemNum: "",
    });

    const callData = () => {
      let handleData = [];
      apiHelper.get(apiHelper.apiServers.url, "invoices").then((res) => {
        console.log(res, "get");

        handleData = res.map((e) => {
          let check = e.status == "已確認" ? true : false;
          return {
            ...e,
            showTime: moment(e.time).format("MM/DD"),
            showTitle: check ? e.details[0].description : e.invNum,
            showSeller: check ? e.sellerName : "無店家資料",
            showWay: check ? (e.type == 0 ? "載具" : "電子") : e.status, //假設載具為1
            showAmount: check ? e.amount : "--",
            addAmount: check ? e.amount : 0,
            showDetais: check ? e.details : null,
            click: false,
          };
        });

        itemData.arr = handleData;
        console.log(handleData, "22");

        for (let i = 0; i < itemData.arr.length; i++) {
          allItem.amount += itemData.arr[i].addAmount;
        }

        allItem.itemNum = itemData.arr.length;

        console.log(allItem.amount, "錢錢");
      });
    };

    onMounted(() => {
      callData();
    });

    return { itemData, allItem };
  },
};
</script>
