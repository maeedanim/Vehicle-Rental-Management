import swaggerJSDoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Vehicle Rental Management API',
      version: '1.0.0',
      description:
        'REST API for managing vehicles, rentals, staff authentication, and rental reports.',
    },

    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],

    tags: [
      {
        name: 'Authentication',
        description: 'Staff authentication endpoints',
      },
      {
        name: 'Vehicles',
        description: 'Vehicle management endpoints',
      },
      {
        name: 'Rentals',
        description: 'Vehicle rental management endpoints',
      },
      {
        name: 'Reports',
        description: 'Rental reporting endpoints',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token.',
        },
      },

      schemas: {
        /*
         * =========================
         * AUTHENTICATION
         * =========================
         */

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },

        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },

        /*
         * =========================
         * VEHICLE
         * =========================
         */

        Vehicle: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 5,
            },
            name: {
              type: 'string',
              example: 'Toyota Corolla',
            },
            plateNumber: {
              type: 'string',
              example: 'DHAKA-1234',
            },
            category: {
              type: 'string',
              example: 'Sedan',
            },
            dailyRate: {
              type: 'number',
              format: 'float',
              example: 3500,
            },
            photoPath: {
              type: 'string',
              nullable: true,
              example: null,
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-08-11T12:34:56.319Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-08-11T20:30:39.614Z',
            },
          },
        },

        /*
         * =========================
         * RENTAL
         * =========================
         */

        Rental: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            vehicleId: {
              type: 'integer',
              example: 5,
            },
            customerName: {
              type: 'string',
              example: 'Rahim Ahmed',
            },
            customerPhone: {
              type: 'string',
              example: '01710000001',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2026-08-10',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2026-08-12',
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              example: 10500,
            },
            status: {
              type: 'string',
              example: 'booked',
            },
          },
        },

        /*
         * =========================
         * ERROR
         * =========================
         */

        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Something went wrong',
            },
          },
        },

        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['"email" must be a valid email'],
            },
          },
        },
      },
    },
  },

  /*
   * Swagger scans these files for
   * @swagger JSDoc definitions.
   */
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;