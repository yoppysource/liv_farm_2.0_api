class AppError extends Error {
  constructor(message, statusCode) {
    //메세지 프로퍼티 error에 들어있는걸로 세팅
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    //only operational error만 클라이언트 한테 던져준다.
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
