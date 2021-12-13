// This is a public sample test API key. Code from Stripe Official Documentation
// To avoid exposing it, don't submit any personally identifiable information through requests with this API key.
// Sign in to see your own test API key embedded in code samples.

const express = require("express");
const path = require("path");
const app = express();

//declare public
app.use(express.static(path.join(__dirname, "public")));

//config dotenv
require("dotenv").config();

const YOUR_DOMAIN = process.env.DOMAIN;
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

app.use(async (req, res, next) => {
    //create a product
    const product = await stripe.products.create({ name: "T-shirt" });

    //create a price id
    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 2000,
        currency: "usd",
    });

    req.locals = {
        price,
    };
    next();
});

app.post("/create-checkout-session", async (req, res) => {
    //extract the price from locals
    const { price } = req.locals;

    //start a stripe session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: price.id,
                quantity: 1,
            },
        ],
        mode: "payment",

        //set succss url to session url
        success_url: `${YOUR_DOMAIN}/success.html`,

        //set failure url to session url
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    //redirect to session url
    res.redirect(303, session.url);
});

const PORT = process.env.PORT || 5000;
//start server
app.listen(PORT, () => console.log("Running on port 4242"));
