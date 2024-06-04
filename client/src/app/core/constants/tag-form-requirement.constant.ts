const nameRequirements = {
  required: true,
  minlength: 3,
  maxlength: 255
}

const descriptionRequirements = {
  maxlength: 255
}

export const tagFormRequirements = {
  name: {
    requirements: {
      ...nameRequirements
    },
    validationMsg: {
      required: "Name is required",
      minlength: `Name must be at least ${nameRequirements.minlength} characters`,
      maxlength: `Name must be at most ${nameRequirements.maxlength} characters`
    }
  },
  description: {
    requirements: {
      ...descriptionRequirements
    },
    validationMsg: {
      maxlength: `Description must be at most ${descriptionRequirements.maxlength} characters`
    }
  }
};
