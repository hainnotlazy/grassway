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

const fullnameRequirements = {
  required: true,
  minlength: 3,
  maxlength: 255
}

const bioRequirements = {
  maxlength: 255
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

export const profileRequirements = {
  fullname: {
    requirements: {
      ...fullnameRequirements
    },
    validationMsg: {
      required: "Fullname is required",
      minlength: `Fullname must be at least ${fullnameRequirements.minlength} characters`,
      maxlength: `Fullname must be at most ${fullnameRequirements.maxlength} characters`
    }
  },
  bio: {
    requirements: {
      ...bioRequirements
    },
    validationMsg: {
      maxlength: `Bio must be at most ${bioRequirements.maxlength} characters`
    }
  }
}

export const changePasswordRequirements = {
  password: {
    requirements: {
      ...passwordRequirements
    },
    validationMsg: {
      required: "Password is required",
      minlength: `Password is invalid`,
      maxlength: `Password is invalid`
    }
  },
  newPassword: {
    requirements: {
      ...passwordRequirements
    },
    validationMsg: {
      required: "New password is required",
      minlength: `New password is invalid`,
      maxlength: `New password is invalid`
    }
  },
  passwordConfirmation: {
    requirements: {
      ...confirmPasswordRequirements
    },
    validationMsg: {
      required: "Please confirm your password"
    }
  }
}

export const forgetPasswordRequirements = {
  email: {
    requirements: {
      ...emailRequirements
    },
    validationMsg: {
      required: "Email is required",
      email: "Email is invalid",
    }
  },
  code: {
    requirements: {
      required: true,
      minlength: 6,
      maxlength: 6
    },
    validationMsg: {
      required: "Code is required",
      minlength: `Code is invalid`,
      maxlength: `Code is invalid`
    }
  },
  newPassword: {
    requirements: {
      ...passwordRequirements
    },
    validationMsg: {
      required: "New password is required",
      minlength: `New password is invalid`,
      maxlength: `New password is invalid`
    }
  },
  passwordConfirmation: {
    requirements: {
      ...confirmPasswordRequirements
    },
    validationMsg: {
      required: "Please confirm your password"
    }
  }
}
