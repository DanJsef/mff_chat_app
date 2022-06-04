export interface User {
  user_id?: number;
  username: string;
  password: string;
  salt?: string;
  friendship_id?: number;
}

export interface Session {
  session_id: string;
  user_id: number;
}

export interface FriendRequest {
  request_id: number;
  from_user: number;
  to_user: number;
}

export interface Friendship {
  friendship_id: number;
  first_user_id: number;
  second_user_id: number;
}

export interface Reply {
  friendship_id: number;
  sender_id: number;
  text: string;
  date: string;
}

export interface SocketComm {
  type: string;
  to?: number;
  from: number;
  pingBack: boolean;
  friendship?: number;
  content?: any;
  friendlist?: User[];
  friendRequests?: User[];
  replies?: Reply[] | Reply;
  refreshFriendlist?: boolean;
}
