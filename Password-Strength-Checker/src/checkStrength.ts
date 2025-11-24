export default function checkPasswordStrength(password: string){
    password = password.trim()
    let score = 0
    let strength = ""
    let issues = []
    
    let len = password.length;
    
    let hasUpperRegex = /[A-Z]/
    let hasLowerRegex = /[a-z]/
    let hasNumberRegex = /\d/
    let hasSpecialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    
    if(len >= 8){
        score++
    }else issues.push("Password must be at least 8 characters long.")
    if(hasUpperRegex.test(password)){
        score++
    }else issues.push("missing uppercase letter")
    if(hasLowerRegex.test(password)){
        score++
    }else issues.push("missing lowercase letter")
    if(hasNumberRegex.test(password)){
        score++
    }else issues.push("missing number")
    if(hasSpecialRegex.test(password)){
        score++
    }else issues.push("missing special character")
    
    if(score <= 2) strength = "weak"
    else if(score > 2 && score <= 4) strength = "medium"
    else strength = "strong"
    
    return{
        score,
        strength,
        issues
    }
}
