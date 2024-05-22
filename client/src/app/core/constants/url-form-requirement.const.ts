const originUrlRequirements = {
  required: true,
}

export const shortenUrlRequirements = {
  originUrl: {
    requirements: {
      ...originUrlRequirements
    },
    validationMsg: {
      required: "Give me a link to shorten 🍑",
      validUrl: "Look like this is not a valid link ☝"
    }
  },
  customBackHalf: {
    requirements: {},
    validationMsg: {
      existed: "This back half is existed"
    }
  }
}
