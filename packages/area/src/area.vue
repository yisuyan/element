<template>
    <el-cascader
            :props="{ expandTrigger: 'hover' }" :size="size" :clearable="clearable" :filterable="filterable" :disabled="disabled"
            :options="options" :placeholder="placeholder" :filter-method="pinyinMatch"
            :separator="separator" @change="handleChange"
            v-model="currentValue">
    </el-cascader>
</template>

<script>
    import emitter from 'element-ui/src/mixins/emitter';
    import ElCascader from 'element-ui/packages/cascader';
    import PinyinMatch from 'pinyin-match';
    import axios from 'axios';
    export default {
      name: 'ElArea',
      componentName: 'ElArea',
      mixins: [emitter],
      components: {ElCascader
      },
      props: {
        value: {
          type: String,
          required: true
        },
        size: String,
        disabled: Boolean,
        clearable: Boolean,
        separator: {
          type: String,
          default: '/'
        },
        placeholder: String,
        contextPath: {
          required: true
        },
        filterable: Boolean,
        showAllLevels: {
          type: Boolean,
          default: true
        },
        level: {
          type: Number,
          default: 3
        },
        isCode: {
          type: Boolean,
          default: false
        }
      },
      watch: {

        value(val) {
          if (this.isCode) {
            if (this.value.length > 0) {
              this.currentValue = this.value;
            } else {
              this.currentValue = '';
            }
          } else {
            if (this.value != null && this.value !== '') {
              this.currentValue = this.value.split(this.separator);
            } else {
              this.currentValue = '';
            }
          }
        }
      },
      data() {
        return {
          options: [],
          copyOptions: [],
          currentValue: []
        };
      },
      methods: {
        handleChange(val) {
          if (this.isCode) {
            // this.$emit('input', this.currentValue);
            if (this.currentValue.length > 0) {
              this.$emit('input', this.currentValue);
            } else {
              this.$emit('input', '');
            }
          } else {
            if (this.currentValue.length > 0) {
              this.$emit('input', this.currentValue.join(this.separator));
            } else {
              this.$emit('input', '');
            }
          }
        },
        loadData() {
          axios({
            url: this.contextPath + '/select/area',
            method: 'post',
            data: 'level=' + this.level + '&isCode=' + this.isCode,
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
        pinyinMatch(node, keyword) {
          return PinyinMatch.match(node.text, keyword);
        }
      },
      mounted() {
        if (this.isCode) {
          this.currentValue = this.value;
        } else {
          if (this.value != null && this.value !== '') {
            this.currentValue = this.value.split(this.separator);
          }
        }
        this.loadData();
      }
    };
</script>