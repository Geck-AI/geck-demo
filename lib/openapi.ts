/**
 * OpenAPI 3.0 Specification Generator
 * Centralized OpenAPI spec that can be used by multiple endpoints
 */

export function getOpenApiSpec() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.geck.ai';

  return {
    openapi: '3.0.0',
    info: {
      title: 'THE STORE API',
      version: '1.0.0',
      description: `RESTful API for THE STORE e-commerce platform. Provides endpoints for product catalog, authentication, cart management, and order processing.

## Idempotency

This API supports idempotent operations to ensure safe retries and prevent duplicate actions. 

**Naturally Idempotent Methods:**
- GET requests are always idempotent (safe to retry)
- PUT requests are idempotent (replacing a resource with the same data)
- DELETE requests are idempotent (deleting an already-deleted resource has no effect)

**Idempotency Keys:**
For POST operations that create resources (e.g., order creation, user registration), you can provide an \`Idempotency-Key\` header to ensure idempotent behavior. When provided:
- The first request with a unique key executes normally
- Subsequent requests with the same key return the cached response
- The response includes \`Idempotency-Replay: true\` header when serving from cache

**Recommended Usage:**
- Always use idempotency keys for order creation to prevent duplicate charges
- Use idempotency keys for user registration to prevent duplicate accounts
- Idempotency keys should be UUIDs or other unique identifiers
- Keys are valid for 24 hours (orders) or 1 hour (registrations)`,
      contact: {
        name: 'THE STORE Support',
        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com',
      },
      license: {
        name: 'CC-BY-4.0',
        url: 'https://creativecommons.org/licenses/by/4.0/',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'Production server',
      },
      {
        url: process.env.NEXT_PUBLIC_STAGING_URL || baseUrl.replace('www.', 'staging.').replace('http://localhost:3005', 'http://staging.localhost:3005'),
        description: 'Staging/Test server - Safe for automated testing',
      },
      {
        url: 'http://localhost:3005',
        description: 'Development server',
      },
    ],
    paths: {
      '/api/store/styles': {
        get: {
          summary: 'Get all products',
          description: 'Retrieves a list of all available products from the catalog.',
          operationId: 'getAllProducts',
          tags: ['Products'],
          responses: {
            '200': {
              description: 'Successful response with array of products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Product',
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
            },
          },
        },
      },
      '/api/store/styles/{id}': {
        get: {
          summary: 'Get product by ID',
          description: 'Retrieves a single product by its unique identifier.',
          operationId: 'getProductById',
          tags: ['Products'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Product ID',
              schema: {
                type: 'integer',
                example: 12345,
              },
            },
          ],
          responses: {
            '200': {
              description: 'Successful response with product details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      style: {
                        $ref: '#/components/schemas/Product',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid product ID format',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '404': {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          summary: 'Register new user',
          description: 'Creates a new user account and automatically logs in the user. This operation is idempotent when an Idempotency-Key header is provided. Subsequent requests with the same key will return the original response without creating a duplicate account.',
          operationId: 'registerUser',
          tags: ['Authentication'],
          parameters: [
            {
              name: 'Idempotency-Key',
              in: 'header',
              required: false,
              description: 'A unique key to ensure idempotent operation. If provided, subsequent requests with the same key will return the cached response without creating a duplicate account.',
              schema: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'User registered successfully (or retrieved from cache if idempotency key was reused)',
              headers: {
                'Idempotency-Key': {
                  description: 'Echo of the provided Idempotency-Key header',
                  schema: {
                    type: 'string',
                  },
                },
                'Idempotency-Replay': {
                  description: 'Indicates whether this response was served from cache (true) or is a new operation (false)',
                  schema: {
                    type: 'string',
                    enum: ['true', 'false'],
                  },
                },
              },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '409': {
              description: 'Email already exists',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'User login',
          description: 'Authenticates a user with email/username and password.',
          operationId: 'loginUser',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/sandbox': {
        get: {
          summary: 'Sandbox endpoint for automated testing',
          description: 'Provides sandbox information and test operations for partner agents and automation tools. Only active in staging/development environments.',
          operationId: 'getSandboxInfo',
          tags: ['Sandbox'],
          responses: {
            '200': {
              description: 'Sandbox information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      sandbox: {
                        type: 'boolean',
                        example: true,
                      },
                      environment: {
                        type: 'string',
                        enum: ['production', 'staging', 'development'],
                      },
                      isStaging: {
                        type: 'boolean',
                        example: true,
                      },
                      status: {
                        type: 'string',
                        enum: ['active', 'inactive'],
                      },
                      features: {
                        type: 'object',
                        properties: {
                          testMode: { type: 'boolean' },
                          sandbox: { type: 'boolean' },
                          apiKeysEnabled: { type: 'boolean' },
                        },
                      },
                      endpoints: {
                        type: 'object',
                        description: 'Available API endpoints',
                      },
                    },
                  },
                },
              },
              headers: {
                'X-Environment': {
                  description: 'Current environment',
                  schema: { type: 'string' },
                },
                'X-Is-Staging': {
                  description: 'Whether this is a staging environment',
                  schema: { type: 'boolean' },
                },
                'X-Sandbox-Mode': {
                  description: 'Whether sandbox mode is active',
                  schema: { type: 'boolean' },
                },
              },
            },
          },
        },
        post: {
          summary: 'Execute test operation in sandbox',
          description: 'Execute a test operation in sandbox mode. Only available in staging/development environments.',
          operationId: 'executeSandboxTest',
          tags: ['Sandbox'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['operation'],
                  properties: {
                    operation: {
                      type: 'string',
                      enum: ['create-test-order', 'create-test-user', 'reset-test-data', 'validate-api-key', 'test-rate-limits', 'ping'],
                      description: 'Test operation to execute',
                    },
                    parameters: {
                      type: 'object',
                      description: 'Optional parameters for the operation',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Test operation executed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      sandbox: { type: 'boolean' },
                      operation: { type: 'string' },
                      result: { type: 'object' },
                    },
                  },
                },
              },
            },
            '403': {
              description: 'Sandbox operations not available in production',
            },
            '400': {
              description: 'Invalid operation or request',
            },
          },
        },
      },
      '/api/services/orders': {
        post: {
          summary: 'Create order',
          description: 'Creates a new order with shipping details and items. This operation is idempotent when an Idempotency-Key header is provided. Subsequent requests with the same key will return the original response without creating a duplicate order.',
          operationId: 'createOrder',
          tags: ['Orders'],
          parameters: [
            {
              name: 'Idempotency-Key',
              in: 'header',
              required: false,
              description: 'A unique key to ensure idempotent operation. If provided, subsequent requests with the same key will return the cached response without creating a duplicate order. Recommended for order creation to prevent duplicate charges.',
              schema: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order created successfully (or retrieved from cache if idempotency key was reused)',
              headers: {
                'Idempotency-Key': {
                  description: 'Echo of the provided Idempotency-Key header',
                  schema: {
                    type: 'string',
                  },
                },
                'Idempotency-Replay': {
                  description: 'Indicates whether this response was served from cache (true) or is a new operation (false)',
                  schema: {
                    type: 'string',
                    enum: ['true', 'false'],
                  },
                },
              },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid order data',
            },
            '409': {
              description: 'Idempotency key conflict (if key format is invalid)',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique product identifier',
              example: 12345,
            },
            gender: {
              type: 'string',
              example: 'Men',
            },
            masterCategory: {
              type: 'string',
              example: 'Apparel',
            },
            subCategory: {
              type: 'string',
              example: 'Topwear',
            },
            articleType: {
              type: 'string',
              example: 'Tshirt',
            },
            baseColour: {
              type: 'string',
              example: 'Navy Blue',
            },
            productDisplayName: {
              type: 'string',
              example: 'Men Navy Blue T-Shirt',
            },
            imageURL: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/image.jpg',
            },
            priceUSD: {
              type: 'number',
              format: 'float',
              example: 29.99,
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'phone', 'street', 'city', 'state', 'zipcode', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            street: {
              type: 'string',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              example: 'New York',
            },
            state: {
              type: 'string',
              example: 'NY',
            },
            zipcode: {
              type: 'string',
              example: '10001',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'securepassword123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Email address or username',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'dummy-jwt-token',
            },
            user: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'John Doe',
                },
                email: {
                  type: 'string',
                  example: 'john@example.com',
                },
              },
            },
          },
        },
        OrderRequest: {
          type: 'object',
          required: ['name', 'streetAddress', 'city', 'state', 'zipcode', 'items', 'totalAmount'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            streetAddress: {
              type: 'string',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              example: 'New York',
            },
            state: {
              type: 'string',
              example: 'NY',
            },
            zipcode: {
              type: 'string',
              example: '10001',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                  },
                  quantity: {
                    type: 'integer',
                  },
                  priceUSD: {
                    type: 'number',
                  },
                },
              },
            },
            totalAmount: {
              type: 'number',
              example: 99.99,
            },
            timestamp: {
              type: 'integer',
              description: 'Unix timestamp',
            },
          },
        },
        OrderResponse: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              example: 'ABCD-240610',
            },
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Order placed successfully',
            },
            arrivalDate: {
              type: 'string',
              format: 'date',
              example: '2024-06-13',
            },
            orderDetails: {
              $ref: '#/components/schemas/OrderRequest',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth-token',
          description: 'Authentication via HTTP-only cookie',
        },
      },
    },
    tags: [
      {
        name: 'Products',
        description: 'Product catalog endpoints',
      },
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
      {
        name: 'Sandbox',
        description: 'Sandbox and test mode endpoints for automated testing. Only available in staging/development environments.',
      },
    ],
  };
}

