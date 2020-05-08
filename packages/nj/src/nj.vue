<template>
    <el-select v-model="currentValue" :size="size" :clearable="clearable" :filterable="filterable" :disabled="disabled"
               :multiple="multiple" :placeholder="placeholder" @change="changeHandle">
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
    </el-select>
</template>

<script>
    import emitter from 'element-ui/src/mixins/emitter';
    import ElSelect from 'element-ui/packages/select';
    import ElOption from 'element-ui/packages/option';
    import axios from 'axios';
    import eventBus from 'element-ui/src/eventBus.js';
    export default {
      name: 'ElNj',
      componentName: 'ElNj',
      mixins: [emitter],
      components: {ElSelect, ElOption
      },
      props: {
        value: {
          required: true
        },
        size: String,
        disabled: Boolean,
        clearable: Boolean,
        multiple: Boolean,
        filterable: Boolean,
        placeholder: String,
        multipleLimit: {
          type: Number,
          default: 0
        },
        contextPath: {
          required: true
        },
        bj: {
          type: Boolean,
          default: false
        },
        separator: {
          type: String,
          default: ','
        }
      },
      watch: {
        currentValue(val, oldVal) {
          if (this.multiple && this.currentValue.length > 0) {
            this.$emit('input', this.currentValue.join(this.separator));
          } else if (this.multiple && this.currentValue.length === 0) {
            this.$emit('input', '');
          } else {
            this.$emit('input', this.currentValue);
          }
        },
        value(val) {
          if (this.multiple && this.value.length > 0) {
            this.currentValue = this.value.split(this.separator);
          } else if (this.multiple && this.value.length === 0) {
            this.currentValue = [];
          } else {
            this.currentValue = this.value;
          }
        }
      },
      data() {
        return {
          options: [],
          currentValue: '',
          njs: this.value
        };
      },
      methods: {
        loadData() {
          axios({
            url: this.contextPath + '/select/nj',
            method: 'post',
            data: '',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(
            res => {
              this.options = res.data.data;
            }
          );
        },
        changeHandle() {
          if (this.multiple) {
            this.njs = this.currentValue.join(',');
          } else {
            this.njs = this.currentValue;
          }
          if (this.bj) {
            eventBus.$emit('eventFromNjtoBj', this.njs);
          }
        }
      },
      mounted() {
        this.loadData();
        if (this.multiple && this.value.length > 0) {
          this.currentValue = this.value.split(this.separator);
        } else if (this.multiple && this.value.length === 0) {
          this.currentValue = [];
        } else {
          this.currentValue = this.value;
        }
      }
    };
</script>