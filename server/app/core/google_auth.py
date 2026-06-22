from fastapi import HTTPException
import httpx

GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
 
async def verify_google_token(access_token: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10.0
        )
 
    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Google token"
        )
 
    data = response.json()
 
    if "error" in data:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Google token"
        )
 
    email = data.get("email")
    google_id = data.get("sub")
    name = data.get("name")
    picture = data.get("picture")
 
    if not email or not google_id:
        raise HTTPException(
            status_code=401,
            detail="Could not retrieve user info from Google"
        )
 
    return {
        "email": email, 
        "googleId": google_id, 
        "name": name,
        "picture": picture
    }