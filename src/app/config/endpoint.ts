export class EndpointConfig {
  // Call backend directly on port 8089
  static readonly BASE_URL = 'http://localhost:8089/api';
  static readonly AUTH_URL = this.BASE_URL+'/auth/login';
  static readonly REGISTER_URL = this.BASE_URL+'auth/register';
  static readonly ROLE_URL = this.BASE_URL+'/roles';
  static readonly PROFILE_URL = this.BASE_URL+'/profiles';
}