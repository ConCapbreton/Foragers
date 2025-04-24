const getGoogleTokens = async (code) => {
  
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT,
        grant_type: "authorization_code",
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Google token exchange failed: ${data.error_description || response.statusText}`)
    }

    return data
    
  } catch (error) {
    throw new Error(error.message)
  }
}

const getGoogleUser = async (accessToken, idToken) => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // fallback if response is not JSON
      throw new Error(`Failed to fetch user: ${errorData.error?.message || res.statusText}`);
    }

    const data = await response.json()
    return data

  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = { getGoogleTokens, getGoogleUser }
    
   