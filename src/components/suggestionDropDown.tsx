import type { GitHubUser } from "../types";
type SuggestionDropDownProps = {
    suggestions: GitHubUser[];
    onSelect: (username: string) => void;
    show: boolean;
}
const suggestionDropDown = ({suggestions,show,onSelect}:SuggestionDropDownProps) => {
   if(!show || suggestions.length ===0) {
    return null;
   }
   
    return (
      <ul className="suggestions">
        {suggestions.slice(0, 5).map((user: GitHubUser) => (
          <li
            key={user.login}
            onClick={() => onSelect(user.login)}
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="avatar-xs"
              width={20}
              height={20}
            />
            {user.login}
          </li>
        ))}
      </ul>
    );
}
 
export default suggestionDropDown;