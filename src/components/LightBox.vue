<template>
  <div class="light-box">
    <div class="li-header">
      <div class="d-f">
        <div class="li-status status yellow" :class="[!showCss && 'red']">
          {{ showWay }}
        </div>
        <div class="li-title-name">{{ invNum }}</div>
      </div>
      <div class="li-date">{{ time }}</div>
      <div class="li-sellerName">{{ showSeller }}</div>
    </div>
    <div class="li-body">
      <div class="li-table">
        <div class="li-th">
          <div class="i-name">品項</div>
          <div class="i-num">數量</div>
          <div class="i-price">單項</div>
          <div class="i-amount">小計</div>
        </div>
        <div
          class="li-row"
          v-for="(e, k) in showDetais"
          :key="k"
          v-show="showDetais"
        >
          <div class="i-name">{{ e.description }}</div>
          <div class="i-quantity">{{ e.quantity }}</div>
          <div class="i-price">{{ e.unitPrice }}</div>
          <div class="i-amount">{{ e.amount }}</div>
        </div>

        <div class="no-details" v-show="!showDetais">
          - 沒有明細資料 -<br />此張發票可能正在等待店家更新或驗證。
        </div>

        <div class="li-amount">
          <div>總金額</div>
          <div>{{ showAmount }} 元</div>
        </div>
      </div>
      <div class="del-btn" v-show="!showDetais" @click="del(id)">
        ⊝ 刪除發票
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted } from "vue";

export default {
  name: "",
  props: {
    id: { type: Number },
    showWay: { type: String },
    invNum: { type: String },
    time: { type: String },
    showSeller: { type: String },
    showDetais: { type: Array },
    showAmount: { type: Number },
    showCss: { type: String },
    del: { type: Function },
  },
  components: {},

  setup() {
    onMounted(() => {});

    return {};
  },
};
</script>
