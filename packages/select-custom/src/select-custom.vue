<template>
    <el-select v-model="currentValue" :size="size" :clearable="clearable" :filterable="filterable" :disabled="disabled"
               :multiple="multiple" :placeholder="placeholder" :filter-method="pinyinMatch">
        <el-option v-for="item in options" :label="item.label" :value="isCode?item.value:item.label"></el-option>
    </el-select>
</template>

<script>
    import emitter from 'element-ui/src/mixins/emitter';
    import ElSelect from 'element-ui/packages/select';
    import ElOption from 'element-ui/packages/option';
    import axios from 'axios';
    import PinyinMatch from 'pinyin-match';
    export default {
      name: 'ElSelectCustom',
      componentName: 'ElSelectCustom',
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
        url: {
          required: true
        },
        isCode: {
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
          copyOptions: [],
          currentValue: ''
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
              this.copyOptions = this.options;
            }
          );
        },
        pinyinMatch(val) {
          var result = [];
          if (val) {
            this.copyOptions.forEach(i => {
              var m = PinyinMatch.match(i.label, val);
              if (m) {
                result.push(i);
              }
            });
            this.options = result;
          } else {
            this.options = this.copyOptions;
          }
        }
      },
      mounted() {
        if (this.multiple && this.value.length > 0) {
          this.currentValue = this.value.split(this.separator);
        } else if (this.multiple && this.value.length === 0) {
          this.currentValue = [];
        } else {
          this.currentValue = this.value;
        }
        this.loadData();
      }
    };
</script>