import ElZy from './src/zy';

/* istanbul ignore next */
ElZy.install = function(Vue) {
  Vue.component(ElZy.name, ElZy);
};

export default ElZy;
