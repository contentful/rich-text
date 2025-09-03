const t = ({ _id, message }) => message;

const plural = (count, options) => {
  let message = options.other;
  if (count === 0) {
    message = options.zero || options[0] || options.other;
  }
  if (count === 1) {
    message = options.one || options.other;
  }
  return message.replace('#', count);
};

module.exports = { t, plural };
