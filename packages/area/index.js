import ElArea from './src/area';

/* istanbul ignore next */
ElArea.install = function(Vue) {
  Vue.component(ElArea.name, ElArea);
};

export default ElArea;
