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
  ProductsEntity,
  LOGIN_REPOSITORY_PORT,
  ONBOARDING_REPOSITORY_PORT,
  PRODUCTS_REPOSITORY_PORT 
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
      // All modules are optional - use what you need
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
      products: {
        repositoryProvider: {
          provide: PRODUCTS_REPOSITORY_PORT,
          useClass: YourProductsRepository, // Your implementation
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

## 📦 Products Module Usage

The Products module provides comprehensive e-commerce product management:

### Basic Product Creation

```typescript
// POST /products
{
  "catalog": {
    "name": "Wireless Bluetooth Headphones",
    "sku": "WBH-001",
    "barcode": "1234567890123",
    "shortDescription": "Premium wireless headphones with noise cancellation",
    "longDescription": "Experience crystal-clear audio with our premium wireless Bluetooth headphones...",
    "type": "physical",
    "status": "active",
    "brand": "AudioTech",
    "weight": 0.35,
    "dimensions": {
      "length": 20,
      "width": 18,
      "height": 8,
      "unit": "cm"
    },
    "tags": ["wireless", "bluetooth", "noise-cancelling", "premium"]
  },
  "pricing": {
    "basePrice": 199.99,
    "salePrice": 149.99,
    "currency": "USD",
    "priceType": "fixed",
    "discounts": {
      "percentage": 25,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z"
    }
  },
  "inventory": {
    "currentStock": 100,
    "reorderLevel": 20,
    "stockStatus": "in_stock",
    "trackInventory": true,
    "locations": [
      {
        "warehouseId": "WH-001",
        "warehouseName": "Main Warehouse",
        "quantity": 100,
        "reserved": 5
      }
    ]
  },
  "specifications": {
    "features": [
      {
        "name": "Battery Life",
        "value": "30",
        "unit": "hours"
      },
      {
        "name": "Connectivity",
        "value": "Bluetooth 5.0"
      }
    ],
    "warranty": {
      "duration": 24,
      "type": "manufacturer",
      "coverage": "Full replacement"
    }
  },
  "media": {
    "images": [
      {
        "url": "https://example.com/headphones-main.jpg",
        "alt": "Wireless Bluetooth Headphones - Main View",
        "type": "image",
        "isPrimary": true
      }
    ],
    "primaryImageUrl": "https://example.com/headphones-main.jpg"
  },
  "seo": {
    "metaTitle": "Premium Wireless Bluetooth Headphones - AudioTech",
    "metaDescription": "Premium wireless Bluetooth headphones with 30-hour battery and noise cancellation",
    "keywords": ["wireless headphones", "bluetooth", "noise cancelling"],
    "slug": "wireless-bluetooth-headphones-audiotech"
  },
  "categories": {
    "primaryCategories": ["Electronics", "Audio"],
    "taxonomy": {
      "department": "Electronics",
      "category": "Audio",
      "subcategory": "Headphones"
    }
  }
}
```

### Product with Variants

```typescript
// POST /products
{
  "catalog": {
    "name": "Cotton T-Shirt",
    "sku": "TS-BASE",
    "type": "physical",
    "status": "active"
  },
  "variants": {
    "hasVariants": true,
    "variantOptions": [
      {
        "type": "size",
        "name": "Size",
        "values": [
          { "value": "S", "displayName": "Small" },
          { "value": "M", "displayName": "Medium" },
          { "value": "L", "displayName": "Large" }
        ]
      },
      {
        "type": "color",
        "name": "Color",
        "values": [
          { "value": "red", "displayName": "Red", "colorCode": "#FF0000" },
          { "value": "blue", "displayName": "Blue", "colorCode": "#0000FF" }
        ]
      }
    ],
    "combinations": [
      {
        "sku": "TS-S-RED",
        "options": { "size": "S", "color": "red" },
        "price": 25.99,
        "stock": 50
      },
      {
        "sku": "TS-M-BLUE",
        "options": { "size": "M", "color": "blue" },
        "price": 25.99,
        "stock": 30
      }
    ]
  }
}
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List products with filters |
| GET | `/products/:id` | Get product by ID |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Soft delete product |
| GET | `/products/search/advanced` | Advanced search with filters |
| GET | `/products/sku/:sku` | Find by SKU |
| GET | `/products/barcode/:barcode` | Find by barcode |
| PUT | `/products/:id/stock` | Update stock |
| POST | `/products/:id/stock/reserve` | Reserve stock |
| GET | `/products/inventory/low-stock` | Get low stock products |
| PUT | `/products/:id/price` | Update price |
| POST | `/products/:id/discount` | Apply discount |
| GET | `/products/:id/variants` | Get product variants |
| POST | `/products/:id/media` | Add media |
| PUT | `/products/:id/seo` | Update SEO data |
| GET | `/products/analytics/stats` | Product statistics |
| POST | `/products/bulk/import` | Bulk import |
| POST | `/products/:id/duplicate` | Duplicate product |

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
