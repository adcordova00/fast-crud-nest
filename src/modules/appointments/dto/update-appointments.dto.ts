import { 
  CreateAppointmentsDto,
} from './create-appointments.dto';

// Extraer los tipos de las clases internas del CreateAppointmentsDto
type ScheduleDto = CreateAppointmentsDto['schedule'];
type ServiceDto = CreateAppointmentsDto['service'];
type ParticipantsDto = CreateAppointmentsDto['participants'];
type LocationDto = CreateAppointmentsDto['location'];
type RecurrenceDto = CreateAppointmentsDto['recurrence'];
type RemindersDto = CreateAppointmentsDto['reminders'];
type PaymentDto = CreateAppointmentsDto['payment'];
type AvailabilityDto = CreateAppointmentsDto['availability'];
type MetadataDto = CreateAppointmentsDto['metadata'];

export class UpdateAppointmentsDto {
  schedule?: Partial<ScheduleDto>;
  service?: Partial<ServiceDto>;
  participants?: Partial<ParticipantsDto>;
  location?: Partial<LocationDto>;
  recurrence?: Partial<RecurrenceDto>;
  reminders?: Partial<RemindersDto>;
  payment?: Partial<PaymentDto>;
  availability?: Partial<AvailabilityDto>;
  metadata?: Partial<MetadataDto>;
  createdDate?: string;
  createdBy?: string;
  organizationId?: string;
} 