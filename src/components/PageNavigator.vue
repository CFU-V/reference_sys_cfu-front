<template>
  <div>
    <div class="PageNavigator">
      <button v-if="GetNumPage > 3" @click="NextPage(1)">1...</button>
      <button
        @click="NextPage(GetCurrectPage(GetNumPage,index,maxPage))"
        v-for="index in (maxPage > 5 ? 5 : maxPage)"
        :key="index"
        :id="GetNumPage === GetCurrectPage(GetNumPage,index,maxPage) ? 'current' : null"
      >{{ GetCurrectPage(GetNumPage,index,maxPage) }}</button>
      <button
        v-if="GetNumPage > 3 && GetNumPage < maxPage-2"
        @click="NextPage(maxPage)"
      >...{{ maxPage }}</button>
    </div>
  </div>
</template>

<script>
//(maxPage > 1 ? 5 : 1)
export default {
  props: {
    url: String,
    maxPage: Number,
    Page: String
  },
  data() {
    return {};
  },
  computed: {
    GetNumPage() {
      const res = parseInt(this.Page === null ? 1 : this.Page);
      return res;
    }
  },
  methods: {
    NextPage(_page) {
      this.$emit("click", _page);
      if (String(this.Page) === String(_page)) return;
      this.$router.push(this.url + _page);
    },
    GetCurrectPage(_num1, _num2, _stop) {
      _num1 = _num1 > _stop ? _stop : _num1;
      if (_num1 + 1 === _stop) _num1 -= 1;
      else if (_num1 >= _stop) _num1 -= 2;
      const res = Number(_num1 >= 4 ? _num1 + _num2 - 1 - 2 : _num2);
      return res;
    }
  }
};
</script>

<style scoped>
.PageNavigator {
  clear: both;
  height: 130px;
  border-top: 1px solid #cfcfcf;
  padding-top: 45px;
  margin-top: 35px;
}

.PageNavigator button {
  background-color: white;
  color: #333;
  font-size: 18px;
  border: 0;
  float: left;
  width: 55px;
  height: 40px;
  border-bottom: 1px solid #cfcfcf;
  border-top: 1px solid #cfcfcf;
}

.PageNavigator button:first-child {
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  border-left: 1px solid #cfcfcf;
}

.PageNavigator button:last-child {
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  border-right: 1px solid #cfcfcf;
}

#current {
  /* font-weight: 700; */
  color: #fff;
  background-color: #4285f4;
  border: 1px solid #4285f4;
}

.PageNavigator button:hover {
  background-color: #3974d3;
  color: #fff;
  border: 1px solid #3974d3;
}
</style>
