const reviewModel = require("../models/reviewModel")

const reviewController = {}


reviewController.createReview = async (req, res, next) => {
  if (res.locals.loggedin) {
    try {
      const accountData = res.locals.accountData;
      const { review_text, inv_id } = req.body
      await reviewModel.createReview({ review_text, inv_id, account_id: accountData.account_id })
    } catch (error) {
      console.error(error)
    }
  }

  return res.redirect(req.headers.referer)
}


reviewController.updateReview = async (req, res, next) => {
  if (res.locals.loggedin) {
    try {
      const accountData = res.locals.accountData;
      const { id } = req.params
      const { review_text } = req.body
      const review = await reviewModel.getReviewById(id)
      if (review && review.account_id === accountData.account_id) {
        await reviewModel.updateReview(id, review_text)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return res.redirect(req.headers.referer)
}

reviewController.deleteReview = async (req, res, next) => {
  if (res.locals.loggedin) {
    try {
      const accountData = res.locals.accountData;
      const { id } = req.params
      const review = await reviewModel.getReviewById(id)
      if (review && review.account_id === accountData.account_id) {
        await reviewModel.deleteReview(id)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return res.redirect(req.headers.referer)
}

module.exports = reviewController
