<template>
  <div>
    <div :class="'toggle btn btn-' + (IsVmodelChecked ? 'primary' : 'success off')">
      <div class="toggle-group">
        <label for="checked" class="btn btn-primary toggle-on">{{ first_text }}</label>
        <label for="checked" class="btn btn-success toggle-off">{{ last_text }}</label>
        <span class="toggle-handle btn btn-light"></span>
      </div>
      <input id="checked" v-model="IsVmodelChecked" type="checkbox" @change="IsChanged" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checked: false,
    first_text: "",
    last_text: ""
  },
  data() {
    return {
      IsVmodelChecked: false,
    };
  },
  computed: {

  },
  methods: {
    IsChanged() {
      this.$emit('IsChanged', this.IsVmodelChecked);
    }
  },
  created() {
    this.IsVmodelChecked = this.checked;
  }
};
</script>

<style scoped>
.toggle.off .toggle-group {
  left: -100%;
}

.toggle input[type="checkbox"],
input[type="radio"] {
  box-sizing: border-box;
  padding: 0;
}

.toggle {
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 40px;
}

.toggle input[type="checkbox"] {
  display: none;
}

.toggle-group {
  position: absolute;
  width: 200%;
  top: 0;
  bottom: 0;
  left: 0;
  transition: left 0.35s;
  -webkit-transition: left 0.35s;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.toggle-on {
  position: absolute;
  top: -2px;
  bottom: 0;
  left: 0;
  right: 50%;
  margin: 0;
  border: 0;
  border-radius: 0;
}

.toggle-on.btn {
  padding-right: 1.5rem;
}

.toggle-off.btn {
  padding-left: 1.5rem;
}

.toggle-group label,
.toggle-group span {
  cursor: pointer;
}

.toggle-off {
  position: absolute;
  top: -2px;
  bottom: 0;
  left: 50%;
  right: 0;
  margin: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.toggle-handle {
  position: relative;
  margin: 0 auto;
  padding-top: 0px;
  padding-bottom: 0px;
  height: 100%;
  width: 0px;
  border-width: 0 1px;
  background-color: #fff;
}
</style>
