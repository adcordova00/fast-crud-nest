import { Module, DynamicModule, Provider } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { APPOINTMENTS_REPOSITORY_PORT } from '../../core/ports/appointments-repository.port';

export interface AppointmentsModuleConfig {
  repositoryProvider: Provider;
  imports?: any[]; // Imports adicionales que el cliente necesite
}

@Module({})
export class AppointmentsModule {
  static register(config: AppointmentsModuleConfig): DynamicModule {
    console.log('[FAST-CRUD] AppointmentsModule.register called');
    
    if (!config?.repositoryProvider) {
      throw new Error('[FAST-CRUD] AppointmentsModule requires a repository provider. Please provide an implementation of AppointmentsRepositoryPort.');
    }

    return {
      module: AppointmentsModule,
      imports: config.imports || [],
      controllers: [AppointmentsController],
      providers: [
        AppointmentsService,
        config.repositoryProvider,
      ],
      exports: [AppointmentsService],
    };
  }
} 