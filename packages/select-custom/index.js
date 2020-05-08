import ElSelectCustom from './src/select-custom';

/* istanbul ignore next */
ElSelectCustom.install = function(Vue) {
  Vue.component(ElSelectCustom.name, ElSelectCustom);
};

export default ElSelectCustom;
