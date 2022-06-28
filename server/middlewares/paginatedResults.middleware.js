/* eslint-disable radix */
const sendError = require('../utils/sendError');

exports.paginatedResults = (model) => async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await model.countDocuments().exec())) {
    results.next = true;
  } else {
    results.next = false;
  }

  if (startIndex > 0) {
    results.previous = true;
  } else {
    results.previous = false;
  }
  try {
    results.videos = await model
      .find()
      .limit(limit)
      .skip(startIndex)
      .populate('user', 'firstName lastName email avatar')
      .populate('labels', 'name slug')
      .exec();
    res.paginatedResults = results;
    next();
  } catch (err) {
    sendError(err, res);
  }
};
