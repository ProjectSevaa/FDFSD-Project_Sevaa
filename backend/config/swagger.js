import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sevaa API Documentation",
            version: "1.0.0",
            description:
                "API documentation for the Sevaa Food Donation Platform",
            contact: {
                name: "API Support",
                email: "support@sevaa.com",
            },
        },
        servers: [
            {
                url: "http://localhost:9500",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "jwt",
                },
            },
        },
    },
    apis: ["./routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
