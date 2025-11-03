import { useQuery, useMutation } from "@tanstack/react-query";
import { checkIfFollowingUser, followUser, unfollowUser } from "../api/github";
import { FaGithubAlt, FaUserMinus, FaUserPlus } from "react-icons/fa";
import type { GitHubUser } from "../types";
import { toast } from "sonner";

const UserCard = ({ user }: { user: GitHubUser }) => {
  // Query: Check follow status
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ["follow-status", user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  // Mutation: Follow a user
  const followMutation = useMutation({
    mutationFn: () => followUser(user.login),
    onSuccess: () => {
      toast.success(`You followed ${user.login}`);
      refetch();
    },
    onError: () => {
      toast.error(`Failed to follow ${user.login}`);
    },
  });

  // Mutation: Unfollow a user
  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(user.login),
    onSuccess: () => {
      toast.success(`You unfollowed ${user.login}`);
      refetch();
    },
    onError: () => {
      toast.error(`Failed to unfollow ${user.login}`);
    },
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className="user-card">
      <img src={user.avatar_url} alt={user.login} className="avatar" />
      <h2>{user.name || user.login}</h2>
      <p className="bio">{user.bio}</p>
      <p>
        Followers: {user.followers} | Following: {user.following}
      </p>
      <div className="user-card-buttons">
        <button
          onClick={handleFollowToggle}
          className={`follow-btn ${isFollowing ? "following" : ""}`}
          disabled={followMutation.isPending || unfollowMutation.isPending}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className="follow-icon" /> Following
            </>
          ) : (
            <>
              <FaUserPlus className="follow-icon" /> Follow User
            </>
          )}
        </button>
        <a
          href={user.html_url}
          className="profile-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubAlt /> View Profile
        </a>
      </div>
    </div>
  );
};

export default UserCard;
