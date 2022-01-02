<template>
  <div>
    <label for="manualinput">
      <div class="manual-input-info" id="manualinput">
        <div class="input-row">
          輸入發票號碼
          <div class="input-row">
            <input
              type="text"
              placeholder="大寫英文"
              v-model="number1.val"
              maxlength="2"
              onfocus="if(this.value == this.defaultValue) this.value = ''"
            />
            <input
              type="text"
              placeholder="8碼發票號碼"
              v-model="number2.val"
              maxlength="8"
            />
          </div>
        </div>
        <div class="input-row">
          開立時間
          <div class="input-row">
            <!-- 西元年 -->
            <label
              ><input
                list="year-option"
                name="year-option"
                placeholder="西元年"
                maxlength="4"
                v-model="year.val"
                @focus="yearClean()"
            /></label>
            <datalist id="year-option">
              <option
                :value="y"
                v-for="(y, yk) in year.option"
                :key="yk"
              ></option>
            </datalist>
            <!-- <input
              type="text"
              placeholder="西元年"
              v-model="year.val"
              maxlength="4"
            /> -->
            <!-- 月份 -->
            <label
              ><input
                list="month-option"
                name="month-option"
                placeholder="月份"
                maxlength="2"
                v-model="month.val"
                @focus="monthClean()"
            /></label>
            <datalist id="month-option">
              <option
                :value="i"
                v-for="(i, k) in month.option"
                :key="k"
              ></option>
            </datalist>

            <!-- 日期 -->
            <label
              ><input
                list="day-option"
                name="day-option"
                placeholder="日期"
                maxlength="2"
                v-model="day.val"
                @focus="dayClean()"
                :disable="month.val"
            /></label>
            <datalist id="day-option">
              <option
                :value="t"
                v-for="(t, tk) in day.option"
                :key="tk"
              ></option>
            </datalist>
          </div>
        </div>
      </div>
      <input type="submit" @click="postData()" />
    </label>
  </div>
</template>
<script>
import { reactive, onMounted, watch } from "vue";
// import apiHelper from "../utils/apiHelper";

export default {
  name: "Input",
  components: {},
  setup() {
    const number1 = reactive({
      val: "",
    });

    const number2 = reactive({
      val: "",
    });

    const year = reactive({
      val: "",
      option: [],
    });

    const month = reactive({
      val: "",
      option: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    });

    const day = reactive({
      val: "",
      option: [],
      errMsg: false,
    });

    // 清空字串
    const cleanstring = () => {
      number1.val = "";
      number2.val = "";
      year.val = "";
      month.val = "";
      day.val = "";
    };

    const yearClean = () => {
      year.val = "";
    };

    const monthClean = () => {
      month.val = "";
    };

    const dayClean = () => {
      day.val = "";
    };

    //監聽輸入-英文大寫
    watch(
      () => number1.val,
      (val) => {
        console.log("英文", val);
        number1.val = number1.val.replace(/[^a-zA-Z]/g, "").toUpperCase();
      }
      // { deep: true }
    );

    //監聽輸入-數字
    watch(
      () => number2.val,
      (val) => {
        console.log("數字", val);
        number2.val = number2.val.replace(/\D/g, "");
      }
    );

    //監聽輸入-強制數字4位小於現在年
    // watch(
    //   () => year.val,
    //   (val) => {
    //     console.log("西元年", val);
    //     // year.val = year.val.replace(/\D/g, "");
    //     let i = new Date();
    //     let ii = i.getFullYear();
    //     if (ii < year.val) {
    //       year.val = ii;
    //     } else if (year.val < 1950) {
    //       year.val = 1950;
    //     }
    //   }
    // );

    //監聽輸入-小於2位數字小於12
    //月~~~~~~~~~~~~~
    watch(
      () => month.val,
      (val) => {
        console.log("月", val);
        // month.val = month.val.replace(/\D/g, "");
        if (12 < month.val) {
          console.log("不可以13");
          month.val = 12;
        }
        dayNum();
      }
    );

    //監聽輸入-日
    // watch(
    //   () => day.val,
    //   (val) => {
    //     console.log("日", val);
    //     day.val = day.val.replace(/\D/g, "");
    //     let nowYM = new Date(year.val, month.val, 0);
    //     let dayNum = nowYM.getDate();
    //     day.option = [];
    //     for (let i = 1; i <= dayNum; i++) {
    //       day.option.push(i);
    //       console.log(i, "幾天");
    //     }
    //     return day.option;
    //   }
    // );

    // 年 option
    const yearNum = () => {
      let d = new Date();
      let dd = d.getFullYear(); //現在年
      for (let i = 1950; i <= dd; i++) {
        year.option.push(i);
        // console.log(i, "幾天");
      }
    };

    // 日 option
    const dayNum = () => {
      let nowYM = new Date(year.val, month.val, 0);
      console.log(nowYM, "nowYM");
      let dayN = nowYM.getDate();
      console.log(day, "day");
      console.log(day.option, "day.option");
      day.option = [];
      for (let i = 1; i <= dayN; i++) {
        day.option.push(i);
        console.log(day.option, "幾天");
      }
    };

    // 新增資料
    const postData = () => {
      // let handleData = [];
      // apiHelper.post(apiHelper.apiServers.url, "invoices").then((res) => {
      //   console.log(res);
      //   handleData = res.map((e) => {
      //     return {
      //       ...e,
      //     };
      //   });
      // });
      // console.log(year.errMsg, "yo");
      // console.log(year.val, "輸入年");

      cleanstring();
    };

    onMounted(() => {
      yearNum();
      // dayNum();
    });

    return {
      number1,
      number2,
      year,
      month,
      day,
      postData,
      cleanstring,
      yearClean,
      monthClean,
      dayClean,
    };
  },
};
</script>
