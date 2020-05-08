import ElCode from './src/code';

/* istanbul ignore next */
ElCode.install = function(Vue) {
  Vue.component(ElCode.name, ElCode);
};

export default ElCode;
