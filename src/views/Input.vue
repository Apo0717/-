<template>
  <div>
    <div class="go-back" @click="goBack()">????</div>
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
                :disabled="
                  year.val.length !== 4 || !month.val || month.val == 0
                "
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
      <input
        type="submit"
        @click="postData()"
        :disabled="
          number1.val.length !== 2 ||
          number2.val.length !== 8 ||
          !year.val ||
          !month.val ||
          !day.val"
      />
    </label>
  </div>
</template>
<script>
import { reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import apiHelper from "../utils/apiHelper";

export default {
  name: "Input",
  components: {},
  setup() {
    const itemData = reactive({
      arr: [],
    });

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
      option: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ],
    });

    const day = reactive({
      val: "",
      option: [],
      errMsg: false,
    });

    //call資料
    const callData = () => {
      apiHelper.get(apiHelper.apiServers.url, "invoices").then((res) => {
        itemData.arr = res;
        console.log(itemData.arr, "itemData.arr");
        console.log(itemData.arr[0], "itemData的內容");
        // let maxId = Math.max(...itemData.arr.map(p => p.id))
        // console.log(maxId, "最大ID");
      });
    };

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
    watch(
      () => year.val,
      (val) => {
        console.log("西元年", val);
        year.val = year.val.replace(/\D/g, "");
        let i = new Date();
        let ii = i.getFullYear();
        if (ii < year.val) {
          year.val = ii;
        }
      }
    );

    //監聽輸入-月
    //小於2位數字,小於12
    watch(
      () => month.val,
      (val) => {
        console.log("月", val);
        month.val = month.val.replace(/\D/g, "");
        if (12 < month.val) {
          console.log("不可以13");
          month.val = 12;
        }
        dayNum();
      }
    );

    //監聽輸入-日
    //不可以大於該月最大日
    watch(
      () => day.val,
      (val) => {
        console.log("日", val);
        day.val = day.val.replace(/\D/g, "");
        let big = day.option[day.option.length - 1];
        console.log("最大日", big);
        if (day.val > 10 && day.val > big) {
          day.val = big;
        }
      }
    );

    // 年 option
    const yearNum = () => {
      let d = new Date();
      let dd = d.getFullYear(); //現在年
      for (let i = 1950; i <= dd; i++) {
        year.option.push(i);
      }
      year.option = year.option.reverse();
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

    // POST發票資料(新增資料)
    const postData = () => {
      // 強制年不可以小於發票起始年
      if (year.val.length < 4 && year.val < 1950) {
        year.val = 1950;
      }

      // 強制輸入的月份一定是2位數
      if (month.val.length < 2) {
        month.val = month.val.padStart(2, 0);
      }

      //強制輸入的日期一定是2位數
      if (day.val.length < 2) {
        day.val = day.val.padStart(2, 0);
      }

      // console.log(year.val, "輸入年");
      // console.log(month.val, "輸入月");
      // console.log(day.val, "輸入日");

      let inputNum = number1.val + number2.val;
      let timeAfter =
        year.val + "-" + month.val + "-" + day.val + " " + "00:00:00";
      let maxId = Math.max(...itemData.arr.map((p) => p.id));

      let postArr = {
        id: maxId + 1,
        invNum: inputNum,
        status: "驗證中",
        time: timeAfter,
        type: 1,
      };
      apiHelper
        .post(apiHelper.apiServers.url, "invoices", postArr)
        .then((res) => {
          console.log(res, "post");
          cleanstring();
          alert("發票輸入成功");
          console.log(day.val, "♩ ┏( ･o･) ┛♫");
        });
    };

    const router = useRouter();

    const goBack = () => {
      router.go(-1);
    };

    onMounted(() => {
      callData();
      yearNum();
    });

    return {
      callData,
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
      goBack,
    };
  },
};
</script>
