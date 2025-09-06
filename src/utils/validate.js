const validate = (email, password) => {
    const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)

    if (!isEmailValid) return "Please enter your email"
    if (!isPasswordValid) return "Please enter your Password"

    return null
}

export default validate