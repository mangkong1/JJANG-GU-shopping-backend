import * as Joi from "joi";

function emptyObejctCheck(req, res, next) {
  // 유효성 검사 스키마 정의
  const schema = Joi.object().keys({});

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({
      result: 'Content-Type',
      reason: 'headers의 Content-Type을 application/json으로 설정해주세요',
    });
    return;
  }
  next();
}

export { emptyObejctCheck };