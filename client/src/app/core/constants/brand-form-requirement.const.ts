const titleRequirements = {
  required: true,
  minlength: 3,
  maxlength: 255
}

const descriptionRequirements = {
  maxlength: 255
}

const facebookRequirements = {
  maxlength: 255
}

const instagramRequirements = {
  maxlength: 255
}

const twitterRequirements = {
  maxlength: 255
}

const linkedinRequirements = {
  maxlength: 255
}

const githubRequirements = {
  maxlength: 255
}

const tiktokRequirements = {
  maxlength: 255
}

const youtubeRequirements = {
  maxlength: 255
}

const discordRequirements = {
  maxlength: 255
}

export const createBrandRequirements = {
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
  facebook: {
    requirements: {
      ...facebookRequirements
    },
    validationMsg: {
      invalidSocialLink: "Facebook URL is invalid",
      maxlength: `Facebook URL must be at most ${facebookRequirements.maxlength} characters`
    }
  },
  instagram: {
    requirements: {
      ...instagramRequirements
    },
    validationMsg: {
      invalidSocialLink: "Instagram URL is invalid",
      maxlength: `Instagram URL must be at most ${instagramRequirements.maxlength} characters`
    }
  },
  twitter: {
    requirements: {
      ...twitterRequirements
    },
    validationMsg: {
      invalidSocialLink: "X (Formerly Twitter) URL is invalid",
      maxlength: `X (Formerly Twitter) URL must be at most ${twitterRequirements.maxlength} characters`
    }
  },
  linkedin: {
    requirements: {
      ...linkedinRequirements
    },
    validationMsg: {
      invalidSocialLink: "Linkedin URL is invalid",
      maxlength: `Linkedin URL must be at most ${linkedinRequirements.maxlength} characters`
    }
  },
  github: {
    requirements: {
      ...githubRequirements
    },
    validationMsg: {
      invalidSocialLink: "Github URL is invalid",
      maxlength: `Github URL must be at most ${githubRequirements.maxlength} characters`
    }
  },
  tiktok: {
    requirements: {
      ...tiktokRequirements
    },
    validationMsg: {
      invalidSocialLink: "Tiktok URL is invalid",
      maxlength: `Tiktok URL must be at most ${tiktokRequirements.maxlength} characters`
    }
  },
  youtube: {
    requirements: {
      ...youtubeRequirements
    },
    validationMsg: {
      invalidSocialLink: "Youtube URL is invalid",
      maxlength: `Youtube URL must be at most ${youtubeRequirements.maxlength} characters`
    }
  },
  discord: {
    requirements: {
      ...discordRequirements
    },
    validationMsg: {
      invalidSocialLink: "Discord URL is invalid",
      maxlength: `Discord URL must be at most ${discordRequirements.maxlength} characters`
    }
  },
  website: {
    requirements: {
      ...descriptionRequirements
    },
    validationMsg: {
      validUrl: "Website URL is invalid",
      maxlength: `Website URL must be at most ${descriptionRequirements.maxlength} characters`
    }
  }
}
