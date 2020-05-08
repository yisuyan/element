<!--
    /**
     * 下拉选择树形组件，下拉框展示树形结构，提供选择某节点功能，方便其他模块调用
     * 调用示例：
     * <el-tree-select :height="400" // 下拉框中树形高度
     *              :width="200" // 下拉框中树形宽度
     *              :data="data" // 树结构的数据
     *              :defaultProps="defaultProps" // 树结构的props
     *              multiple   // 多选
     *              checkStrictly // 多选时，严格遵循父子不互相关联
     *              :nodeKey="nodeKey"   // 绑定nodeKey，默认绑定'id'
     *              :checkedKeys="defaultCheckedKeys"  // 传递默认选中的节点key组成的数组
     *              @popoverHide="popoverHide"> // 事件有两个参数：第一个是所有选中的节点ID，第二个是所有选中的节点数据
     *              </el-tree-select>
     */
-->
<template>
    <div>
        <div class="tree-select-mask" v-show="isShowSelect" @click="isShowSelect = !isShowSelect"></div>
        <el-popover placement="bottom-start" :width="width" trigger="click"
                    v-model="isShowSelect" @hide="popoverHide">
            <el-tree class="common-tree" :style="style" ref="tree" :data="data" :props="defaultProps"
                     :show-checkbox="multiple"
                     :node-key="nodeKey"
                     :check-strictly="checkStrictly"
                     :expand-on-click-node="false"
                     :check-on-click-node="true"
                     :default-checked-keys="defaultCheckedKeys"
                     :highlight-current="true"
                     @node-click="handleNodeClick"
                     @check-change="handleCheckChange"></el-tree>
            <el-select :style="selectStyle" slot="reference" ref="select"
                       v-model="selectedData"
                       :multiple="multiple"
                       @click.native="isShowSelect = !isShowSelect"
                       class="tree-select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-popover>
    </div>
</template>

<script>
    import ElPopover from 'element-ui/packages/popover';
    import ElTree from 'element-ui/packages/tree';
    import ElSelect from 'element-ui/packages/select';
    import ElOption from 'element-ui/packages/option';
    export default {
      name: 'ElTreeSelect',
      componentName: 'ElTreeSelect',
      components: {ElPopover, ElTree, ElSelect, ElOption
      },
      props: {
        // 树结构数据
        data: {
          type: Array,
          default() {
            return [];
          }
        },
        defaultProps: {
          type: Object,
          default() {
            return {};
          }
        },
        // 配置是否可多选
        multiple: {
          type: Boolean,
          default() {
            return false;
          }
        },
        nodeKey: {
          type: String,
          default() {
            return 'id';
          }
        },
        // 显示复选框情况下，是否严格遵循父子不互相关联
        checkStrictly: {
          type: Boolean,
          default() {
            return false;
          }
        },
        // 默认选中的节点key数组
        // checkedKeys: {
        //   type: Array,
        //   default() {
        //     return [];
        //   }
        // },
        value: {
          type: String,
          required: true
        },
        width: {
          type: Number,
          default() {
            return 250;
          }
        },
        height: {
          type: Number,
          default() {
            return 300;
          }
        }
      },
      data() {
        return {
          defaultCheckedKeys: [],
          isShowSelect: false, // 是否显示树状选择器
          options: [],
          selectedData: [], // 选中的节点
          style: 'width:' + this.width + 'px;' + 'height:' + this.height + 'px;',
          selectStyle: 'width:' + (this.width + 24) + 'px;',
          checkedIds: [],
          checkedData: []
        };
      },
      mounted() {
        if (this.multiple && this.value.length > 0) {
          this.defaultCheckedKeys = this.value.split(',');
          this.selectedData = this.defaultCheckedKeys.map((item) => {
            var node = this.$refs.tree.getNode(item);
            return node.label;
          });
        } else if (this.multiple && this.value.length === 0) {
          this.selectedData = [];
          this.defaultCheckedKeys = [];
        } else {
          var item = this.value;
          this.$refs.tree.setCurrentKey(item);
          var node = this.$refs.tree.getNode(item);
          this.selectedData = node.label;
        }
      },
      methods: {
        popoverHide(row) {
          this.$emit('tree-select-hide', row);
        },
        // 节点被点击时的回调,返回被点击的节点数据
        handleNodeClick(data, node) {
          if (!this.multiple) {
            let tmpMap = {};
            tmpMap.value = node.key;
            tmpMap.label = node.label;
            this.options = [];
            this.options.push(tmpMap);
            this.selectedData = node.label;
            this.checkedIds = node.id;
            this.isShowSelect = !this.isShowSelect;
          }
        },
        // 节点选中状态发生变化时的回调
        handleCheckChange() {
          var checkedKeys = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
          this.options = checkedKeys.map((item) => {
            var node = this.$refs.tree.getNode(item); // 所有被选中的节点对应的node
            let tmpMap = {};
            tmpMap.value = node.key;
            tmpMap.label = node.label;
            return tmpMap;
          });
          this.selectedData = this.options.map((item) => {
            return item.label;
          });
          this.checkedIds = this.options.map((item) => {
            return item.value;
          });
          this.$emit('input', this.checkedIds.join(','));
        }
      },
      watch: {
        isShowSelect(val) {
          // 隐藏select自带的下拉框
          this.$refs.select.blur();
        },
        // selectedData(val) {
        //   if (this.checkedIds.length > 0) {
        //     if (this.multiple) {
        //       this.$emit('input', this.checkedIds.join(','));
        //     } else {
        //       this.$emit('input', this.checkedIds);
        //     }
        //   }
        // },
        value(val) {
          // console.log('update tree select:' + val);
          if (this.multiple && val.length > 0) {
            this.defaultCheckedKeys = val.split(',');
            this.selectedData = this.defaultCheckedKeys.map((item) => {
              var node = this.$refs.tree.getNode(item);
              return node.label;
            });
            this.$refs.tree.setCheckedNodes(this.defaultCheckedKeys);
          } else if (this.multiple && val.length === 0) {
            this.selectedData = [];
            this.defaultCheckedKeys = [];
            this.$refs.tree.setCheckedNodes(this.defaultCheckedKeys);
          } else {
            var item = this.val;
            this.$refs.tree.setCurrentKey(item);
            var node = this.$refs.tree.getNode(item);
            this.selectedData = node.label;
          }
        }
      }
    };
</script>
