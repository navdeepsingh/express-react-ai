module.exports = {
  'port' : 8080,

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
            maxAge: 1000 * 60 * 60, // would expire after 60 minutes
        }
  }
}
