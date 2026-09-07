const pickFields = (source, allowedFields) => {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }

    return result;
  }, {});
};

export default pickFields;