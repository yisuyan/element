<template>
    <el-checkbox-group v-model="currentValue">
        <el-checkbox v-for="item in items" :label="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>
</template>

<script>
    import emitter from 'element-ui/src/mixins/emitter';
    import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
    import ElCheckbox from 'element-ui/packages/checkbox';
    import axios from 'axios';
    export default {
      name: 'ElCheckboxCustom',
      componentName: 'ElCheckboxCustom',
      mixins: [emitter],
      components: {ElCheckboxGroup, ElCheckbox
      },
      props: {
        value: {
          type: String,
          required: true
        },
        options: String,
        url: String,
        separator: {
          type: String,
          default: ','
        }
      },
      watch: {
        currentValue(val, oldVal) {
          if (this.currentValue.length > 0) {
            this.$emit('input', this.currentValue.join(this.separator));
          } else {
            this.$emit('input', '');
          }
        },
        value(val) {
          if (this.value.length > 0) {
            this.currentValue = this.value.split(this.separator);
          } else {
            this.currentValue = [];
          }
        }
      },
      data() {
        return {
          items: [],
          currentValue: []
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
        if (this.value.length > 0) {
          this.currentValue = this.value.split(this.separator);
        } else {
          this.currentValue = [];
        }
      }
    };
</script>