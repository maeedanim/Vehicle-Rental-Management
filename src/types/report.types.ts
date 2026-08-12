export interface RentalReport {
  id: number;
  name: string;
  totalBookings: number;
  daysRented: number;
  revenue: number;
}

export interface MonthlyRentalReport {
  month: string;
  vehicles: RentalReport[];
  highestRevenueVehicle: RentalReport | null;
}

export interface RentalReportQuery {
  month: string;
  vehicleId?: number;
}