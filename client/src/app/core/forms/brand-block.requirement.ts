const titleRequirements = {
  required: true,
  minlength: 3,
  maxlength: 80
}

const descriptionRequirements = {
  maxlength: 100
}

const youtubeUrlRequirements = {
  invalidSocialLink: true,
  maxlength: 255
}

export const blockRequirements = {
  url: {
    requirements: {
    },
    validationMsg: {
      required: "Destination URL is required",
      validUrl: "Look like this is not a valid link ☝"
    }
  },
  title: {
    requirements: {
      ...titleRequirements
    },
    validationMsg: {
      required: "Title is required",
      minlength: `Title must be at least ${titleRequirements.minlength} characters`,
      maxlength: `Title must be at most ${titleRequirements.maxlength} characters`
    }
  },
  description: {
    requirements: {
      ...descriptionRequirements
    },
    validationMsg: {
      maxlength: `Description must be at most ${descriptionRequirements.maxlength} characters`
    }
  },
  youtubeUrl: {
    requirements: {
      ...youtubeUrlRequirements
    },
    validationMsg: {
      invalidYoutubeEmbedLink: "Invalid Youtube embed url",
      maxlength: `Youtube URL must be at most ${youtubeUrlRequirements.maxlength} characters`
    }
  }
}
