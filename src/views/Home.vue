<template>
  <div>
    <div class="item-row" v-for="(i, k) in itemData.arr" :key="k">
      <div class="type">
        {{ i.showWay }}
        <div class="date">{{ i.showTime }}</div>
      </div>
      <div class="info">
        <div class="title">{{ i.showTitle }}</div>
        <div class="sellerName">{{ i.showSeller }}</div>
      </div>
      <div class="price">{{ i.showAmount }}元</div>
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

export default {
  name: "Home",
  components: {},
  setup() {
    const itemData = reactive({
      arr: [],
    });

    console.log(this); // 會得到 undefined
    const callData = () => {
      let handleData = [];
      apiHelper.get(apiHelper.apiServers.url, "invoices").then((res) => {
        console.log(res, "11");

        handleData = res.map((e) => {
          let check = e.status == "已確認" ? true : false;
          return {
            ...e,
            showTime: moment(e.time).format("MM/DD"),
            showTitle: check ? e.details[0].description : e.invNum,
            showSeller: check ? e.sellerName : "無店家資料",
            showWay: check ? (e.type == 0 ? "載具" : "電子") : e.status, //假設載具為1
            showAmount: check ? e.amount : "--",
          };
        });

        itemData.arr = handleData;
        console.log(itemData, "22");
      });
    };

    onMounted(() => {
      callData();
    });

    return { itemData };
  },
};
</script>
