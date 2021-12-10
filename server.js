// This is a public sample test API key.
// To avoid exposing it, don't submit any personally identifiable information through requests with this API key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
    const product = await stripe.products.create({ name: "T-shirt" });
    console.log(product);
    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 2000,
        currency: "usd",
    });
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: price.id,
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.redirect(303, session.url);
});

app.listen(4242, () => console.log("Running on port 4242"));
