<template>
    <el-select v-model="currentValue" :size="size" :clearable="clearable" :filterable="filterable" :disabled="disabled"
               :multiple="multiple" :placeholder="placeholder" :filter-method="pinyinMatch" @change="changeHandle">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</template>

<script>
    import emitter from 'element-ui/src/mixins/emitter';
    import ElSelect from 'element-ui/packages/select';
    import ElOption from 'element-ui/packages/option';
    import axios from 'axios';
    import PinyinMatch from 'pinyin-match';
    import eventBus from 'element-ui/src/eventBus.js';
    export default {
      name: 'ElXy',
      componentName: 'ElXy',
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
        zy: {
          type: Boolean,
          default: false
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
          copyOptions: [],
          currentValue: '',
          xyId: this.value
        };
      },
      methods: {
        loadData() {
          axios({
            url: this.contextPath + '/select/xy',
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
        },
        changeHandle() {
          if (this.multiple) {
            this.xyId = this.currentValue.join(',');
          } else {
            this.xyId = this.currentValue;
          }
          if (this.zy) {
            eventBus.$emit('eventFromXytoZy', this.xyId);
          }
          if (this.bj) {
            eventBus.$emit('eventFromXytoBj', this.xyId);
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