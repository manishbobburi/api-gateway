const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const { ServerConfig } = require("./config");
const { AuthMiddlewares } = require("./middlewares/");
const apiRoutes = require("./routes");

const app = express();

const limiter = rateLimit({
    window: 1 * 60 * 1000,
    limit: 30,
});

app.use(limiter);

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-access-token"],
    credentials: true
}));


app.use("/flightService", 
    AuthMiddlewares.checkAuth,
    createProxyMiddleware({
        target: ServerConfig.FLIGHT_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            '^/flightService': '',
        }
    })
);
    
app.use("/bookingService",
    AuthMiddlewares.checkAuth,
    createProxyMiddleware({
        target: ServerConfig.BOOKING_SERVICE, 
        changeOrigin: true,
        pathRewrite: {
            '^/bookingService': '',
        }
    })
);
        
app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
