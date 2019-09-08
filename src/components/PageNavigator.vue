<template>
  <div>
    <div class="PageNavigator">
      <button v-if="GetNumPage > 3" @click="NextPage(1)">1...</button>
      <button @click="NextPage(GetCurrectPage(GetNumPage,index,maxPage))" v-for="index in (maxPage > 1 ? 5 : 1)"
        :key="index"
        :id="GetNumPage == GetCurrectPage(GetNumPage,index,maxPage) ? 'current' : null">{{ GetCurrectPage(GetNumPage,index,maxPage) }}</button>
      <button v-if="GetNumPage > 3 && GetNumPage < maxPage-2" @click="NextPage(maxPage)">...{{ maxPage }}</button>
    </div>
  </div>
</template>

<script>
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
      const res = parseInt(this.Page == null ? 1 : this.Page);
      return res;
    }
  },
  methods: {
    NextPage(_page) {
      this.$emit('click', _page);
      if(String(this.Page) == String(_page)) return;
      this.$router.push(this.url+_page);
    },
    GetCurrectPage(_num1, _num2, _stop) {
	    _num1 = _num1 > _stop ? _stop : _num1;
      if (_num1 + 1 == _stop) _num1 -= 1;
      else if (_num1 >= _stop) _num1 -= 2;
      const res = _num1 >= 4 ? _num1 + _num2 - 1 - 2 : _num2;
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
  padding-top: 50px;
  margin-top: 40px;
}

.PageNavigator button {
  background-color: white;
  color: #333;
  font-size: 18px;
  border: 1px solid #cfcfcf;
  float: left;
  width: 60px;
  height: 45px;
}

.PageNavigator button:first-child {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.PageNavigator button:last-child {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

#current {
  /* font-weight: 700; */
  color: #fff;
  background-color: #0073a2;
  border: 1px solid #0073a2;
}

.PageNavigator button:hover {
  background-color: #2ea1cd;
  color: #fff;
  border: 1px solid #0073a2;
}
</style>
