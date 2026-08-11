export type RentalStatus =
  | 'booked'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface Rental {
  id: number;
  vehicleId: number;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: RentalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRentalRequest {
  vehicleId: number;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
}

export interface UpdateRentalRequest {
  vehicleId?: number;
  customerName?: string;
  customerPhone?: string;
  startDate?: string;
  endDate?: string;
  status?: RentalStatus;
}

export interface RentalQueryParams {
  vehicleId?: number;
  status?: RentalStatus;
  startDate?: string;
  endDate?: string;
}