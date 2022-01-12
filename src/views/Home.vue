<template>
  <div>
    <div class="logo"></div>
    <div class="header-wrap">
      <div class="header-title">110年12月</div>
      <div class="header-info">
        共 {{ allItem.itemNum }} 張，總金額 {{ allItem.amount }} 元
      </div>
    </div>

    <div v-for="(i, k) in itemData.arr" :key="k">
      <div class="item-row" @click="openClick(i, k)">
        <div class="d-f">
          <div class="type">
            <div class="date">{{ i.showTime }}</div>
            <div class="status yellow" :class="[!i.showCss && 'red']">
              {{ i.showWay }}
            </div>
          </div>
          <div class="info">
            <div class="title">{{ i.showTitle }}</div>
            <div class="sellerName">{{ i.showSeller }}</div>
          </div>
        </div>

        <div class="price">{{ i.showAmount }}元</div>
      </div>
    </div>
    <div class="light-box-area" v-show="infoOpen.click">
      <svg-close class="close" @click="closeClick()"></svg-close>
      <light-box
        :id="infoOpen.dataArr.id"
        :showWay="infoOpen.dataArr.showWay"
        :invNum="infoOpen.dataArr.invNum"
        :time="infoOpen.dataArr.time"
        :showSeller="infoOpen.dataArr.showSeller"
        :showDetais="infoOpen.dataArr.showDetais"
        :showAmount="infoOpen.dataArr.showAmount"
        :showCss="infoOpen.dataArr.showCss"
        :del="del"
      ></light-box>
    </div>

    <div class="key-in">
      <div>掃描輸入</div>
      <router-link to="/input">
        <div>手輸發票</div>
      </router-link>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import apiHelper from "../utils/apiHelper";
import dayjs from 'dayjs'
import LightBox from "../components/LightBox.vue";
import axios from "axios";
import SvgClose from "../components/SvgClose.vue";

export default {
  name: "Home",
  components: { LightBox, SvgClose },
  setup() {
    const itemData = reactive({
      arr: [],
    });

    const allItem = reactive({
      amount: 0,
      itemNum: "",
    });

    const infoOpen = reactive({
      click: false,
      dataArr: [],
    });

    const nowtime = reactive({
      ROCYear: "110",
      month: "12",
    });

    const openClick = (i) => {
      infoOpen.click = !infoOpen.click;
      infoOpen.dataArr = i;
      // console.log(i, "讓你看看我長怎樣");
    };

    const closeClick = () => {
      infoOpen.click = !infoOpen.click;
      infoOpen.dataArr = {};
    };

    //項目時間排序
    const sortItem = () => {
      itemData.arr.sort(function (a, b) {
        return a.time < b.time ? 1 : -1;
      });
    };

    //發票數量 與 總金額
    const addAll = () => {
      allItem.amount = 0;
      for (let i = 0; i < itemData.arr.length; i++) {
        allItem.amount += Number(itemData.arr[i].addAmount);
        console.log(itemData.arr[i].addAmount, "夭壽喔");
        console.log(allItem.amount, "妖魔鬼怪ㄟ");
      }
      // 千位符
      allItem.amount = allItem.amount.toLocaleString();
      allItem.itemNum = itemData.arr.length.toLocaleString();
    };

    // 篩選今年的表單
    const filterItem = () => {
      itemData.arr = itemData.arr.filter((e) => {
        return e.ROCYear == nowtime.ROCYear && e.theMonth == nowtime.month;
      });
      console.log(itemData.arr, "被篩過後");
    };

    const callData = () => {
      let handleData = [];
      apiHelper.get(apiHelper.apiServers.url, "invoices").then((res) => {
        console.log(res, "get");

        handleData = res.map((e) => {
          let check = e.status == "已確認" ? true : false;
          return {
            ...e,
            showTime: dayjs(e.time).format("MM/DD"),
            ROCYear: dayjs(e.time).format("YYYY") - 1911,
            theMonth: dayjs(e.time).format("MM"),
            showTitle: check ? e.details[0].description : e.invNum,
            showSeller: check ? e.sellerName : "無店家資料",
            showWay: check ? (e.type == 0 ? "載具" : "電子") : e.status, //假設載具為1
            showAmount: check ? e.amount.toLocaleString() : "--",
            addAmount: check ? Number(e.amount) : Number(0),
            showDetais: check ? e.details : null,
            showCss: check,
          };
        });

        itemData.arr = handleData;
        // console.log(handleData, "22");

        filterItem();
        sortItem();
        addAll();
      });
    };

    // 刪除
    const del = (e) => {
      axios
        .delete("http://localhost:3000/invoices/" + e)
        .then((res) => {
          console.log(res, "刪ㄌ");
          alert("此筆資料已刪除");
          // 重新渲染資料
          closeClick();
          callData();
        })
        .catch((err) => {
          console.log(err, "沒刪掉");
        });
    };

    onMounted(() => {
      callData();
    });

    return {
      itemData,
      allItem,
      del,
      infoOpen,
      openClick,
      closeClick,
      nowtime,
    };
  },
};
</script>
