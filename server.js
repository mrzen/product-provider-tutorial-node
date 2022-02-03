const Express = require('express'),
      app = Express(),
      auth = require('./auth'),
      port = process.env.PORT || 3000,
      products = require("./data/products.json");

if (process.env.NODE_ENV !== 'development') app.use(auth);

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/service', (req, res) => {
    res.status(200).json(require('./service'));
});

app.get('/products/search', (req, res) => {

    const offset = req.query.offset || 0,
          limit  = req.query.limit || 10;

    const results = products.filter((p) => {
        let match = true;

        let { price } = req.query;

        // Apply price filter
        if (price) {
            if (price.currency) match &= p.pricing.price.currency === price.currency;
            if (price.min) match &= p.pricing.price.value >= price.min;
            if (price.max) match &= p.pricing.price.value <= price.max;
        }

        return match;
    }).sort((a, b) => {
        // Sort Results
        const { sort } = req.query;
        
        switch (sort) {
            case 'id':
            case 'name':
                return a[sort] >= b[sort];
            case 'price':
                return a.pricing.price.value >= b.pricing.price.value;
            default:
                a
                return a.name >= b.name;
        }
    }).slice(offset, limit);

    res.status(200).json(results);
});

app.get('/products/:id', (req, res) => {
    const { id } = req.params;

    const product = products.find((p) => p.id === id);

    if (product) {
        res.json(product).status(200);
    } else {
        res.status(404).json({ error: 'Product not found'});
    }
});

app.get('/products', (req, res) => {
    res.status(200).json(products);
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});