import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  getCurrentUser: () => fetch("/api/auth/me").then(res => res.json()),

  // Communities
  getCommunity: (slug: string) => fetch(`/api/communities/${slug}`).then(res => res.json()),
  getCommunitySpaces: (id: number) => fetch(`/api/communities/${id}/spaces`).then(res => res.json()),
  getCommunityStats: (id: number) => fetch(`/api/communities/${id}/stats`).then(res => res.json()),

  // Posts
  getRecentPosts: (communityId: number, limit = 10) => 
    fetch(`/api/communities/${communityId}/posts?limit=${limit}`).then(res => res.json()),
  createPost: (post: any) => apiRequest("POST", "/api/posts", post),

  // Events
  getUpcomingEvents: (communityId: number, limit = 5) => 
    fetch(`/api/communities/${communityId}/events?limit=${limit}`).then(res => res.json()),
  createEvent: (event: any) => apiRequest("POST", "/api/events", event),

  // Members
  getTopMembers: (communityId: number, limit = 5) => 
    fetch(`/api/communities/${communityId}/members/top?limit=${limit}`).then(res => res.json()),
  updateMemberPoints: (userId: number, data: { communityId: number; points: number }) =>
    apiRequest("PUT", `/api/members/${userId}/points`, data),
};
