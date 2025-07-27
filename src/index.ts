export * from './fast-crud.module';

// Onboarding Module Exports
export * from './modules/onboarding/onboarding.module';
export * from './modules/onboarding/entities/onboarding.entity';
export * from './modules/onboarding/dto/create-onboarding.dto';
export * from './modules/onboarding/dto/update-onboarding.dto';
export * from './core/ports/onboarding-repository.port';
export * from './modules/onboarding/onboarding.service';

// Login Module Exports
export * from './modules/login/login.module';
export * from './modules/login/entities/login.entity';
export * from './modules/login/dto/create-login.dto';
export * from './modules/login/dto/update-login.dto';
export * from './core/ports/login-repository.port';
export * from './modules/login/login.service';

// Products Module Exports
export * from './modules/products/products.module';
export * from './modules/products/entities/products.entity';
export * from './modules/products/dto/create-products.dto';
export * from './modules/products/dto/update-products.dto';
export * from './core/ports/products-repository.port';
export * from './modules/products/products.service';

// Appointments Module Exports
export * from './modules/appointments/appointments.module';
export * from './modules/appointments/entities/appointments.entity';
export * from './modules/appointments/dto/create-appointments.dto';
export * from './modules/appointments/dto/update-appointments.dto';
export * from './core/ports/appointments-repository.port';
export * from './modules/appointments/appointments.service';
