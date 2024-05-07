const usernameRequirements = {
  required: true,
  minlength: 5,
  maxlength: 255
}

const emailRequirements = {
  email: true
}

const passwordRequirements = {
  required: true,
  minlength: 5,
  maxlength: 255
}

const confirmPasswordRequirements = {
  require: true
}

export const loginRequirements = {
  username: {
    requirements: {
      ...usernameRequirements
    },
    validationMsg: {
      required: "Username is required",
      minlength: `Username is invalid`,
      maxlength: `Username is invalid`
    }
  },
  password: {
    requirements: {
      ...passwordRequirements
    },
    validationMsg: {
      required: "Password is required",
      minlength: `Password is invalid`,
      maxlength: `Password is invalid`
    }
  }
}

export const registerRequirements = {
  username: {
    requirements: {
      ...usernameRequirements
    },
    validationMsg: {
      required: "Username is required",
      minlength: `Username must be at least ${usernameRequirements.minlength} characters`,
      maxlength: `Username must be at most ${usernameRequirements.maxlength} characters`
    }
  },
  email: {
    requirements: {
      ...emailRequirements
    },
    validationMsg: {
      email: "Email is invalid",
    }
  },
  password: {
    requirements: {
      ...passwordRequirements
    },
    validationMsg: {
      required: "Password is required",
      minlength: `Password must be at least ${passwordRequirements.minlength} characters`,
      maxlength: `Password must be at most ${passwordRequirements.maxlength} characters`
    }
  },
  confirmPassword: {
    requirements: {
      ...confirmPasswordRequirements
    },
    validationMsg: {
      required: "Please confirm your password"
    }
  }
}
