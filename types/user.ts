export interface UserValues {
  username: string;
  password: string;
  roles: string[];
}

export interface UserUpdateValues extends UserValues {
  id: string;
  active: boolean;
}
