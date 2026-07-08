export interface Patient {
  id: string;
  name: string;
  age: number;
  heartRate: number;
  status: "Connected" | "Disconnected";
  roomNumber: string;
}
