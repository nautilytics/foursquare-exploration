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

        ]
    },
    {
        name: 'Atlanta, GA', region: 'US.GA.FU',
        tags: [
            {store: 'Target', tag: 'us-atlanta-food-stores-target'},
            {store: 'Walmart', tag: 'us-atlanta-food-stores-walmart'},
        ]
    },
    {
        name: 'Dallas, TX', region: 'US.TX.DS',
        tags: [
            {store: 'Target', tag: 'us-dallas-ftw-food-stores-target'},
            {store: 'Walmart', tag: 'us-dallas-ftw-food-stores-walmart'},
        ]
    },
    {
        name: 'Detroit, MI', region: 'US.MI.WY', tags: [
            {store: 'Target', tag: 'us-detroit-food-stores-target'},
            {store: 'Walmart', tag: 'us-detroit-food-stores-walmart'},
        ]
    },
    {
        name: 'Chicago, IL', region: 'US.IL.CO', tags: [
            {store: 'Target', tag: 'us-chicago-food-stores-target'},
            {store: 'Walmart', tag: 'us-chicago-food-stores-walmart'},
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
