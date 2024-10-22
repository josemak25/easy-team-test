export interface UserInterface {
  id: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  payroll_id: string;
  location_id: string;
  is_verified: boolean;
  email_address: string;
  organization_id: string;
  employer_payroll_id: string;
  is_global_time_tracking_enabled: boolean;
}

export interface UserSessionInterface {
  access_token: string;
  /**
   * A timestamp of when the token was issued. Returned when a login is confirmed.
   */
  issued_at: number;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: string;
  refresh_token: string;
  user: UserInterface | null;
}

export type AuthUserInterface = Pick<UserInterface, 'email_address'> & {
  password: string;
};
