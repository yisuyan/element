import ElBj from './src/bj';

/* istanbul ignore next */
ElBj.install = function(Vue) {
  Vue.component(ElBj.name, ElBj);
};

export default ElBj;
