import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../features/auth/authSlice"

const NewEntry = () => {
  const user = useSelector(selectCurrentUser)


  return (
    <div>
        <h1>New Entry - protected route quand meme</h1>
        <p>Welcome {user ? user : ""}!</p>
    </div>
  )
}

export default NewEntry
