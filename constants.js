const stores = [
    {
        name: 'Target',
        imageUrl: '/api/images/template-poc/icon-brand-target.png',
        chainId: 'ab4b8230-d68a-012e-5619-003048cad9da'
    },
    {
        name: 'Walmart',
        imageUrl: '/api/images/template-poc/icon-brand-walmart.png',
        chainId: 'ab4b9fa0-d68a-012e-5619-003048cad9da'
    },
    {
        name: 'Aldi',
        imageUrl: '/api/images/template-poc/icon-brand-aldi.png',
        chainId: '16cbce60-992b-0132-fd75-7a163eb2a6fc'
    },
    {
        name: 'Walgreens',
        imageUrl: '/api/images/template-poc/icon-brand-walgreens.png',
        chainId: 'ab4b4810-d68a-012e-5619-003048cad9da'
    },
    {
        name: 'Kroger',
        imageUrl: '/api/images/template-poc/icon-brand-kroger.png',
        chainId: '627216b5-7fbb-438a-9f31-654972c07974'
    },
    {
        name: 'Costco',
        imageUrl: '/api/images/template-poc/icon-brand-costco.png',
        chainId: 'ab4b52b0-d68a-012e-5619-003048cad9da'
    },
    {
        name: 'Best Buy',
        imageUrl: '/api/images/template-poc/icon-brand-best-buy.png',
        chainId: 'ab4affd0-d68a-012e-5619-003048cad9da'
    },
    {
        name: "Kohl's",
        imageUrl: '/api/images/template-poc/icon-brand-kohls.png',
        chainId: '807c22cc-95bf-48b0-8568-ccd785543779'
    },
    {
        name: "The Home Depot",
        imageUrl: '/api/images/template-poc/icon-brand-the-home-depot.png',
        chainId: '46fc4e73-67c0-4449-8639-4e34369a2e15'
    },
    {
        name: "Lowe's",
        imageUrl: '/api/images/template-poc/icon-brand-lowes.png',
        chainId: '7fdd27b9-8e5d-4e48-b0f4-750f88702994'
    },
];
module.exports.stores = stores;

module.exports.cities = [
    {
        name: 'Houston, TX', region: 'US.TX.RR',
        tags: [
            {store: 'Target', tag: 'us-houston-food-stores-target'},
            {store: 'Walmart', tag: 'us-houston-food-stores-walmart'},
            {store: 'Aldi', tag: 'us-tx-rr-aldi-stores'},
            {store: 'Walgreens', tag: 'us-tx-rr-walgreens-stores'},
            {store: 'Kroger', tag: 'us-tx-rr-kroger-stores'},
            {store: 'Costco', tag: 'us-tx-rr-costco-stores'},
            {store: 'Best Buy', tag: 'us-tx-rr-best-buy-stores'},
            {store: "Kohl's", tag: 'us-tx-rr-kohls-stores'},
            {store: "The Home Depot", tag: 'us-tx-rr-the-home-depot-stores'},
            {store: "Lowe's", tag: 'us-tx-rr-lowes-stores'},
        ]
    },
    {
        name: 'Atlanta, GA', region: 'US.GA.FU',
        tags: [
            {store: 'Target', tag: 'us-atlanta-food-stores-target'},
            {store: 'Walmart', tag: 'us-atlanta-food-stores-walmart'},
            {store: 'Aldi', tag: 'us-ga-fu-aldi-stores'},
            {store: 'Walgreens', tag: 'us-ga-fu-walgreens-stores'},
            {store: 'Kroger', tag: 'us-ga-fu-kroger-stores'},
            {store: 'Best Buy', tag: 'us-ga-fu-best-buy-stores'},
            {store: 'The Home Depot', tag: 'us-ga-fu-the-home-depot-stores'},
            {store: "Lowe's", tag: 'us-ga-fu-lowes-stores'},
        ]
    },
    {
        name: 'Dallas, TX', region: 'US.TX.DS',
        tags: [
            {store: 'Target', tag: 'us-dallas-ftw-food-stores-target'},
            {store: 'Walmart', tag: 'us-dallas-ftw-food-stores-walmart'},
            {store: 'Aldi', tag: 'us-tx-ds-aldi-stores'},
            {store: 'Walgreens', tag: 'us-tx-ds-walgreens-stores'},
            // {store: 'Krogers', tag: 'us-tx-ds-kroger-stores'}, // TODO - orphan and handle
            {store: 'Costco', tag: 'us-tx-ds-costco-stores'},
            {store: 'Best Buy', tag: 'us-tx-ds-best-buy-stores'},
            {store: "Kohl's", tag: 'us-tx-ds-kohls-stores'},
            {store: "The Home Depot", tag: 'us-tx-ds-the-home-depot-stores'},
            {store: "Lowe's", tag: 'us-tx-ds-lowes-stores'},
        ]
    },
    {
        name: 'Detroit, MI', region: 'US.MI.WY', tags: [
            {store: 'Target', tag: 'us-detroit-food-stores-target'},
            {store: 'Walmart', tag: 'us-detroit-food-stores-walmart'},
            {store: 'Aldi', tag: 'us-mi-wy-aldi-stores'},
            {store: 'Walgreens', tag: 'us-mi-wy-walgreens-stores'},
            {store: 'Krogers', tag: 'us-mi-wy-kroger-stores'},
            {store: 'Costco', tag: 'us-mi-wy-costco-stores'},
            {store: 'Best Buy', tag: 'us-mi-wy-best-buy-stores'},
            {store: 'The Home Depot', tag: 'us-mi-wy-the-home-depot-stores'},
            {store: "Lowe's", tag: 'us-mi-wy-lowes-stores'},
        ]
    },
    {
        name: 'Chicago, IL', region: 'US.IL.CO', tags: [
            {store: 'Target', tag: 'us-chicago-food-stores-target'},
            {store: 'Walmart', tag: 'us-chicago-food-stores-walmart'},
            {store: 'Aldi', tag: 'us-il-co-aldi-stores'},
            {store: 'Walgreens', tag: 'us-il-co-walgreens-stores'},
            {store: 'Krogers', tag: 'us-il-co-kroger-stores'},
            {store: 'Costco', tag: 'us-il-co-costco-stores'},
            {store: 'Best Buy', tag: 'us-il-co-best-buy-stores'},
            {store: 'The Home Depot', tag: 'us-il-co-the-home-depot-stores'},
            {store: "Lowe's", tag: 'us-il-co-lowes-stores'},
        ]
    },
    {
        name: 'Boston, MA', region: 'US.MA.SU', tags: [
            {store: 'Target', tag: 'us-boston-food-stores-target'},
            {store: 'Walmart', tag: 'us-boston-food-stores-walmart'},
        ]
    },
    {
        name: 'Miami, FL', region: 'US.FL.DA',
        tags: [
            {store: 'Target', tag: 'us-miami-food-stores-target'},
            {store: 'Walmart', tag: 'us-miami-food-stores-walmart'},
        ]
    },
    {
        name: 'Philadelphia, PA', region: 'US.PA.PH',
        tags: [
            {store: 'Target', tag: 'us-philadelphia-food-stores-target'},
            {store: 'Walmart', tag: 'us-philadelphia-food-stores-walmart'},
        ]
    },
    {
        name: 'Phoenix, AZ', region: 'US.AZ.MA',
        tags: [
            {store: 'Target', tag: 'us-phoenix-food-stores-target'},
            {store: 'Walmart', tag: 'us-phoenix-food-stores-walmart'},
        ]
    },
    {
        name: 'New York, NY', region: 'US.NY.NE',
        tags: [
            {store: 'Target', tag: 'us-nyc-food-stores-target'},
            {store: 'Walmart', tag: 'us-nyc-food-stores-walmart'},
        ]
    },
    {
        name: 'Los Angeles, CA', region: 'US.CA.LO',
        tags: [
            {store: 'Target', tag: 'us-la-food-stores-target'},
            {store: 'Walmart', tag: 'us-la-food-stores-walmart'},
        ]
    },
    {
        name: 'Seattle, WA', region: 'US.WA.KN',
        tags: [
            {store: 'Target', tag: 'us-seattle-food-stores-target'},
            {store: 'Walmart', tag: 'us-seattle-food-stores-walmart'},
        ]
    },
    {
        name: 'San Francisco, CA', region: 'US.CA.SF',
        tags: [
            {store: 'Target', tag: 'us-sf-food-stores-target'},
            {store: 'Walmart', tag: 'us-sf-food-stores-walmart'},
        ]
    }
].map(city => {
    const storeNames = stores.map(store => store.name);
    const tags = storeNames.map(storeName => {
        const tag = city.tags.find(d => d.store === storeName);
        if (tag) {
            return tag
        }
        return {store: storeName}
    })
    return {
        ...city,
        tags
    }
});

module.exports.environmentLookup = new Map([
    ['prod', [process.env.WEB_PROXY_PROD_URL, process.env.BEARER_TOKEN_PROD]],
    ['qa', [process.env.WEB_PROXY_QA_URL, process.env.BEARER_TOKEN_QA]],
    ['dev', [process.env.WEB_PROXY_DEV_URL, process.env.BEARER_TOKEN_DEV]],
])
