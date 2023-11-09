import is from '@sindresorhus/is';

function emptyObejctCheck(req, res, next) {
  if (is.emptyObject(req.body)) {
    res.status(400).json({
      result: 'Content-Type',
      reason: 'headers의 Content-Type을 application/json으로 설정해주세요',
    });
    return;
  }
  next();
}

export { emptyObejctCheck };