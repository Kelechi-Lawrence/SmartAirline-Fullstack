import axios from "axios";

export default class ApiService {

  static BASE_URL = "http://localhost:8080/";

  // TOKEN MANAGEMENT
  static saveToken(token){
      localStorage.setItem("token", token);
  }

  static getToken(){
      return localStorage.getItem("token");
  }

  static saveRoles(roles){
      localStorage.setItem("roles", JSON.stringify(roles));
  }

  static getRoles(){
      const roles = localStorage.getItem("roles");
      return roles ? JSON.parse(roles) : [];
  }

  static hasRoles(role){
      const roles = this.getRoles();
      return roles.includes(role);
  }

  static isAdmin(){
      return this.hasRoles("ADMIN");
  }

  static isPilot(){
      return this.hasRoles("PILOT");
  }

  static isCustomer(){
      return this.hasRoles("CUSTOMER");
  }

  static logOut(){
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
  }

  static isAuthenticated(){
      return !!this.getToken();
  }

  // HEADER
  static getHeader() {
      const token = this.getToken();

      return {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
      };
  }

  // AUTH METHODS

  static async register(body) {
    console.log(this.BASE_URL + "api/auth/register");
      const resp = await axios.post(
          this.BASE_URL + "api/auth/register",
          body
      );
      return resp.data;
  }

  static async login(body){
      const resp = await axios.post(
          this.BASE_URL + "api/auth/login",
          body
      );
      return resp.data;
  }
 
static async registerUser(userData) {
    const response = await axios.post(`${this.BASE_URL}/auth/register`, userData);
    return response.data;
}

  // USER METHODS

  static async getAccountDetails(){
      const resp = await axios.get(
          this.BASE_URL + "api/users/details",
          { headers: this.getHeader() }
      );

      return resp.data;
  }

  static async updateAccountDetails(body){
      const resp = await axios.put(
          this.BASE_URL + "api/users/update",
          body,
          { headers: this.getHeader() }
      );

      return resp.data;
  }

  static async getPilots(){
      const resp = await axios.get(
          this.BASE_URL + "api/users/pilots",
          { headers: this.getHeader() }
      );

      return resp.data;
  }

  // AIRPORT METHODS

  static async createAirport(body){
      const resp = await axios.post(
          this.BASE_URL + "api/airports/createAirport",
          body,
          { headers: this.getHeader() }
      );
      return resp.data;
  }

  static async updateAirport(body){
      const resp = await axios.put(
          this.BASE_URL + "api/airports/updateAirport",
          body,
          { headers: this.getHeader() }
      );
      return resp.data;
  }

  static async getAllAirports(){
      const resp = await axios.get(
          this.BASE_URL + "api/airports/getAirport"
      );
      return resp.data;
  }

  static async getAirportById(id){
      const resp = await axios.get(
          this.BASE_URL + "api/airports/" + id
      );
      return resp.data;
  }

  // BOOKING METHODS

static async createBooking(body) {
    const resp = await axios.post(
        this.BASE_URL + "api/booking",
        body, 
        {
            headers: this.getHeader() 
        }
    );
    return resp.data;
}

  static async getBookingById(id){
      const resp = await axios.get(
          this.BASE_URL + "api/booking/" + id,
          { 
            headers: this.getHeader() // ADD THIS LINE
        }
      );
      return resp.data;
  }

  static async getAllBookings(){
      const resp = await axios.get(
          this.BASE_URL + "api/booking/my-bookings",
          { headers: this.getHeader() }
      );
      return resp.data;
  }

  static async updateBookingStatus(id, status){
      const resp = await axios.put(
          this.BASE_URL + "api/booking/" + id,
          status,
          { headers: this.getHeader() }
      );
      return resp.data;
  }

  // FLIGHT METHODS

  static async createFlight(body) {
      const resp = await axios.post(
          this.BASE_URL + "api/flight",
          body,
          { headers: this.getHeader() }
      );
      return resp.data;
  }static async searchFlights(criteria) {
   
    const params = {
        departureTimeIataCode: criteria.departureIataCode,
        arrivalTimeIataCode: criteria.arrivalIataCode,
        status: "SCHEDULED"
    };

   
    if (criteria.departureDate && criteria.departureDate.trim() !== "") {
        params.departureTime = `${criteria.departureDate}T00:00:00`;
    }

    const resp = await axios.get(
        `${this.BASE_URL}api/flight/search`, 
        { 
            params,
            headers: this.getHeader() 
        }
    );

    return resp.data;
}
  static async getFlightById(id) {
      const resp = await axios.get(
          this.BASE_URL + "api/flight/" + id
      );
      return resp.data;
  }

  static async getAllFlights() {
      const resp = await axios.get(
          this.BASE_URL + "api/flight/AllFlights"
      );
      return resp.data;
  }

  static async updateFlight(body) {
      const resp = await axios.put(
          this.BASE_URL + "api/flight/update",
          body,
          { headers: this.getHeader() }
      );
      return resp.data;
  }

 

  static async getAllCountries(){
      const resp = await axios.get(
          this.BASE_URL + "api/flight/Countries"
      );
      return resp.data;
  }

  static async getAllCities(){
      const resp = await axios.get(
          this.BASE_URL + "api/flight/cities"
      );
      return resp.data;
  }

}