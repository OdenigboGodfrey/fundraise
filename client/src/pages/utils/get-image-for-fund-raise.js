/**
 * @description Helper function to get the image for a post
 * @param {Number} postIndex
 * @returns {String}
 */
export default function getImageForFundRaise(postIndex) {
  const fundRaiseImages = [
    "https://decentralized-mvp.s3.amazonaws.com/fundraiser/funndraise-1-min.jpg",
    "https://decentralized-mvp.s3.amazonaws.com/fundraiser/fundraise-2-min.jpg",
    "https://decentralized-mvp.s3.amazonaws.com/fundraiser/fundraise-3-min.jpg"
  ];
  const normalizedFundRaiseImages = postIndex + 1;

  if (normalizedFundRaiseImages % 3 === 0) {
    return fundRaiseImages[2];
  } else if (normalizedFundRaiseImages % 2 === 0) {
    return fundRaiseImages[1];
  } else {
    return fundRaiseImages[0];
  }
}