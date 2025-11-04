import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGithubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";
import { useDebounce } from "use-debounce";
import { searchGithubUser } from "../api/github";
//import type { GitHubUser } from "../types";
import SuggestionDropDown from "./suggestionDropDown";
const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers");
    return stored ? JSON.parse(stored) : [];
  });
  const [debouncedUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //Query to fetch specific user
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["user", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername, // only fetch when username is set
  });
  //Query to fetch suggestions for search box
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1, // only fetch when username is set
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setSubmittedUsername(trimmed);
    setUsername("");
    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return updated.slice(0, 5);
    });
  };
  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  return (
    <div className="user-search">
      <form onSubmit={handleSubmit}>
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter GitHub username"
            id="username"
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);

              //setUsername(e.target.value)
            }}
          />
          {showSuggestions && suggestions?.length > 0 && (
            <SuggestionDropDown
              suggestions={suggestions}
              onSelect={(selectedUsername) => {
                setUsername(selectedUsername);
                if (submittedUsername !== selectedUsername) {
                  setSubmittedUsername(selectedUsername);
                }else{refetch(); }
                 setRecentUsers((prev) => {
                   const updated = [
                     selectedUsername,
                     ...prev.filter((u) => u !== selectedUsername),
                   ];
                   return updated.slice(0, 5);
                 });
                setShowSuggestions(false);
              }}
              show={showSuggestions}
            />
          )}
        </div>

        <button type="submit">Search</button>
      </form>

      {submittedUsername && <p>Searching for user: {submittedUsername}</p>}

      {isLoading && <p className="status">Loading...</p>}
      {error && <p className="status">Error: {(error as Error).message}</p>}
      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUsername(username);
            setSubmittedUsername(username);
          }}
        />
      )}
    </div>
  );
};

export default UserSearch;
