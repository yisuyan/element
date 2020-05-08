import ElNj from './src/nj';

/* istanbul ignore next */
ElNj.install = function(Vue) {
  Vue.component(ElNj.name, ElNj);
};

export default ElNj;
