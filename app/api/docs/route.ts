import { NextResponse } from 'next/server';

/**
 * OpenAPI 3.0 Documentation for THE STORE API
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'THE STORE API',
      version: '1.0.0',
      description: 'RESTful API for THE STORE e-commerce platform. Provides endpoints for product catalog, authentication, cart management, and order processing.',
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
          description: 'Creates a new user account and automatically logs in the user.',
          operationId: 'registerUser',
          tags: ['Authentication'],
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
              description: 'User registered successfully',
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
      '/api/auth/logout': {
        post: {
          summary: 'User logout',
          description: 'Logs out the current user by clearing the authentication cookie.',
          operationId: 'logoutUser',
          tags: ['Authentication'],
          responses: {
            '200': {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Logged out successfully',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/otp/request': {
        post: {
          summary: 'Request OTP',
          description: 'Requests a one-time password (OTP) for authentication via email or phone.',
          operationId: 'requestOTP',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['identifier'],
                  properties: {
                    identifier: {
                      type: 'string',
                      description: 'Email address or phone number',
                      example: 'user@example.com',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'OTP sent successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'OTP sent successfully',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request',
            },
          },
        },
      },
      '/api/auth/otp/verify': {
        post: {
          summary: 'Verify OTP',
          description: 'Verifies a one-time password (OTP) code for authentication.',
          operationId: 'verifyOTP',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['identifier', 'code'],
                  properties: {
                    identifier: {
                      type: 'string',
                      description: 'Email address or phone number',
                      example: 'user@example.com',
                    },
                    code: {
                      type: 'string',
                      description: 'OTP code',
                      example: '123456',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'OTP verified successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Invalid or expired OTP',
            },
            '404': {
              description: 'OTP not found or user not registered',
            },
          },
        },
      },
      '/api/auth/api-keys': {
        post: {
          summary: 'Generate API key',
          description: 'Generates a new API key for authenticated users (partner agents). The key can be used for programmatic access to the API.',
          operationId: 'generateApiKey',
          tags: ['Authentication'],
          security: [
            {
              cookieAuth: [],
            },
          ],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Optional name for the API key',
                      example: 'Production Bot',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'API key generated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      apiKey: {
                        type: 'string',
                        description: 'The generated API key (store securely - shown only once)',
                        example: 'sk_abc123xyz789...',
                      },
                      keyId: {
                        type: 'string',
                        example: 'key_1234567890_abc123',
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                      expiresAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                      scopes: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                        example: ['read', 'write'],
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Authentication required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
            },
          },
        },
        get: {
          summary: 'List API keys',
          description: 'Retrieves a list of API keys for the authenticated user.',
          operationId: 'listApiKeys',
          tags: ['Authentication'],
          security: [
            {
              cookieAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'List of API keys',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      keys: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            createdAt: {
                              type: 'string',
                              format: 'date-time',
                            },
                            expiresAt: {
                              type: 'string',
                              format: 'date-time',
                            },
                            scopes: {
                              type: 'array',
                              items: {
                                type: 'string',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Authentication required',
            },
          },
        },
        delete: {
          summary: 'Revoke API key',
          description: 'Revokes an API key by its ID.',
          operationId: 'revokeApiKey',
          tags: ['Authentication'],
          security: [
            {
              cookieAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['keyId'],
                  properties: {
                    keyId: {
                      type: 'string',
                      description: 'ID of the API key to revoke',
                      example: 'key_1234567890_abc123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'API key revoked successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      message: {
                        type: 'string',
                        example: 'API key revoked successfully',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request',
            },
            '401': {
              description: 'Authentication required',
            },
          },
        },
      },
      '/api/services/orders': {
        post: {
          summary: 'Create order',
          description: 'Creates a new order with shipping details and items.',
          operationId: 'createOrder',
          tags: ['Orders'],
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
              description: 'Order created successfully',
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
          },
        },
      },
      '/api/performance/budgets': {
        get: {
          summary: 'Get performance budget targets',
          description: 'Returns performance budget targets optimized for agent access (LCP, INP, CLS, TTFB).',
          operationId: 'getPerformanceBudgets',
          tags: ['Performance'],
          responses: {
            '200': {
              description: 'Performance budget targets',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      budgets: {
                        type: 'object',
                        properties: {
                          lcp: {
                            type: 'object',
                            properties: {
                              target: { type: 'number', example: 2.5 },
                              unit: { type: 'string', example: 'seconds' },
                              description: { type: 'string' },
                            },
                          },
                          inp: {
                            type: 'object',
                            properties: {
                              target: { type: 'number', example: 200 },
                              unit: { type: 'string', example: 'milliseconds' },
                              description: { type: 'string' },
                            },
                          },
                          cls: {
                            type: 'object',
                            properties: {
                              target: { type: 'number', example: 0.1 },
                              unit: { type: 'string', example: 'score' },
                              description: { type: 'string' },
                            },
                          },
                          ttfb: {
                            type: 'object',
                            properties: {
                              target: { type: 'number', example: 600 },
                              unit: { type: 'string', example: 'milliseconds' },
                              description: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/feedback/corrections': {
        post: {
          summary: 'Submit feedback or correction request',
          description: 'Allows users to submit feedback or request corrections to content.',
          operationId: 'submitFeedback',
          tags: ['Feedback'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Feedback submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      id: {
                        type: 'string',
                        example: 'feedback_1234567890',
                      },
                      message: {
                        type: 'string',
                        example: 'Thank you for your feedback',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request data',
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
        get: {
          summary: 'Get feedback submissions',
          description: 'Retrieves stored feedback and correction requests (admin access).',
          operationId: 'getFeedback',
          tags: ['Feedback'],
          responses: {
            '200': {
              description: 'List of feedback submissions',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackRequest',
                    },
                  },
                },
              },
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
            season: {
              type: 'string',
              example: 'Summer',
            },
            year: {
              type: 'integer',
              example: 2024,
            },
            usage: {
              type: 'string',
              example: 'Casual',
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
        FeedbackRequest: {
          type: 'object',
          required: ['type', 'description'],
          properties: {
            type: {
              type: 'string',
              enum: ['correction', 'feedback', 'bug', 'feature'],
              description: 'Type of feedback',
              example: 'correction',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'URL of the page/content being referenced',
              example: 'https://example.com/product/123',
            },
            description: {
              type: 'string',
              description: 'Description of the feedback or correction',
              example: 'The product price is incorrect',
            },
            correctInformation: {
              type: 'string',
              description: 'Correct information (for corrections)',
              example: 'The correct price is $29.99',
            },
            name: {
              type: 'string',
              description: 'Name of the submitter',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email of the submitter',
              example: 'john@example.com',
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
        name: 'Feedback',
        description: 'Feedback and correction submission endpoints',
      },
      {
        name: 'Performance',
        description: 'Performance monitoring and budget endpoints',
      },
    ],
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

