import { NextResponse } from 'next/server';

/**
 * GraphQL Schema Endpoint
 * Returns the GraphQL schema in SDL (Schema Definition Language) format
 * Accessible at /api/graphql
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // GraphQL Schema Definition Language (SDL)
  const graphqlSchema = `
# GraphQL Schema for THE STORE API
# This schema provides a GraphQL interface to THE STORE e-commerce platform

type Query {
  """
  Get all products from the catalog
  """
  products(
    """
    Filter by category
    """
    category: String
    
    """
    Filter by gender
    """
    gender: String
    
    """
    Filter by color
    """
    color: String
    
    """
    Limit the number of results
    """
    limit: Int
    
    """
    Skip a number of results (for pagination)
    """
    skip: Int
  ): [Product!]!
  
  """
  Get a single product by ID
  """
  product(id: ID!): Product
  
  """
  Search products by query string
  """
  searchProducts(query: String!): [Product!]!
  
  """
  Get current user information
  """
  me: User
  
  """
  Get user's orders
  """
  orders: [Order!]!
  
  """
  Get a single order by ID
  """
  order(id: ID!): Order
}

type Mutation {
  """
  Register a new user account
  """
  register(input: RegisterInput!): AuthPayload!
  
  """
  Login with username/email and password
  """
  login(input: LoginInput!): AuthPayload!
  
  """
  Logout the current user
  """
  logout: Boolean!
  
  """
  Create a new order
  """
  createOrder(input: OrderInput!): Order!
  
  """
  Submit feedback or correction
  """
  submitFeedback(input: FeedbackInput!): FeedbackResponse!
}

"""
Product type representing an item in the catalog
"""
type Product {
  """
  Unique product identifier
  """
  id: ID!
  
  """
  Product display name
  """
  name: String!
  
  """
  Product gender category
  """
  gender: String
  
  """
  Master category (e.g., Apparel, Footwear)
  """
  masterCategory: String
  
  """
  Sub category (e.g., Topwear, Bottomwear)
  """
  subCategory: String
  
  """
  Article type (e.g., Tshirt, Jeans)
  """
  articleType: String
  
  """
  Base color of the product
  """
  baseColour: String
  
  """
  Season (e.g., Summer, Winter)
  """
  season: String
  
  """
  Year of production
  """
  year: Int
  
  """
  Usage type (e.g., Casual, Formal)
  """
  usage: String
  
  """
  Product image URL
  """
  imageURL: String
  
  """
  Price in USD
  """
  priceUSD: Float!
}

"""
User type
"""
type User {
  """
  User ID
  """
  id: ID!
  
  """
  User's full name
  """
  name: String!
  
  """
  User's email address
  """
  email: String!
  
  """
  User's phone number
  """
  phone: String
  
  """
  User's address
  """
  address: Address
}

"""
Address type
"""
type Address {
  """
  Street address
  """
  street: String!
  
  """
  City
  """
  city: String!
  
  """
  State or province
  """
  state: String!
  
  """
  ZIP or postal code
  """
  zipcode: String!
}

"""
Order type
"""
type Order {
  """
  Order ID
  """
  id: ID!
  
  """
  Order identifier (human-readable)
  """
  orderId: String!
  
  """
  Order status
  """
  status: String!
  
  """
  Order message
  """
  message: String
  
  """
  Expected arrival date
  """
  arrivalDate: String
  
  """
  Order items
  """
  items: [OrderItem!]!
  
  """
  Total amount
  """
  totalAmount: Float!
  
  """
  Shipping address
  """
  shippingAddress: Address!
  
  """
  Order timestamp
  """
  timestamp: String!
}

"""
Order item type
"""
type OrderItem {
  """
  Product ID
  """
  productId: ID!
  
  """
  Quantity
  """
  quantity: Int!
  
  """
  Price per item
  """
  priceUSD: Float!
  
  """
  Product details
  """
  product: Product
}

"""
Authentication payload
"""
type AuthPayload {
  """
  Authentication token
  """
  token: String!
  
  """
  User information
  """
  user: User!
  
  """
  Success status
  """
  success: Boolean!
}

"""
Register input
"""
input RegisterInput {
  """
  User's full name
  """
  name: String!
  
  """
  User's email address
  """
  email: String!
  
  """
  User's phone number
  """
  phone: String!
  
  """
  Street address
  """
  street: String!
  
  """
  City
  """
  city: String!
  
  """
  State or province
  """
  state: String!
  
  """
  ZIP or postal code
  """
  zipcode: String!
  
  """
  Password (minimum 6 characters)
  """
  password: String!
}

"""
Login input
"""
input LoginInput {
  """
  Username or email address
  """
  username: String!
  
  """
  Password
  """
  password: String!
}

"""
Order input
"""
input OrderInput {
  """
  Customer name
  """
  name: String!
  
  """
  Street address
  """
  streetAddress: String!
  
  """
  City
  """
  city: String!
  
  """
  State or province
  """
  state: String!
  
  """
  ZIP or postal code
  """
  zipcode: String!
  
  """
  Order items
  """
  items: [OrderItemInput!]!
  
  """
  Total amount
  """
  totalAmount: Float!
  
  """
  Order timestamp (Unix timestamp)
  """
  timestamp: Int
}

"""
Order item input
"""
input OrderItemInput {
  """
  Product ID
  """
  id: ID!
  
  """
  Quantity
  """
  quantity: Int!
  
  """
  Price per item
  """
  priceUSD: Float!
}

"""
Feedback input
"""
input FeedbackInput {
  """
  Type of feedback (correction, feedback, bug, feature)
  """
  type: String!
  
  """
  URL of the page/content being referenced
  """
  url: String!
  
  """
  Description of the feedback or correction
  """
  description: String!
  
  """
  Correct information (for corrections)
  """
  correctInformation: String
  
  """
  Name of the submitter
  """
  name: String
  
  """
  Email of the submitter
  """
  email: String
}

"""
Feedback response
"""
type FeedbackResponse {
  """
  Success status
  """
  success: Boolean!
  
  """
  Feedback ID
  """
  id: String!
  
  """
  Response message
  """
  message: String!
}
`;

  return NextResponse.json({
    schema: graphqlSchema.trim(),
    format: 'SDL',
    version: '1.0.0',
    description: 'GraphQL Schema for THE STORE API',
    endpoints: {
      graphql: `${baseUrl}/api/graphql`,
      graphiql: `${baseUrl}/api/graphiql`,
    },
    documentation: {
      url: `${baseUrl}/api/docs`,
      openapi: `${baseUrl}/api/openapi.json`,
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// Also support POST requests for GraphQL queries (standard GraphQL endpoint)
export async function POST(request: Request) {
  try {
    await request.json();
    
    // For now, return schema information
    // In a full implementation, this would execute the GraphQL query
    // const { query, variables, operationName } = body;
    return NextResponse.json({
      data: {
        __schema: {
          description: 'GraphQL Schema for THE STORE API',
          queryType: {
            name: 'Query',
          },
          mutationType: {
            name: 'Mutation',
          },
        },
      },
      message: 'GraphQL endpoint is available. Use GET /api/graphql to retrieve the full schema.',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return NextResponse.json({
      errors: [{
        message: 'Invalid request. Expected JSON with query, variables, and operationName.',
      }],
    }, {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

