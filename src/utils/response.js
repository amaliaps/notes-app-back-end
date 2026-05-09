// utility untuk menyeragamkan format response API. Ia menerima parameter res, statusCode, message, dan data.

const response = (res, statusCode, message, data) => {
  return res
    .status(statusCode)
    .json({
      code: statusCode,
      status: statusCode < 400 ? 'success' : 'fail',
      message,
      data,
    })
    .end();
};

export default response;