const usernameRequirements = {
  required: true,
  minLength: 5,
  maxLength: 255
}

const passwordRequirements = {
  required: true,
  minLength: 5,
  maxLength: 255
}

export const loginRequirements = {
  username: {
    requirements: {
      ...usernameRequirements
    },
    validationMsg: {
      required: "Username is required",
      minLength: `Username must be at least ${usernameRequirements.minLength} characters`,
      maxLength: `Username must be at most ${usernameRequirements.maxLength} characters`
    }
  },
  password: {
    requirements: {
      ...passwordRequirements
    },
    validationMsg: {
      required: "Password is required",
      minLength: `Password must be at least ${passwordRequirements.minLength} characters`,
      maxLength: `Password must be at most ${passwordRequirements.maxLength} characters`
    }
  }
}
