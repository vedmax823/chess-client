import {Colors} from "./Colors";

export class Player {
  color: Colors;
  user: User | null;
  


  constructor(color: Colors, user : User | null = null) {
    this.color = color;
    this.user = user;
  }

}