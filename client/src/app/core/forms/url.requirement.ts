const originUrlRequirements = {
  required: true,
}

const titleRequirements = {
  required: true
}

const customBackHalfRequirement = {
  existed: true
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
  title: {
    requirements: {
      ...titleRequirements
    },
    validationMsg: {
      required: "Give me a title"
    }
  },
  customBackHalf: {
    requirements: {
      ...customBackHalfRequirement
    },
    validationMsg: {
      existed: "This back half is existed"
    }
  }
}
