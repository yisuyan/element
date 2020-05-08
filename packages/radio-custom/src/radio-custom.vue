<template>
    <el-radio-group v-model="currentValue">
        <el-radio v-for="item in items" :label="item.value">{{item.label}}</el-radio>
    </el-radio-group>
</template>

<script>
    import emitter from 'element-ui/src/mixins/emitter';
    import ElRadioGroup from 'element-ui/packages/radio-group';
    import ElRadio from 'element-ui/packages/radio';
    import axios from 'axios';
    export default {
      name: 'ElRadioCustom',
      componentName: 'ElRadioCustom',
      mixins: [emitter],
      components: {ElRadioGroup, ElRadio
      },
      props: {
        value: {
          required: true
        },
        options: String,
        url: String
      },
      watch: {
        currentValue(val, oldVal) {
          this.$emit('input', this.currentValue);
        },
        value(val) {
          this.currentValue = this.value;
        }
      },
      data() {
        return {
          items: [],
          currentValue: this.value
        };
      },
      methods: {
        loadData() {
          axios({
            url: this.url,
            method: 'post',
            data: '',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(
            res => {
              this.options = res.data.data;
              this.initOptions();
            }
          );
        },
        initOptions() {
          let optionArr = this.options.split('|');
          optionArr.forEach(v => {
            let arr = v.split('#');
            if (arr.length > 1) {
              this.items.push({value: arr[0], label: arr[1]});
            } else {
              this.items.push({value: arr[0], label: arr[0]});
            }
          });
        }
      },
      mounted() {
        if (this.options.length <= 0) {
          this.loadData();
        } else {
          this.initOptions();
        }

      }
    };
</script>