import {  FaGithubAlt } from "react-icons/fa";
import  type { GitHubUser } from "../types";
const UserCard = ({user}:{user:GitHubUser}) => {
    return (
      <div className="user-card">
        <img src={user.avatar_url} alt={user.login} className="avatar" />
        <h2>{user.name || user.login }  </h2>
        <p className="bio">{user.bio}</p>
        <p>
          Followers: {user.followers} | Following: {user.following}
        </p>
        <a
          href={user.html_url}
          className="profile-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubAlt /> View Profile
        </a>
      </div>
    );
}
 
export default UserCard;