## Basic instructions for use:

1. Download the files to your local device or clone the repository.
2. Navigate to the project's root directory and get dependencies by running ```npm install```
3. In the root directory, create a .env file
4. In the .env file, create an environment variable OPENAI_API_KEY and copy+paste your OpenAI API key to this variable

#### NOTE: Using OpenAI's API is not completely free. You start off with an $18.00 credit after which you will have to pay every time someone makes a call to it (which happens after each message and costs about $0.005 per message)

5. In the root directory, create a folder called .webpack.
6. Inside the .webpack folder, create a file called webpack.config.js
7. Copy and paste the following, replacing ">>YOUR API KEY<<" with your actual API key

```javascript
const webpack = require('webpack');

module.exports = {
    entry: '../src/scripts/chat.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
    },
    plugins: [
    new webpack.DefinePlugin({
        'process.env.OPENAI_API_KEY': JSON.stringify('>>YOUR API KEY<<'),
    }),
    ],
};
```

8. Run the command ```npm run bundle```. If no errors occur, everything was done correctly and the website should be able to load properly.
