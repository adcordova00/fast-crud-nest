# 🧩 fast-crud-nest

**Fast, modular, and extensible CRUD library for NestJS monoliths.**

`fast-crud-nest` is a highly customizable and opinionated library for building CRUD modules with NestJS. It provides default logic using TypeORM and allows full extensibility via custom adapters, clean interfaces, and modular design.

---

## 🚀 Features

- ✅ **Plug & Play CRUD modules** - Just configure and use
- ✅ **Complete Authentication System** - Login, registration, social auth, 2FA
- ✅ **Complex Onboarding Flow** - Comprehensive user data collection
- ✅ **Default TypeORM support** - Works out of the box
- ✅ **Custom repository injection** - Adapter pattern for any database
- ✅ **Clean Architecture** - Domain, Application, Infrastructure layers
- ✅ **Rich DTOs** - Complex, nested validation structures
- ✅ **Social Login** - Google, Facebook, GitHub, Microsoft, Apple
- ✅ **Security Features** - 2FA, account locking, session management
- ✅ **Multi-tenant support** - Organization-based user management
- ✅ **Pagination & Soft Delete** - Built-in data management
- ✅ **OAuth 2.0 compliant** - Standard authentication flows
- ✅ **Comprehensive error handling** - Detailed error responses
- ✅ **TypeScript first** - Full type safety

---

## 📦 Installation

```bash
npm install fast-crud-nest

# Dependencies (if not already installed)
npm install @nestjs/common @nestjs/core @nestjs/typeorm
npm install class-transformer class-validator
npm install typeorm reflect-metadata
```

---

## 🏗️ Architecture Overview

Fast-Crud-Nest follows Clean Architecture principles:

```
src/
├── core/                    # Domain layer
│   ├── ports/              # Repository interfaces
│   └── exceptions/         # Custom exceptions
├── modules/                # Application layer
│   ├── onboarding/        # Onboarding CRUD module
│   └── login/             # Authentication module
└── fast-crud.module.ts    # Main library module
```

### 🔌 Ports & Adapters Pattern

The library uses dependency injection to allow custom repository implementations:

- **Ports**: Repository interfaces (`LoginRepositoryPort`, `OnboardingRepositoryPort`)
- **Adapters**: Your database implementations
- **Injection**: Dynamic modules with custom providers

---

## 🚀 Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  FastCrudModule, 
  LoginEntity, 
  OnboardingEntity,
  LOGIN_REPOSITORY_PORT,
  ONBOARDING_REPOSITORY_PORT 
} from 'fast-crud-nest';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'app.db',
      entities: [LoginEntity, OnboardingEntity],
      synchronize: true,
    }),
    FastCrudModule.forRoot({
      // Both modules are optional - use what you need
      login: {
        repositoryProvider: {
          provide: LOGIN_REPOSITORY_PORT,
          useClass: YourLoginRepository, // Your implementation
        },
      },
      onboarding: {
        repositoryProvider: {
          provide: ONBOARDING_REPOSITORY_PORT,
          useClass: YourOnboardingRepository, // Your implementation
        },
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Create Repository Implementations

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  LoginRepositoryPort, 
  LoginEntity, 
  CreateLoginDto 
} from 'fast-crud-nest';

@Injectable()
export class LoginRepository implements LoginRepositoryPort {
  constructor(
    @InjectRepository(LoginEntity)
    private repo: Repository<LoginEntity>,
  ) {}

  async create(data: CreateLoginDto): Promise<LoginEntity> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findAll(params?: any): Promise<LoginEntity[]> {
    return await this.repo.find({
      where: { isDeleted: false },
      take: params?.limit || 10,
      skip: ((params?.page || 1) - 1) * (params?.limit || 10),
    });
  }

  async findById(id: string): Promise<LoginEntity> {
    return await this.repo.findOne({ 
      where: { id, isDeleted: false } 
    });
  }

  async findByEmail(email: string): Promise<LoginEntity> {
    return await this.repo.findOne({
      where: { 
        basicAuth: { email } as any, // TypeORM JSON query
        isDeleted: false 
      }
    });
  }

  async findByUsername(username: string): Promise<LoginEntity> {
    return await this.repo.findOne({
      where: { 
        basicAuth: { username } as any,
        isDeleted: false 
      }
    });
  }

  async findBySocialId(provider: string, socialId: string): Promise<LoginEntity> {
    return await this.repo.findOne({
      where: { 
        social: { [`${provider}Id`]: socialId } as any,
        isDeleted: false 
      }
    });
  }

  async update(id: string, data: any): Promise<LoginEntity> {
    await this.repo.update(id, data);
    return await this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { isDeleted: true });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.repo.update(id, { 
      basicAuth: { passwordHash } as any 
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repo.update(id, { 
      basicAuth: { lastLoginAt: new Date().toISOString() } as any 
    });
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    // Implementation depends on your JSON field handling
  }

  async resetLoginAttempts(id: string): Promise<void> {
    // Implementation depends on your JSON field handling
  }

  async lockAccount(id: string, lockUntil: Date): Promise<void> {
    await this.repo.update(id, { 
      security: { lockedUntil: lockUntil.toISOString() } as any 
    });
  }

  async unlockAccount(id: string): Promise<void> {
    await this.repo.update(id, { 
      security: { lockedUntil: null } as any 
    });
  }
}
```

---

## 🔐 Authentication Module Usage

The Login module provides comprehensive authentication features:

### Basic Registration & Login

```typescript
// POST /auth/register
{
  "basicAuth": {
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword123",
    "confirmPassword": "securepassword123"
  },
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "Johnny"
  },
  "preferences": {
    "language": "en",
    "emailNotifications": true
  },
  "terms": {
    "acceptedTerms": true,
    "acceptedPrivacyPolicy": true,
    "termsAcceptedAt": "2024-01-01T00:00:00Z"
  }
}

// POST /auth/login
{
  "emailOrUsername": "user@example.com",
  "password": "securepassword123",
  "rememberMe": true
}
```

### Social Authentication

```typescript
// POST /auth/social/register
{
  "provider": "google",
  "socialId": "google-user-id-123",
  "profileData": {
    "email": "user@gmail.com",
    "given_name": "John",
    "family_name": "Doe",
    "picture": "https://avatar-url.com/image.jpg"
  }
}

// POST /auth/social/login
{
  "provider": "google",
  "socialId": "google-user-id-123",
  "accessToken": "google-access-token"
}
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with credentials |
| POST | `/auth/social/login` | Social login |
| POST | `/auth/social/register` | Social registration |
| PUT | `/auth/password/change/:id` | Change password |
| POST | `/auth/password/reset` | Reset password |
| PUT | `/auth/account/lock/:id` | Lock account |
| PUT | `/auth/account/unlock/:id` | Unlock account |
| GET | `/auth/users` | List users (paginated) |
| GET | `/auth/users/:id` | Get user by ID |
| PUT | `/auth/users/:id` | Update user |
| DELETE | `/auth/users/:id` | Soft delete user |
| GET | `/auth/profile/:id` | Get user profile |
| PUT | `/auth/profile/:id` | Update profile |
| PUT | `/auth/security/2fa/enable/:id` | Enable 2FA |
| GET | `/auth/sessions/:id` | Get user sessions |
| GET | `/auth/admin/users/stats` | Admin user stats |

---

## 📝 Onboarding Module Usage

Complex data collection for comprehensive user onboarding:

```typescript
// POST /onboarding
{
  "identity": {
    "documentType": "passport",
    "documentNumber": "A12345678",
    "nationality": "US"
  },
  "contact": {
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "residentialAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "personal": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  },
  "employment": {
    "occupation": "Software Engineer",
    "companyName": "Tech Corp",
    "yearsOfExperience": 5
  },
  "financial": {
    "monthlyIncome": 8000,
    "bankName": "Bank of America",
    "accountType": "checking"
  }
}
```

---

## 🔧 Configuration Options

### Module Configuration

```typescript
FastCrudModule.forRoot({
  login: {
    repositoryProvider: {
      provide: LOGIN_REPOSITORY_PORT,
      useClass: CustomLoginRepository,
    },
    imports: [
      // Additional modules for login
      JwtModule.register({ secret: 'jwt-secret' }),
      PassportModule,
    ],
  },
  onboarding: {
    repositoryProvider: {
      provide: ONBOARDING_REPOSITORY_PORT,
      useClass: CustomOnboardingRepository,
    },
    imports: [
      // Additional modules for onboarding
      FileUploadModule,
    ],
  },
})
```

### Database Support

The library works with any database supported by TypeORM:

```typescript
// PostgreSQL
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'myapp',
  entities: [LoginEntity, OnboardingEntity],
  synchronize: false, // Use migrations in production
})

// MongoDB
TypeOrmModule.forRoot({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'myapp',
  entities: [LoginEntity, OnboardingEntity],
})

// MySQL
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'user',
  password: 'password',
  database: 'myapp',
  entities: [LoginEntity, OnboardingEntity],
})
```

---

## 🛡️ Security Features

### Two-Factor Authentication

```typescript
// Enable 2FA
PUT /auth/security/2fa/enable/:userId

// Disable 2FA
PUT /auth/security/2fa/disable/:userId
```

### Account Locking

- Automatic account locking after failed login attempts
- Manual account locking/unlocking by admins
- Configurable lock duration

### Password Security

- Minimum password requirements
- Password change tracking
- Secure password reset flow

### Session Management

- Multiple device sessions
- Session termination
- Activity tracking

---

## 📊 Advanced Usage

### Custom Validation

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### Error Handling

```typescript
import { 
  FastCrudException, 
  FastCrudValidationException 
} from 'fast-crud-nest';

// Custom error handling
@Catch(FastCrudException)
export class FastCrudExceptionFilter implements ExceptionFilter {
  catch(exception: FastCrudException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    response
      .status(exception.statusCode)
      .json({
        status: 'error',
        message: exception.message,
        code: exception.code,
        timestamp: new Date().toISOString(),
      });
  }
}
```

### Pagination

```typescript
// GET /auth/users?page=1&limit=10&search=john&status=active
const users = await loginService.findAll({
  page: 1,
  limit: 10,
  search: 'john',
  status: 'active'
});
```

---

## 🧪 Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { LoginService, LOGIN_REPOSITORY_PORT } from 'fast-crud-nest';

describe('LoginService', () => {
  let service: LoginService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: LOGIN_REPOSITORY_PORT,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should register a user', async () => {
    const createDto = {
      basicAuth: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: '1', ...createDto });

    const result = await service.register(createDto);
    expect(result.id).toBe('1');
  });
});
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🔗 Links

- [GitHub Repository](https://github.com/adcordova00/fast-crud-nest)
- [NPM Package](https://www.npmjs.com/package/fast-crud-nest)
- [Issues](https://github.com/adcordova00/fast-crud-nest/issues)

---

## 📚 Examples

### Complete Application Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  FastCrudModule,
  LoginEntity,
  OnboardingEntity,
  LOGIN_REPOSITORY_PORT,
  ONBOARDING_REPOSITORY_PORT
} from 'fast-crud-nest';
import { LoginRepository } from './repositories/login.repository';
import { OnboardingRepository } from './repositories/onboarding.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [LoginEntity, OnboardingEntity],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([LoginEntity, OnboardingEntity]),
    FastCrudModule.forRoot({
      login: {
        repositoryProvider: {
          provide: LOGIN_REPOSITORY_PORT,
          useClass: LoginRepository,
        },
      },
      onboarding: {
        repositoryProvider: {
          provide: ONBOARDING_REPOSITORY_PORT,
          useClass: OnboardingRepository,
        },
      },
    }),
  ],
})
export class AppModule {}

// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(3000);
  console.log('🚀 Fast-Crud-Nest app running on http://localhost:3000');
}
bootstrap();
```

Ready to build amazing CRUD applications with NestJS! 🚀
