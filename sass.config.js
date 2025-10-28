export default {
  style: 'compressed',
  sourceMap: true,
  logger: {
    warn: function(message) {
      console.warn(message);
    },
    debug: function(message) {
      console.log(message);
    }
  }
}