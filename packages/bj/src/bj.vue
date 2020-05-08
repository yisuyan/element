<template>
    <el-select v-model="currentValue" :size="size" :clearable="clearable" :filterable="filterable" :disabled="disabled"
               :multiple="multiple" :placeholder="placeholder" :filter-method="pinyinMatch">
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
      name: 'ElBj',
      componentName: 'ElBj',
      mixins: [emitter],
      components: {ElSelect, ElOption
      },
      props: {
        value: {
          required: true
        },
        size: String,
        // disabled: {
        //   type: Boolean,
        //   default: true
        // },
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
        xy: {
          type: String,
          default: ''
        },
        nj: {
          type: String,
          default: ''
        },
        zy: {
          type: String,
          default: ''
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
          xyId: '',
          njs: '',
          zyId: '',
          disabled: false
        };
      },
      methods: {
        loadData() {
          this.disabled = true;
          axios({
            url: this.contextPath + '/select/bj',
            method: 'post',
            data: 'xyId=' + this.xyId + '&nj=' + this.njs + '&zyId=' + this.zyId,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(
            res => {
              this.options = res.data.data;
              this.copyOptions = this.options;
              this.disabled = false;
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
        changeFromXy() {
          const that = this;
          eventBus.$on('eventFromXytoBj', function(val) {
            that.xyId = val;
            if (that.multiple) {
              that.currentValue.splice(0, that.currentValue.length);
            } else {
              that.currentValue = '';
            }
            that.loadData();
          });
        },
        changeFromNj() {
          const that = this;
          eventBus.$on('eventFromNjtoBj', function(val) {
            that.njs = val;
            if (that.multiple) {
              that.currentValue.splice(0, that.currentValue.length);
            } else {
              that.currentValue = '';
            }
            that.loadData();
          });
        },
        changeFromZy() {
          const that = this;
          eventBus.$on('eventFromZytoBj', function(val) {
            that.zyId = val;
            if (that.multiple) {
              that.currentValue.splice(0, that.currentValue.length);
            } else {
              that.currentValue = '';
            }
            that.loadData();
          });
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
        this.xyId = this.xy;
        this.njs = this.nj;
        this.zyId = this.zy;
        this.loadData();
        this.changeFromXy();
        this.changeFromZy();
        this.changeFromNj();

      }
    };
</script>