import ElXy from './src/xy';

/* istanbul ignore next */
ElXy.install = function(Vue) {
  Vue.component(ElXy.name, ElXy);
};

export default ElXy;
