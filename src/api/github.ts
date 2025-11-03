import { Query } from "@tanstack/react-query";

/*export const fetchGithubUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`
  );
  if (!res.ok) {
    throw new Error("User not found");
  }
  const data = await res?.json();
  console.log("this is my response data", data);
  return data;
};*/
export const fetchGithubUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "vite-app",
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub API Error: ${res.status}`);
  }

  return await res.json();
};

export const searchGithubUser = async (query: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/search/users?q=${query}`
  );
  if (!res.ok) {
    throw new Error("User not found");
  }
  const data = await res.json();
  console.log("this is my response data", data);
  return data.items;
};
export const checkIfFollowingUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (res.status === 204) {
    return true; // following
  } else if (res.status === 404) {
    return false; // not following
  } else {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Error checking following status");
  }
};
export const followUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to follow user: ${res.status}`);
  }
  return true;
};

export const unfollowUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to unfollow user: ${res.status}`);
  }
  return true;
};
