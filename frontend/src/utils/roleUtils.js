export const getUserRoleFromEmail = (email) => {
    const domain = email.split("@")[1]?.toLowerCase()
    if (!domain) return "EPP"
    if (domain.includes("gitam")) return "SPP"
    if (domain.includes("tcs") || domain.includes("infosys")) return "SEPP"
    return "EPP"
  }
  