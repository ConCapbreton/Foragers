export const generateGoogleAuthUrl = (): string => {
   
    console.log(import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT, import.meta.env.VITE_GOOGLE_CLIENT_ID)

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        access_type: "offline", // Needed to get a refresh token for long-term access (e.g., keeping users logged in)
        response_type: "code",
        prompt: "consent", // Without this only get a refresh token the first time a user consents,
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    }

    const params = new URLSearchParams(options).toString()

    return `${rootUrl}?${params}`;
}