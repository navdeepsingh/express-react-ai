module.exports = require('./' + (process.env.NODE_ENV || 'development') + '.json');
module.exports = {
  'port' : 8080,

  'dbUrl' : 'mongodb://localhost/express_react_ai',

  'facebook': {
    'APP_ID': '212924785417190',
    'APP_SECRET': '4b4ca4e47912416d3cc74479d7112c04',
    'CALLBACK_URL': 'http://localhost:8080/auth/facebook/callback'
  },

  'twitter': {
    'CONSUMER_KEY': 'ldpD1BvSW8NvJ9fSAcp3DZsX4',
    'CONSUMER_SECRET': 'le0ZHwXEHggbJmjVpdgw6ttfT6wn07r5k5N2n1XoRle00khbWH',
    'CALLBACK_URL': 'http://localhost:8080/auth/twitter/callback'
  },

  'jwt': {
    'SECRET_OR_KEY': 'DevilCircuit',
    'options' : {
            maxAge: 1000 * 60 * 120, // would expire after 120 minutes
        }
  },

  'alchemyapi': {
    'username': '550b8618-3cbd-4bb1-920e-808570a648fb',
    'password': "Q1dRI1CaHMld"
  }
}
